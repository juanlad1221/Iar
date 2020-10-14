const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const alumnos_conceptos_schema = Schema({
    id_alumno:         {type:Object,   requerid:true},
    name:              {type:String,   requerid:true},
    last_name:         {type:String,   requerid:true},
    curso:             {type:String,   requerid:true},
    materia:           {type:String,   requerid:true},
    id_materia:        {type:Object,   requerid:true},
    user:              {type:Object,   requerid:true},
    cuatrimestre:      {type:String,   requerid:true},
    conceptos:         [{}],
 
})

//Exporto modelo
module.exports = mongoose.model('alumnos_conceptos',alumnos_conceptos_schema);