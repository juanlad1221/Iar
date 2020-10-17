const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const Grupos_schema = Schema({
    tipo:  {type:String, requerid:true},
})

//Exporto modelo
module.exports = mongoose.model('grupos',Grupos_schema);