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
const authentice = require('../../middleware/authMiddleware.js')

router.get('/', authentice, async (req, res, next) => {
  try{
    const contacts = await listContacts();
    res.json(contacts).status(200);
  }
  catch(error){
    next(error);
  }
})

router.get('/:contactId', authentice, async (req, res, next) => {
  try{
    const id = req.params.contactId
    const contactID = await getContactById(id);
    if(!contactID){
      res.status(400).json({message:"Not found"})
    }
    res.json(contactID).status(200);
  }
  catch(error){
    next(error);
  }
})

router.post('/', authentice, async (req, res, next) => {
  const {name, email, phone, favorite} = req.body;
  const owner = req.user.id;
  try{
    const newContact = await addContact({name, email, phone, favorite, owner})
    res.json(newContact).status(201);
  }
  catch(error){
    next(error);
  }
})

router.delete('/:contactId', authentice, async (req, res, next) => {
  try{
    const id = req.params.contactId
    const contactID = await removeContact(id)
    if(!contactID){
      res.status(400).json({message:"Not found"})
    }
    res.json({message: 'Contact delate'}).status(200)
  }
  catch(error){
    next(error);
  }
})

router.put('/:contactId', authentice, async (req, res, next) => {
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
    next(error);
  }
})

router.patch('/:contactId/favorite', authentice, async (req, res, next) => {
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
