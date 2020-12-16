const express = require('express')
const app = express()
const path = require('path')
const port = process.env.port || 5000
const mysql = require('mysql')
const dotenv = require('dotenv')

dotenv.config({ path: './.env' })

const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
})

const publicDirectory = path.join(__dirname, './public')
app.use(express.static(publicDirectory))

app.set('view engine', 'hbs')

db.connect((err) => {
  if (err) {
    console.log(err)
  } else {
    console.log('Mysql connected')
  }
})

app.get('/', (req, res) => {
  res.render('index')
})

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`)
})
