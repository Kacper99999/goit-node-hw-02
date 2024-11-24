const express = require('express')
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact
} = require('../../models/contacts.js')
const router = express.Router()

router.get('/', async (req, res, next) => {
  try{
    const contacts = await listContacts();
    res.json(contacts).status(200);
  }
  catch(error){
    next(error).status(500);
  }
})

router.get('/:contactId', async (req, res, next) => {
  try{
    const id = req.params.contactId
    const contactID = await getContactById(id);
    if(!contactID){
      res.status(400).json({message:"Not found"})
    }
    res.json(contactID).status(200);
  }
  catch(error){
    next(error).status(500);
  }
})

router.post('/', async (req, res, next) => {
  console.log(req.body);
  const {name, email, phone} = req.body;
  try{
    const newContact = await addContact({name, email, phone})
    res.json(newContact).status(200);
  }
  catch(error){
    next(error).status(500);
  }
})

router.delete('/:contactId', async (req, res, next) => {
  try{
    const id = req.params.contactId
    const contactID = await removeContact(id)
    if(!contactID){
      res.status(400).json({message:"Not found"})
    }
    res.json({message: 'Contact delate'}).status(200)
  }
  catch(error){
    next(error).status(500);
  }
})

router.put('/:contactId', async (req, res, next) => {
  const id = req.params.contactId;
  const {name, emial, phone} = req.body;
  try{
    const update = await updateContact(id, {name, emial, phone})
    if(!update){
      res.status(400).json({message:"Not found"})
    }
    res.json({message:"Contact updated"}).status(200);
  }
  catch(error){
    next(error).status(500);
  }
})

router.patch('/:contactId/favorite', async (req, res, next) => {
  const id = req.params.contactId;
  const{favorite} = req.body;
  if(!req.body){
    res.status(400).json({message: "missing field favorite"})
  }
  try{
    await updateStatusContact(id,{favorite});
    res.status(200).json({message:"Contact updated"});
  }
  catch{
    res.status(400).json({message:"Not found"})
  }
})

module.exports = router
