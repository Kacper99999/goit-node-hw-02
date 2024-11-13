 const { json } = require('express');
const fs = require('fs/promises');
 const path = require('path');
const __dirname = path.dirname(__filename);
const contactPath = path.join(__dirname,"models","contacts.json");

const listContacts = async () => {
  try{
    const data = await fs.readFile(contactPath,"utf-8");
    const contacts = JSON.parse(data);  
    return contacts;
  }
  catch{
    return [];
  }
}

const getContactById = async (contactId) => {
  try{
    const data = fs.readFile(contactPath,'utf-8');
    const contacts = JSON.parse(data);
    const contact = contacts.find(con => con.id === contactId);
    return contact;
  }
  catch{
    return [];
  }
}

const removeContact = async (contactId) => {
  try{
    const data = fs.readFile(contactPath,'utf-8');
    const contacts = JSON.parse(data);

    const updatedContacts = contacts.filter(con => con.id !== contactId);
    await fs.writeFile(contactPath,JSON.stringify(updatedContacts,null,2));
    return updatedContacts;
  }
  catch(error){
    return [];
  }
}


const addContact = async (body) => {
  try{
    const data = fs.readFile(contactPath,'utf-8');
    const contacts = JSON.parse(data);
    const updatedContacts = contacts.push(body)
    await fs.writeFile(contactPath,JSON.stringify(updatedContacts,null,2));
  }
  catch{
    return []
  }
}

const updateContact = async (contactId, body) => {
  try{
    const data = fs.readFile(contactPath,'utf-8');
    const contacts = JSON.parse(data);
    const index = contacts.findIndex(con => con.id === contactId);
    contacts[index] = {...contacts[index], ...body};
    await fs.writeFile(contactPath,JSON.stringify(contacts,null,2));
  }
  catch{
    return []
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
