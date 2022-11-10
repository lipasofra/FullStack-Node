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

app.get('/api/persons', (request, response, next) => {
    Person.find({}).then(persons => {
      response.json(persons)
    }).catch(error => next(error))
})

app.get('/info', (request, response) => {

  const time = Date()

  Person.find({}).then(persons => {
    const records = persons.length
    const message = `Phonebook has info for ${records} people \n\n${time}`
    response.end(message)
  }).catch(error => next(error))


})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(
    person => {
      if(person){
        response.json(person)
      } else {
        response.status(404).send({error: "This phone does not exist"})
      }
    }
  ).catch( error => next(error) )
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id

  Person.findByIdAndRemove(id).then(
    result => {
      response.status(204).end()
    }
  ).catch(
    error => {
      next(error)
    }
  )
  
})

app.post('/api/persons', (request, response, next) => {

  const body = request.body
 
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
  }).catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {

  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }


  Person.findByIdAndUpdate(request.params.id, person, {new: true}).then(
    updatedPerson => response.json(updatedPerson)
  ).catch(
    error => next(error)
  )

})


const errorHandler = (error, request, response, next) => {
  console.log(error.message)
  if (error.name === 'CastError'){
    return response.status(400).send({error: "malformatted id"})
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`server running in port ${PORT}`)
})