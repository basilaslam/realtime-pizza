require('dotenv').config()
const express = require('express')
const ejs = require('ejs')
const expressLayout = require('express-ejs-layouts')
const path = require('path')


const app = express()
const PORT = process.env.PORT || 3000
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('express-flash')
const { MongoStore } = require('connect-mongo')
const MongoDbStore = require('connect-mongo')(session)




//Database connection
const url = 'mongodb://localhost/pizza';


mongoose.connect(url, { useNewUrlParser: true, useCreateIndex: true, 
    useUnifiedTopology: true, useFindAndModify:true});

    const connection = mongoose.connection;
    connection.once('open', () => {
        console.log('Database connected...');
    }).catch(err => {
        console.log('Connection failed...')
    });

app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')


require('./routes/web')(app)

//Session Store

let mongooseStore = new MongoDbStore({

    mongooseConnection: connection,
    collection: 'sessions'
})

//Session config

app.use(session({ 
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: MongoStore,
    saveUninitialized: false,
    //cookie: { maxAge: 1000 * 60 * 60 * 24 } //24 hours
    cookie: { maxAge: 1000 * 15}


}))

app.use(flash())



//Assets
app.use(express.static('public'))


 


app.listen(PORT,() => {
    console.log(`listening on port ${PORT}`)
})