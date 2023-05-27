const express = require('express')
const app = express();
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
require('./database');

// const port = process.env.PORT || 8000

//MIDDLEWARES
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

//VARIABLES
app.set('port', 8000);

//ROTAS
app.use('/salao', require('./src/routes/salao.routes'))


//UPLOAD IMAGENS
// app.post("/upload_files", uploadFiles);
// function uploadFiles(req, res) {
//     console.log(req.body);
// }


app.listen(app.get('port'), () => {
    console.log(`Servidor iniciado na porta ${app.get('port')}`)
} )