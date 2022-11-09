require('dotenv').config()
const Person = require('./models/person')

const express = require('express')
var morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('contentPrint', function formContent (req) {
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
    ].join(' ')
  }
}))

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
      response.json(persons)
    })
})

app.get('/info', (request, response) => {

  const time = Date()
  const records = persons.length
  const message = `Phonebook has info for ${records} people \n\n${time}`
  response.end(message)
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(
    person => {
      if(person){
        response.json(person)
      } else {
        response.status(404).end()
      }
    }
  ).catch( error => {
    console.log(error)
    response.status(400).send({error: "malformatted id"})
  }
  )
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id

  if(id){
    Person.findByIdAndRemove(id).then(
      result => {
        response.status(204).end()
      }
    ).catch(
      error => {
        console.log(error)
        response.status(500).end()
      }
    )
  } else {
    return response.status(400).json({
      error: "missing id"
    })
  }

  
  
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {

  const body = request.body
  console.log(body)
  console.log(body.content)


  if(body.name === undefined || body.number === undefined){
    return response.status(400).json({
      error: "name or number missing"
    })
  }


  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`server running in port ${PORT}`)
})