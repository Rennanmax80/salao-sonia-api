const express = require('express')
const app = express();
const morgan = require('morgan')
const cors = require('cors')
const path = require('path');
require('dotenv').config()
require('./database');

// const port = process.env.PORT || 8000

//MIDDLEWARES
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// app.use('/uploads', express.static('./src/uploads'))
app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')));

//VARIABLES
app.set('port', 8000);

//ROTAS
app.use('/salao', require('./src/routes/salao.routes'))
app.use('/servico', require('./src/routes/servico.routes')); // <--- adiciona isso

app.listen(app.get('port'), () => {
    console.log(`Servidor iniciado na porta ${app.get('port')}`)
} )