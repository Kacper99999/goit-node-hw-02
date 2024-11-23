const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')

const URI = 'mongodb+srv://kszkutnik99:KBNy8ef8uIGn67Dy@cluster0.sjcwn.mongodb.net/db-contacts?retryWrites=true&w=majority'

mongoose.connect(URI,{ useNewUrlParser: true, useUnifiedTopology: true })
.then(async()=>{
  console.log("Database connection successful")
})
.catch((error)=>{
  console.log("Database connection error:",error)
  process.exit(1);
})
const contactsRouter = require('./routes/api/contacts')

const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())

app.use('/api/contacts', contactsRouter)

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message })
})

module.exports = app
