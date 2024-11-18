const fs = require('fs/promises');
const path = require('path');
async function generateId() {
  const { nanoid } = await import('nanoid');
  return nanoid();
}

const contactsPath = path.join(__dirname, './contacts.json');  


const listContacts = async () => {
  const data = await fs.readFile(contactsPath, 'utf-8');
  return JSON.parse(data);
};


const getContactById = async (contactId) => {
  const contacts = await listContacts();
  return contacts.find(contact => contact.id === contactId);
};


const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const index = contacts.findIndex(contact => contact.id === contactId);
  if (index === -1) return null;
  const deletedContact = contacts.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return deletedContact;
};


const addContact = async ({ name, email, phone }) => {
  const contacts = await listContacts();
  const newContact = {
    id: await generateId(),  
    name,
    email,
    phone
  };
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
};


const updateContact = async (contactId, { name, email, phone }) => {
  const contacts = await listContacts();
  const index = contacts.findIndex(contact => contact.id === contactId);
  if (index === -1) return null;
  const updatedContact = { ...contacts[index], name, email, phone };
  contacts[index] = updatedContact;
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return updatedContact;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact
};
