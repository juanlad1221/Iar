const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const Materias_schema = Schema({
    materia:  {type:String, requerid:true},
    cursos:   []
})

//Exporto modelo
module.exports = mongoose.model('materias',Materias_schema);