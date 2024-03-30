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

// Rota para editar um item
app.post('/editar/:id', async (req, res) => {
    const { nome, url, miniatura } = req.body;
    const itemId = req.params.id;

    try {
        const updatedItem = await Item.findByIdAndUpdate(itemId, { nome: nome, url: url, miniatura: miniatura }, { new: true });
        console.log('Item atualizado com sucesso:', updatedItem);
        res.redirect('/');
    } catch (err) {
        console.error('Erro ao editar o item:', err);
        res.status(500).send('Erro ao editar o item.');
    }
});

// Rota para excluir um item
app.get('/deletar/:id', async (req, res) => {
    const itemId = req.params.id;

    try {
        const deletedItem = await Item.findByIdAndDelete(itemId);
        console.log('Item excluído com sucesso:', deletedItem);
        res.redirect('/');
    } catch (err) {
        console.error('Erro ao excluir o item:', err);
        res.status(500).send('Erro ao excluir o item.');
    }
});


// Rota para a página inicial
app.get('/', async (req, res) => {
    try {
        const items = await Item.find({}).exec();
        res.render('index', { items: items });
    } catch (err) {
        console.error('Erro ao buscar os itens:', err);
        res.status(500).send('Erro ao buscar os itens.');
    }
});

// Inicialização do servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
