const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT || 5050;


const express = require('express');
const router = require('./app/router');

const app = express();

app.use(express.urlencoded({extended: true}));

app.use(router);

// lancement du serveur
app.listen( PORT,  () => {
  console.log(`Listening on ${PORT}`);
});