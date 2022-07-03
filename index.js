const { response } = require('express')
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()
const Person = require('./models/person')

app.use(express.static('build'))
app.use(express.json())
app.use(cors())


morgan.token('body', (request, response) => JSON.stringify(request.body));
    app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get('/api/persons', (request, response) => {
    Person.find({}).then(people => {
        response.json(people)
    })

})

app.get('/api/persons/:id', (request, response, next) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    /*
    if (persons.find(p => p.name === person.name)) {
        console.log('name must be unique')
        return response.status(400).json ({
            error: 'name must be unique'
        })
    } else if (!person.name) {
        console.log('name missing')
        return response.status(400).json ({
            error: 'name missing'
        })
    } else if (!person.number) {
        console.log('number missing')
        return response.status(400).json ({
            error: 'number missing'
        })
    }
    */
    if (body.name === undefined) {
        return response.status(400).json({ error: 'content missing' })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

app.get('/info', (request, response) => {
    const count = persons.filter(person => person.id).length
    console.log(count)
    response.send(`Phonebook has info for ${count} people </br> ${Date()}`)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

// olemattomien osoitteiden käsittely
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

// virheellisten pyyntöjen käsittly
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})