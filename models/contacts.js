//const fs = require('fs/promises')
const Contact = require("./schema");

const listContacts = async () => {
  try{
    const contacts = await Contact.find();
    return contacts;
  }
  catch(error){
    console.error("Something went wrong ", error)
    throw error;
  }
}

const getContactById = async (contactId) => {
  try{
    const contact = await Contact.findById(contactId);
    return contact;
  }
  catch(error){
    console.error("Something went wrong ", error)
    throw error;
  }
}

const removeContact = async (contactId) => {
  try{
    const contactToDelate = await Contact.findByIdAndDelete(contactId);
    return contactToDelate;
  }
  catch(error) {
    console.error("Something went wrong ", error)
    throw error;
  }
}

const addContact = async (body) => {}

const updateContact = async (contactId, body) => {}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
