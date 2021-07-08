const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://admin:admin!@@cluster0.oo4xy.mongodb.net/mern-todo')

app.use(cors())
app.use((bodyParser.json()))
app.use(bodyParser.urlencoded({extended: false}))

const port = process.env.PORT || 5000

app.listen(port, (err)=>{
    if(err) return console.log(err)
    console.log('Server running on port: ', port)
})