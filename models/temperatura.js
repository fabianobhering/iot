/** Pós Graduação Internet das Coisas - CEFET-MG
	Disciplina: Programação para Sistemas de Computação
	Exemplo prático de RESTFul com NodeJS e MongoDB
	Modelo Temperatura
 */
 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment'); 
var mongooseApiQuery = require('mongoose-api-query'); 

var TemperaturaSchema = new Schema({
    time: Date,
    valor: Number
});

autoIncrement.initialize(mongoose.connection);
TemperaturaSchema.plugin(autoIncrement.plugin, 'temperatura');
TemperaturaSchema.plugin(mongooseApiQuery); 
module.exports = mongoose.model('temperatura', TemperaturaSchema);

