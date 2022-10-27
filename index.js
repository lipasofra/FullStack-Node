const express = require('express')
const app = express()
app.use(express.json())

let persons = [
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

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {

  const time = Date()
  const records = persons.length
  const message = `Phonebook has info for ${records} people \n\n${time}`
  response.end(message)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(pers => id === pers.id)
  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {

  const newId = Math.floor(Math.random() * (100000000))
  const newPerson = request.body
  newPerson.id = newId
  persons = persons.concat(newPerson)
  response.json(newPerson)
})


const PORT = 3001
app.listen(PORT, () => {
  console.log(`server running in port ${PORT}`)
})