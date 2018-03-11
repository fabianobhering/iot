/**
 * Arquivo: usuario.js
 * Author: Glaucia Lemos
 * Description: Arquivo onde trataremos o modelo do projeto.
 * Definição dos esquemas para serem utilizadas na Base de Dados (MongoDb)
 * Data: 13/10/2016
 */
 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment'); 

var TemperaturaSchema = new Schema({
    time: String,
    valor: String
});
autoIncrement.initialize(mongoose.connection);
TemperaturaSchema.plugin(autoIncrement.plugin, 'temperatura');
 
module.exports = mongoose.model('temperatura', TemperaturaSchema);

