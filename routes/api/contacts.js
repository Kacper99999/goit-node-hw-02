const express = require('express')
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require('../../models/contacts.js')
const router = express.Router()

router.get('/', async (req, res, next) => {
  try{
    const contacts = await listContacts();
    res.json(contacts);
  }
  catch(error){
    next(error);
  }
})

router.get('/:contactId', async (req, res, next) => {
  try{
    console.log("featching")
    const id = req.params.contactId
    const contactID = await getContactById(id);
    console.log("featched");
    res.json(contactID);
  }
  catch(error){
    next(error);
  }
})

router.post('/', async (req, res, next) => {

})

router.delete('/:contactId', async (req, res, next) => {
  try{
    const id = req.params.contactId
    await removeContact(id)
    res.json({message: 'Contact delate'})
  }
  catch(error){
    next(error);
  }
})

router.put('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' })
})

module.exports = router
