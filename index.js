require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require ('cors')
const Person = require('./models/person')
const mongoose = require('mongoose')

app.use(express.static('build'))
app.use(express.json())
app.use(cors())
mongoose.set('useFindAndModify', false)

morgan.token('content', function getBody(req,res) {
	if(req.method === 'POST'){
		return(JSON.stringify(req.body))}
	return null
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons)
    })
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if (note) {
                res.json(person)
            }else{
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.get('/info', (req, res) => {
    count = Person.countDocuments({}).exec((err,count)=>{
        res.send('<div>Phonebook has info of '+ count + ' persons </div>' + '<div>' + Date() + '</div>')
    })
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(result => {res.status(204).end()})
        .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
    const person = new Person({
        name: req.body.name,
        number: req.body.number
    })

    person.save()
        .then(savedPerson => {
            res.json(savedPerson)
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
    const person = {
        name: req.body.name,
        number: req.body.number
    }

    Person.findByIdAndUpdate(req.params.id, person, {new: true})
        .then(updatedPerson => {
            res.json(updatedPerson.toJSON())
        })
        .catch(error => next(error))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })


  const errorHandler = (error, request, response, next) => {

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	}
	next(error)
}
app.use(errorHandler)


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)