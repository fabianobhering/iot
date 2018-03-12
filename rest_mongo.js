/**
 * Arquivo: server.js
 * Descrição: Arquivo responsável por levantar o serviço do Node.Js para poder
 * executar a aplicação e a API através do Express.Js.
 * Author: Glaucia Lemos
 * Data de Criação: 13/10/2016
 */

//Base do Setup da Aplicação:
//Configuração Base da Aplicação:
var mongoose = require('mongoose');
var url = "mongodb://localhost:27017/sensor";
mongoose.connect(url);
var Temperatura = require('./models/temperatura');

/* Chamada das Packages que iremos precisar para a nossa aplicação */
var express = require('express'); //chamando o pacote express
var app = express(); //definção da nossa aplicação através do express
var cors = require('cors'); //habilitar controle de acesso
var bodyParser = require('body-parser'); //chamando o pacote body-parser

//liberar todos os acessos
app.use(cors());

/** Configuração da variável 'app' para usar o 'bodyParser()'.
 * Ao fazermos isso nos permitirá retornar os dados a partir de um POST
 */
app.use(bodyParser.urlencoded({
	extended : true
}));
app.use(bodyParser.json());

/** Definição da porta onde será executada a nossa aplicação */
var port = 3000;

//Rotas da nossa API:
//==============================================================

/* Aqui o 'router' irá pegar as instâncias das Rotas do Express */
var router = express.Router();

/* Middleware para usar em todos os requests enviados para a nossa API- Mensagem Padrão */
router.use(function(req, res, next) {
	console.log('Algo está acontecendo aqui........');
	next(); //aqui é para sinalizar de que prosseguiremos para a próxima rota. E que não irá parar por aqui!!!
});

/* Rota de Teste para sabermos se tudo está realmente funcionando (acessar através: GET: http://localhost:8000/api) */
router.get('/', function(req, res) {
	res.json({
		message : 'YEAH! Seja Bem-Vindo a nossa API'
	});
});

/* TODO - Definir futuras rotas aqui!!! */
//Rotas que irão terminar em '/usuarios' - (servem tanto para: GET All & POST)
router.route('/temperatura')

/* 1) Método: Criar Temperatura (acessar em: POST http://localhost:8080/api/usuarios */
.post(function(req, res) {
	var temperatura = new Temperatura();

	//aqui setamos os campos do usuario (que virá do request)
	temperatura.time = req.body.time;
	temperatura.valor = req.body.valor;

	temperatura.save(function(error) {
		if (error)
			res.send(error);

		res.json({
			message : 'temperatura criada!'
		});
	});
});

router.route('/temperatura')

/* 2) Método: Selecionar Todos (acessar em: GET http://locahost:8080/api/usuarios) */
.get(function(req, res) {

	//Função para Selecionar Todos as temperaturas' e verificar se há algum erro:
	Temperatura.find(function(err, temperatura) {
		if (err)
			res.send(err);

		res.json(temperatura);
	});
});

router.route('/temperatura2')

.get(function(req, res) {

	//Função para Selecionar Todos as temperaturas' e verificar se há algum erro:
	Temperatura.apiQuery(req.query, function(err, temperatura) {
		if (err)
			res.send(err);

		res.json(temperatura);
	});
});


var qpm = require('query-params-mongo');
var mongodb = require('mongodb');

var processQuery = qpm({
    autoDetect: [{ fieldPattern: /_id$/, dataType: 'objectId' }],
    converters: {objectId: mongodb.ObjectID}
});

app.get('/temperatura3', function(req, res) {
    try {
        var query = processQuery(req.query, 
            {time: {dataType: 'string', required: false}},
            true
        );
    } catch (errors) {
        res.status(500).send(errors);
    }
    
   
         Temperatura.find(query.filter, function(err, temperatura) {
    		if (err)
    			res.send(err);

    		res.json(temperatura);
    	}).sort(query.sort).skip(query.offset).limit(query.limit);
       
   
});





//Rotas que irão terminar em '/usuarios/:usuario_id' - (servem tanto para GET by Id, PUT, & DELETE)
router.route('/temperatura/:id')
 
    /* 3) Método: Selecionar Por Id (acessar em: GET http://localhost:8080/api/usuarios/:usuario_id) */
    .get(function(req, res) {
 
        //Função para Selecionar Por Id e verificar se há algum erro:
        Temperatura.findById(req.params.id, function(error, temperatura) {
            if(error)
                res.send(error);
 
            res.json(temperatura);
        });
    });

router.route('/temperatura/:id')
/* 4) Método: Atualizar (acessar em: PUT http://localhost:8080/api/usuarios/:usuario_id) */
.put(function(req, res) {

    //Primeiro: Para atualizarmos, precisamos primeiro achar o Usuario. Para isso, vamos selecionar por id:
    Temperatura.findById(req.params.id, function(error, temperatura) {
        if(error)
            res.send(error);

        //Segundo: Diferente do Selecionar Por Id... a resposta será a atribuição do que encontramos na classe modelo:
        temperatura.time = req.body.time;
    	temperatura.valor = req.body.valor;

        //Terceiro: Agora que já atualizamos os campos, precisamos salvar essa alteração....
        temperatura.save(function(error) {
            if(error)
                res.send(error);

            res.json({ message: 'Temperatura Atualizado!' });
        });
    });
});

router.route('/temperatura/:id')
/* 5) Método: Excluir (acessar em: http://localhost:8080/api/usuarios/:usuario_id) */
.delete(function(req, res) {

    //Função para excluir os dados e também verificar se há algum erro no momento da exclusão:
    Temperatura.remove({
    _id: req.params.id
    }, function(error) {
        if(error)
            res.send(error);

        res.json({ message: 'Temperatura excluída com Sucesso! '});
    });
});



/* Todas as nossas rotas serão prefixadas com '/api' */
app.use('/', router);

//Iniciando o Servidor (Aplicação):
//==============================================================
app.listen(port);
console.log('Iniciando a aplicação na porta ' + port);
