const express = require('express')
const morgan = require('morgan')
const app = express()
const PORT = 2001

morgan.token('body', (req) => JSON.stringify(req.body))

app.use(express.json())
app.use(morgan(':url :method :status :res[content-length] - :response-time ms :body '))

let phoneBook = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const generateId = () => {
    return Math.floor((Math.random() * 10000)
)}
console.log(generateId())

app.get('/', (request, response) => {
    response.send('Welcome to PhoneBooks: to see phonebook go to /api/persons. To get info enter /api/info. To get a specific id enter /api/persons/id.')
})

app.get('/api/persons', (request, response) => {
    response.json(phoneBook)
})

app.get('/api/info', (request, response) => {
    let people = phoneBook.length
    const date = {
        date: new Date()
    };
    
    response.send(`<h1>Phonebook has info for ${people} people</h1>` + `<h2>${date}</h2>`)
    
})

app.get('/api/person/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = phoneBook.find(person => {
        return person.id === id
    })
    if(person){
      response.json(person)
    }else{
      response.status(404).end()
    }
    
})

app.delete('/api/person/:id', (request, response) => {
    const id = Number(request.params.id)
    phoneBook = phoneBook.filter(person => person.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    const identicalName =  () => phoneBook.map(entry => {
       if(body.name === entry.name){
        return response.status(400).json({
          error: 'Name must be unique'
        })
       }
    })
    identicalName()
    
    const identicalNumber = () => phoneBook.map(entry => {
       if(body.number === entry.number){
        return response.status(400).json({
          error: 'Number must be unique'
        })
       }
    })
    identicalNumber()
    
    if(!body.name){
      return response.status(400).json({
        error: 'content missing'
      })
    }

    const phoneBookEntry = {
      id: generateId(),
      name: body.name,
      number: body.number
    }

    phoneBook = phoneBook.concat(phoneBookEntry)
    response.json(body)
})

app.listen(process.env.PORT || PORT, ()=> {
    console.log(`The server is running on PORT: ${PORT}`)
})

