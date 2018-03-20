/**
 * Pós Graduação Internet das Coisas - CEFET-MG Disciplina: Programação para
 * Sistemas de Computação Exemplo prático de RESTFul com NodeJS e MongoDB
 */

/* Módulos Utilizados */
var express = require('express'); 
var cors = require('cors'); 
var bodyParser = require('body-parser'); 
var Temperatura = require('./models/temperatura'); // Modelos definidos
var mongoose = require('mongoose');
var mqtt = require('mqtt');

require('mongoose-middleware').initialize(mongoose);

mongoose.connect("mongodb://localhost:27017/sensor");
var client = mqtt.connect('tcp://localhost'); //inicia o mqtt

var app = express(); // Cria o app com Express
var router = express.Router();

app.use(cors()); // liberar todos os do app acessos CORS
app.use(bodyParser.urlencoded({ 
	extended : true
})); 
app.use(bodyParser.json()); // configurações do body parser

client.on('connect', function () {
   	 client.subscribe('iot-cefetmg'); //conecta e assina o tópico MQTT
});


client.on('message', function (topic, message) { //aguarda mensagem do tópico assinado MQTT 
	  console.log(topic.toString());
	  console.log(message.toString());
	  var payload       = message.toString();
	  var message_topic = topic.toString();
	  
	  var temperatura = new Temperatura();

	  var d = new Date();
	 
	  temperatura.time = d.getFullYear() + "-"
		+ ("00" + (d.getMonth() + 1)).slice(-2) + "-"
		+ ("00" + (d.getDate())).slice(-2) + " "
		+ d.toLocaleTimeString();
	 
	  temperatura.valor = payload;

		temperatura.save(function(error) { // insere no db
			if (error)
				console.log(error);

			console.log("Inserido com Sucesso!")
		});
	
});

/* Rota para acompanhar as requisições */
router.use(function(req, res, next) {
	console.log('Entrou na rota ');
	next(); // continua na próxima rota
});

//GET /
router.get('/', function(req, res) {
	res.json({
		message : 'API - IoT'
	});
});

//GET /temperatura
router.route('/temperatura').get(function(req, res) {
	Temperatura.find(function(err, temperatura) {
		if (err)
			res.send(err);

		res.json(temperatura);
	});
	console.log('GET /temperatura');
});



//GET /temperatura
router.route('/lerTemperatura/').get(function(req, res) {
	var limit = parseInt(req.query._limit) || 1;
	
	Temperatura.
	find().
	where('"valor"').gte(21).lte(65).
	limit(limit).
	sort({ _id: -1 })
	.exec(function(err, temperatura) {
		if (err)
			res.send(err);

		res.json(temperatura);
	});
});

//GET /temperatura/:id
router.route('/temperatura/:id').get(function(req, res) {
	Temperatura.findById(req.params.id, function(error, temperatura) {
		if(error)
			res.send(error);

		res.json(temperatura);
	});
	console.log('GET /temperatura/:id');
});

/* POST /temperatura {time:"..",valor:"..."} */
router.route('/temperatura').post(function(req, res) {
	var temperatura = new Temperatura();

	temperatura.time = req.body.time;
	temperatura.valor = req.body.valor;

	temperatura.save(function(error) {
		if (error)
			res.send(error);

		res.json({
			message : 'temperatura criada!'
		});
	});
		
	console.log('POST /temperatura');
});

/* POST /temperatura/mqtt {valor:"..."} */
router.route('/temperatura/mqtt').post(function(req, res) {
	
	client.publish('iot-cefetmg',  req.body.valor); //MQTT: publica o valor da temperatura no Tópico
	
	res.json({
		message : 'temperatura publicada!'
	});
	
	console.log('POST /temperatura/mqtt');
});

//PUT /temperatura/:id {time:"..",valor:"..."}
router.route('/temperatura/:id').put(function(req, res) {
	Temperatura.findById(req.params.id, function(error, temperatura) {
		if(error)
			res.send(error);

		temperatura.time = req.body.time;
		temperatura.valor = req.body.valor;

		temperatura.save(function(error) {
			if(error)
				res.send(error);
			res.json({ message: 'Temperatura Atualizado!' });
		});
	});
	console.log('PUT /temperatura/:id');
});

//DELETE /temperatura/:id
router.route('/temperatura/:id').delete(function(req, res) {
	Temperatura.remove({
		_id: req.params.id
	}, function(error) {
		if(error)
			res.send(error);
		res.json({ message: 'Temperatura excluída com Sucesso! '});
	});
	console.log('DELETE /temperatura/:id');
});

app.use('/', router);

app.listen(3000);
console.log('Servidor executando.');