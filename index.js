const express = require('express')
const app = express()

app.use(express.json())

let persons = [
{ 
    name: 'Arto Hellas',
    number: '040-123456',
    id: 1 
},
{ 
    name: 'Ada Lovelace',
    number: '39-44-5323523',
    id: 2
},
{ 
    name: 'Dan Abramov', 
    number: '12-43-234345',
    id: 3 
},
{ 
    name: 'Mary Poppendieck', 
    number: '39-23-6423122',
    id: 4
}
]

function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

const info = (persons) => {
    return (
        `<p>Phonebook has info for ${persons.length} people</p>
        <p>` + Date() + '</p>' 
    )
}

app.get('/api/persons', (req, res) => {
    res.send(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        res.json(person)
    }else{
        res.status(404).end()
    }
})

app.get('/info', (req, res) => {
    res.send(info(persons))
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    if (!req.body.name || !req.body.number) {
        return res.status(400).json({
            error: 'content missing'
        })
    }
    else if (persons.map(person => person.name).find(person => req.body.name === person)) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }


    const person = req.body
    person.id = getRandom(1, 100)
    persons = persons.concat(person)
    res.json(person)
})

const port = 3001
app.listen(port)
console.log(`Server running on port ${port}`)