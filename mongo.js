const mongoose = require('mongoose')

if (process.argv.length>5 || process.argv.length===4 || process.argv.length<3) {
    console.log('invalid input')
    process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://db_user:${password}@cluster0-kvmfl.mongodb.net/<dbname>?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)


if (process.argv.length === 5) {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
    })
    person.save().then(() => {
        console.log(`added ${person.name} number ${person.number} to phonebook`)
        mongoose.connection.close()
    })
}
if (process.argv.length === 3) {
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)})
        mongoose.connection.close()
    })
}