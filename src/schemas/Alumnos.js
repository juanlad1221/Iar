const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const alumnos_schema = Schema({
    name:              {type:String,   requerid:true},
    last_name:         {type:String,   requerid:true},
    curso:             {type:String,   requerid:true},
    conceptos:         [{type:Array,  requerid:true}],
    active:            {type:Boolean,  requerid:true, default:true}
})



//Exporto modelo
module.exports = mongoose.model('alumnos',alumnos_schema);