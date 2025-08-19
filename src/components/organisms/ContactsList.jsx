import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ContactsService } from "@/services/api/contactsService";
import Contacts from "@/components/pages/Contacts";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import SearchBar from "@/components/molecules/SearchBar";
import ContactTable from "@/components/molecules/ContactTable";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Select from "@/components/atoms/Select";

const ContactsList = () => {
const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newContact, setNewContact] = useState({
    Name: "",
    email_c: "",
    phone_c: "",
    company_c: "",
    lead_source_c: ""
  });
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await ContactsService.getAll();
      setContacts(data);
    } catch (err) {
      setError("Failed to load contacts");
      toast.error("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

const handleDelete = async (contact) => {
    if (!window.confirm(`Are you sure you want to delete ${contact.Name}?`)) return;

    try {
      await ContactsService.delete(contact.Id);
      setContacts(prev => prev.filter(c => c.Id !== contact.Id));
      toast.success("Contact deleted successfully");
    } catch (err) {
      toast.error("Failed to delete contact");
    }
  };

const handleCreateDeal = (contact) => {
    toast.info(`Creating deal for ${contact.Name}...`);
  };

const handleEdit = (contact) => {
    toast.info(`Editing ${contact.Name}...`);
  };

  const handleAddContact = async () => {
    if (!newContact.Name.trim() || !newContact.email_c.trim()) {
      toast.error("Name and Email are required");
      return;
    }

    try {
      setIsCreating(true);
      const createdContact = await ContactsService.create(newContact);
      
      if (createdContact) {
        toast.success("Contact created successfully");
        setContacts(prev => [...prev, createdContact]);
        setNewContact({
          Name: "",
          email_c: "",
          phone_c: "",
          company_c: "",
          lead_source_c: ""
        });
        setShowAddModal(false);
      } else {
        toast.error("Failed to create contact");
      }
    } catch (err) {
      toast.error("Failed to create contact");
    } finally {
      setIsCreating(false);
    }
  };

  const handleInputChange = (field, value) => {
    setNewContact(prev => ({
      ...prev,
      [field]: value
    }));
  };

const filteredContacts = contacts.filter(contact =>
    contact.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.company_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email_c?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loading variant="skeleton" />;
  if (error) return <Error message={error} onRetry={loadContacts} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-gray-900">Contacts</h2>
          <p className="text-gray-600 mt-1">Manage your contacts and leads</p>
        </div>
<Button variant="primary" icon="Plus" onClick={() => setShowAddModal(true)}>
          Add Contact
        </Button>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search contacts..."
        />
      </div>

      {/* Contacts Table */}
      <Card className="overflow-hidden">
        {filteredContacts.length > 0 ? (
          <ContactTable
            contacts={filteredContacts}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCreateDeal={handleCreateDeal}
          />
        ) : (
<Empty
            icon="Users"
            title="No contacts found"
            description={searchTerm ? "No contacts match your search criteria." : "Add your first contact to get started."}
            actionText="Add Contact"
            onAction={() => setShowAddModal(true)}
          />
        )}
      </Card>

      {/* Add Contact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Add New Contact</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                icon="X" 
                onClick={() => setShowAddModal(false)}
              />
            </div>

            <div className="space-y-4">
              <Input
                label="Name *"
                value={newContact.Name}
                onChange={(e) => handleInputChange("Name", e.target.value)}
                placeholder="Enter contact name"
              />

              <Input
                label="Email *"
                type="email"
                value={newContact.email_c}
                onChange={(e) => handleInputChange("email_c", e.target.value)}
                placeholder="Enter email address"
              />

              <Input
                label="Phone"
                value={newContact.phone_c}
                onChange={(e) => handleInputChange("phone_c", e.target.value)}
                placeholder="Enter phone number"
              />

              <Input
                label="Company"
                value={newContact.company_c}
                onChange={(e) => handleInputChange("company_c", e.target.value)}
                placeholder="Enter company name"
              />

              <Select
                label="Lead Source"
                value={newContact.lead_source_c}
                onChange={(e) => handleInputChange("lead_source_c", e.target.value)}
                options={[
                  { value: "Website", label: "Website" },
                  { value: "Referral", label: "Referral" },
                  { value: "Social Media", label: "Social Media" },
                  { value: "Email Campaign", label: "Email Campaign" },
                  { value: "Cold Call", label: "Cold Call" },
                  { value: "Trade Show", label: "Trade Show" },
                  { value: "Other", label: "Other" }
                ]}
                placeholder="Select lead source"
              />
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <Button 
                variant="secondary" 
                onClick={() => setShowAddModal(false)}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={handleAddContact}
                loading={isCreating}
                disabled={isCreating}
              >
                Create Contact
              </Button>
            </div>
          </div>
</div>
      )}
    </div>
  );
};

export default ContactsList;