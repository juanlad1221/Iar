const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const conceptos_schema = Schema({
    concepto:               {type:String,   requerid:true},
    tipo:                   {type:String,   requerid:true},
    positivo:               {type:Boolean,   requerid:true},
    active:                 {type:Boolean,  requerid:true, default:true},
    low_motive:             {type:String,   default:''}
})

//Exporto modelo
module.exports = mongoose.model('conceptos',conceptos_schema);