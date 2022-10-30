const express = require('express')
var morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors())

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


morgan.token('contentPrint', function formContent (req) {
  // const toPrint = `{"name": ${req.body.name}, "number": ${req.body.number}}` exercise is different, this method prints different the quotes
  const toPrint = JSON.stringify({name : req.body.name, number: req.body.number})

  return toPrint
})

app.use(morgan(function (tokens, req, res) {
  if(tokens.method(req, res)=== 'POST'){

    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      tokens.contentPrint(req, res),
      // JSON.stringify(req.body) also prints id, in exercise there's no id
    ].join(' ')
  }
}))

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
  const existingPerson = persons.find(person => person.name === newPerson.name)


  if(!newPerson.name || !newPerson.number){
    return response.status(400).json({
      error: 'name or number cannot be empty'
    })
  } else if(existingPerson){
    return response.status(400).json({
      error: 'name already exists'
    })
  }

  newPerson.id = newId
  persons = persons.concat(newPerson)
  response.json(newPerson)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`server running in port ${PORT}`)
})