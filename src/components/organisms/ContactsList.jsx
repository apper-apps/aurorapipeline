import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import ContactTable from "@/components/molecules/ContactTable";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { ContactsService } from "@/services/api/contactsService";

const ContactsList = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

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
    if (!window.confirm(`Are you sure you want to delete ${contact.name}?`)) return;

    try {
      await ContactsService.delete(contact.Id);
      setContacts(prev => prev.filter(c => c.Id !== contact.Id));
      toast.success("Contact deleted successfully");
    } catch (err) {
      toast.error("Failed to delete contact");
    }
  };

  const handleCreateDeal = (contact) => {
    toast.info(`Creating deal for ${contact.name}...`);
  };

  const handleEdit = (contact) => {
    toast.info(`Editing ${contact.name}...`);
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase())
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
        <Button variant="primary" icon="Plus">
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
          />
        )}
      </Card>
    </div>
  );
};

export default ContactsList;