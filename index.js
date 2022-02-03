require('dotenv').config();

const express = require('express');
const router = require('./app/router');
const cors = require('cors');
//PERMET de faire comprendre à express le format FormData 
const multer = require('multer');
const bodyParser = multer();



const port = process.env.PORT || 3000;

const app = express();

//Pour rendre accessible notre API de partout
app.use(cors())


// la petite ligne pour réussir a ouvrir un POST
app.use(express.urlencoded({extended: true}));
// on utlise .none() pour dire qu'on attends pas de fichier, uniquement des inputs "classiques" !
app.use( bodyParser.none() );

app.use(router);

app.listen(port, _ => {
   console.log(`http://localhost:${port}`);
});