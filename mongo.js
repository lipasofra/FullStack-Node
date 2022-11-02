const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log("Please provide the arguments: node mongo.js <password> <name to save>"
               + " <phone number> to save new person \n If not, just the password")
  process.exit(1)
}

const password = process.argv[2]
const in_name = process.argv[3]
const in_number = process.argv[4]

const url = `mongodb+srv://lipasofra:${password}@phonebook.auwbtqi.mongodb.net/phonebookNumbers?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

mongoose.connect(url)
    .then((result) => {
        if (process.argv.length > 3) {
            const person = new Person({
                name: in_name,
                number: in_number,
            })
            return person.save().then(() => {
                console.log(`added ${in_name} number ${in_number} to phonebook`)
                return mongoose.connection.close()
            })
        } else {
            Person.find({}).then(result => {
                console.log("phonebook:")
                result.forEach(person => {
                    console.log(person.name, person.number)
                })
                mongoose.connection.close()
            })
        }

    })
    .catch((err) => console.log(err))
