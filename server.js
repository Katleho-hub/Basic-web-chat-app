var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

//mongoose.Promise = Promise

var db_url = 'mongodb://localhost:27017/learning-node'

var Message = mongoose.model('Message', {
    name: String,
    message: String
})

app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) =>{
        res.send(messages)  // response for the path
    })
})

app.get('/messages/:user', (req, res) => {
    var user = req.params.user
    Message.find({name: user}, (err, messages) => {
        res.send(messages)  // response for the path
    })
})

app.post('/messages', async (req, res) => { 

    try {
        var message = new Message(req.body)

        var savedMessage = await message.save()

        console.log('saved')

        var censored = await Message.findOne({ message: 'badword' })

        if (censored)
            await Message.deleteMany({ _id: censored.id })  // if censord word found remove message
        else
            io.emit('message', req.body)

        res.sendStatus(200)        
    } catch (error) {
       res.sendStatus(500)
       return console.error(error)
    } finally {
        console.log('message post called')
    }
})  



io.on('connection', (Socket) => {
    console.log('A user connected')
    return console;error(err)
})

mongoose.connect(db_url, {useUnifiedTopology: true, useNewUrlParser: true}, (err) => {
    console.log('Mongo db connection', err)
})

var server = http.listen(3000, () => {
    console.log('Server is listening on port', server.address().port)
})

