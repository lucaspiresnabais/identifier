require('./models/Visita')
const express = require('express');
const mongoose = require('mongoose');
const visitaRoutes = require('./routes/visitaRoutes')

const app = express();
app.use(express.json());
app.use(visitaRoutes);

const mongoUri = 'mongodb+srv://lucas:mongomongo@cluster0.7eomb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

mongoose.connection.on('connected', () => {
    console.log('Connected to mongo instance!')
})

mongoose.connection.on('error', (err) => {
    console.log('Error connecting to mongo', err)
})

app.get('/', (req, res) => {
    res.send(`Working`);
})

app.listen(9999, () => {
    console.log('Listening on 3000')
})