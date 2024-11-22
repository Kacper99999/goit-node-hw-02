//const fs = require('fs/promises')
const Contact = require("./schema");

const listContacts = async () => {
  Contact.find()
  .then((contacts) => {
    console.log("All contacts: ", contacts)
  })
  .catch(error){
    console.log(error);
  }
}

const getContactById = async (contactId) => {}

const removeContact = async (contactId) => {}

const addContact = async (body) => {}

const updateContact = async (contactId, body) => {}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
