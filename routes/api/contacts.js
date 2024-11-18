const express = require('express');
const { listContacts, getContactById, addContact, removeContact, updateContact } = require('../../models/contacts');
const router = express.Router();
const schema = require("./validation")


router.get('/', async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.json(contacts);  
  } catch (err) {
    next(err);
  }
});


router.get('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const contact = await getContactById(contactId);
    if (!contact) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.json(contact);  
  } catch (err) {
    next(err);
  }
});


router.post('/', async (req, res, next) => {
  const { name, email, phone } = req.body;
  const {error} = schema.validate(req.body);
  if (error) {
    console.log(error.details);
    return res.status(400).json({ message: 'missing required name, email or phone' });
  }
  try {
    const newContact = await addContact({ name, email, phone });
    res.status(201).json(newContact);  
  } catch (err) {
    next(err);
  }
});



router.delete('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const deleted = await removeContact(contactId);
    if (!deleted) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.json({ message: 'contact deleted' });  
  } catch (err) {
    next(err);
  }
});


router.put("/:contactId", async (req, res, next) => {
  const index = req.params.contactId;
  const {name, emial, phone} = req.body;
  const {error} = schema.validate(req.body);
  if(error){
     return res.status(400).json({ message: 'missing fields' });
  }
  try{
    const updatedContact = await updateContact(index,{name,emial,phone});
    if(!updateContact){
      return res.status(404).json({ message: 'Not found' });
    }
    res.json(updatedContact);
  }
  catch(error){
    next(error);

  }
});

module.exports = router;