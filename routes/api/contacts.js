const { error } = require('console');
const express = require('express');
const fs = require('fs');
const path = require('path');
const url = require('url');
const __dirname = path.dirname(__filename);
const contactPath = path.join(__dirname,"models","contacts.json");

const router = express.Router()

router.get('/api/contacts', async (req, res, next) => {
  try{
    const data = await fs.readFile(contactPath,"utf-8");
    const contacts = JSON.parse(data);

    res.json(contacts);
  }
  catch(error){
    next(error)
  }
})

router.get('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' })
})

router.post('/', async (req, res, next) => {
  res.json({ message: 'template message' })
})

router.delete('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' })
})

router.put('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' })
})

module.exports = router
