const { response } = require('express')
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()
const Person = require('./models/person')


app.use(express.json())

app.use(cors())

app.use(express.static('build'))

morgan.token('body', (request, response) => JSON.stringify(request.body));
    app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

const generateId = () => {
    const id = Math.floor(Math.random() * 10000)
    return id
}

app.get('/api/persons', (request, response) => {
    Person.find({}).then(people => {
        response.json(people)
    })
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:number', (request, response) => {
    const phoneNumber = request.params.number
    console.log(phoneNumber, ' deleted')
    persons = persons.map(person => 
        person.number === phoneNumber
            ? { ...person, number: ''}
            : person
    )
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const person = request.body
    
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

    const newPerson = {
        id: generateId(),
        name: person.name,
        number: person.number
    }
    
    persons = persons.concat(newPerson)

    response.json(newPerson)
})

app.get('/info', (request, response) => {
    const count = persons.filter(person => person.id).length
    console.log(count)
    response.send(`Phonebook has info for ${count} people </br> ${Date()}`)
})


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})