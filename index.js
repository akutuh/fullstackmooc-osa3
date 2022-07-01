const { response } = require('express')
const express = require('express')
const app = express()
const morgan = require('morgan')

let persons = [
    {
      id: 1,
      name: "Arto Hellas",
      number: "040-123456"
    },
    {
      id: 2,
      name: "Ada Lovelace",
      number: "39-44-5323523"
    },
    {
      id: 3,
      name: "Dan Abramov",
      number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
]


app.use(express.json())

morgan.token('body', (request, response) => JSON.stringify(request.body));
    app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

const generateId = () => {
    const id = Math.floor(Math.random() * 10000)
    return id
}

app.get('/api/persons', (request, response) => {
    response.json(persons)
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


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})