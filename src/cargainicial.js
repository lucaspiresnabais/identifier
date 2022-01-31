require('./models/Modelos')
const mongoose = require('mongoose');
const Parametria = mongoose.model('Parametria');
const mongoUri = 'mongodb://0.0.0.0:27017/pruebampn1'
mongoose.connect(mongoUri, {
   useNewUrlParser: true,
   useCreateIndex: true,
 useUnifiedTopology: true, 
 useFindAndModify: false
})
mongoose.connection.on('connected', () => {
    console.log('Connected to mongo instance!')
    
})

mongoose.connection.on('error', (err) => {
    console.log('Error connecting to mongo', err);
})

/*const poblar= require('./cargainicial')*/


function PoblarParam() {
    
    let date_ob = new Date();

// current date
// adjust 0 before single digit date
let date = ("0" + date_ob.getDate()).slice(-2);

// current month
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

// current year
let year = date_ob.getFullYear();

// current hours
let hours = date_ob.getHours();

// current minutes
let minutes = date_ob.getMinutes();

// current seconds
let seconds = date_ob.getSeconds();

// prints date in YYYY-MM-DD format


// prints date & time in YYYY-MM-DD HH:MM:SS format
let time= year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;

console.log(time);

    const parametria = 
    new Parametria({ente: 'Ente1', sector: 'Sector1',servicio: 'Servicio1', timeStamp: new Date()});
    parametria.save();

    return 'Parametria Poblada';
  }
 
  console.log(PoblarParam())
