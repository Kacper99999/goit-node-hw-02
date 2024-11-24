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

const addContact = async (body) => {
  try{
    const newContact = await Contact.create(body);
    return newContact;
  }
  catch(error){
    console.error("Something went wrong ",error)
    throw error;
  }
}

const updateContact = async (contactId, body) => {
  try{
    const updateContact = await Contact.findByIdAndUpdate(contactId, body, {new:true});
    return updateContact;
  }
  catch(error){
    console.error("Something went wrong ",error)
    throw error;
  }
}

const updateStatusContact = async(contactId, body) => {
  try{
    const updateContact = await Contact.findByIdAndUpdate(contactId, {$set:{favorite:body.favorite}}, {new:true});
    return updateContact;
  }
  catch(error){
    console.error("Something went wrong ",error)
    throw error;
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact
}
