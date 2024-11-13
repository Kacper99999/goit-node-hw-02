const express = require('express')

const {listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact} = require("./contacts")

const router = express.Router()

router.get('/', async (req, res, next) => {
  const list = await listContacts();
  if(list.lenght > 0){
    res.status(200).json(list);
  }
  else{
    res.json({message: "Not found"})
  }
})

router.get('/:contactId', async (req, res, next) => {
  const selectedID = await getContactById(req.params.contactId);
  if(selectedID){
    res.status(200)
  }
  else
  res.status(404).json({ message: "Not found" })
})

router.post('/', async (req, res, next) => {
  try{
    await addContact(req.body);
    res.status(200).json({message: (req.body)})
  }
  catch{
    res.status(400).json({message: "missing required name - field"})
  }
})

router.delete('/:contactId', async (req, res, next) => {
  try{
    await removeContact(req.params.contactId);
    res.json(200).json({message: "contact deleted"})
  }
  catch{
    res.status(404).json({message: "Not Found"})
  }
})

router.put('/:contactId', async (req, res, next) => {
  try{
    if(!req.body){
      req.status(400).json({message: "missing fields"})
    }
    else{
      await removeContact(req.params.contactId,req.body);
      req.status(200)
    }
  }
  catch{
    res.status(404).json({message: "Not Found"})
  }
})

module.exports = router
