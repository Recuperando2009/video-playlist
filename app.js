const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

// Conexão com o MongoDB
mongoose.connect('mongodb://localhost:27017/meu_banco_de_dados', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Erro na conexão com o MongoDB:'));
db.once('open', function () {
    console.log('Conexão estabelecida com o MongoDB.');
});

// Definição do Schema e modelo do MongoDB
const itemSchema = new mongoose.Schema({
    nome: String,
    url: String,
    miniatura: String, // Novo campo para o link da miniatura
});

const Item = mongoose.model('Item', itemSchema);

// Rota para adicionar um item
// Rota para adicionar um item
app.post('/adicionar', (req, res) => {
    const { nome, url, miniatura } = req.body; // Destructuring para extrair os campos do corpo da requisição

    const newItem = new Item({
        nome: nome,
        url: url,
        miniatura: miniatura, // Capturando o valor do novo campo
    });

    newItem.save()
        .then(item => {
            console.log('Item salvo com sucesso:', item);
            res.redirect('/');
        })
        .catch(err => {
            console.error('Erro ao salvar o item:', err);
            res.status(500).send('Erro ao salvar o item.');
        });
});


// Rota para a página inicial
app.get('/', (req, res) => {
    res.render('index');
});

// Inicialização do servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
