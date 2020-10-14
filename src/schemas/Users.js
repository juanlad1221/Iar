const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const users_schema = Schema({
    username:            {type:String, requerid:true},
    password:            {type:String, requerid:true},
    show_name:           {type:String, requerid:true},
    tipo:                {type:String, requerid:true},
    cursos:              [],
    sexo:                {type:String, requerid:true},
    active:              {type:Boolean, requerid:true, default:true}
    
});

//Exporto modelo
module.exports = mongoose.model('users',users_schema);