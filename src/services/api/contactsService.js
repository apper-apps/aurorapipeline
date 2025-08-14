import contactsData from "@/services/mockData/contacts.json";

let contacts = [...contactsData];

export const ContactsService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...contacts];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return contacts.find(contact => contact.Id === parseInt(id)) || null;
  },

  async create(contactData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const maxId = Math.max(...contacts.map(c => c.Id), 0);
    const newContact = {
      ...contactData,
      Id: maxId + 1,
      createdAt: new Date().toISOString()
    };
    contacts.push(newContact);
    return { ...newContact };
  },

  async update(id, contactData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = contacts.findIndex(contact => contact.Id === parseInt(id));
    if (index === -1) throw new Error("Contact not found");
    
    contacts[index] = {
      ...contacts[index],
      ...contactData,
      Id: parseInt(id)
    };
    return { ...contacts[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = contacts.findIndex(contact => contact.Id === parseInt(id));
    if (index === -1) throw new Error("Contact not found");
    
    const deletedContact = contacts.splice(index, 1)[0];
    return { ...deletedContact };
  }
};