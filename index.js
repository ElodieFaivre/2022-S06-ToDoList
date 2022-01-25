const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT || 5050;


const express = require('express');

const app = express();


// lancement du serveur
app.listen( PORT,  () => {
  console.log(`Listening on ${PORT}`);
});