const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const Observaciones_schema = Schema({
    id_alumno:      {type:Object, requerid:true},
    //cuatrimestre:   {type:String, requerid:true},
    observacion:    {type:String}
})

//Exporto modelo
module.exports = mongoose.model('observaciones',Observaciones_schema);