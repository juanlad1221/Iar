const mongoose = require('mongoose');


//------CONECTION DB MONGO ATLAS-------------------------------------------------------
mongoose.connect('mongodb+srv://juanlad1221:yonome1221@clustershool-widaw.mongodb.net/db_school2?retryWrites=true',{useUnifiedTopology: true, useNewUrlParser:true},(err, res)=>{
//mongoose.connect('mongodb://localhost/db_school2',{useNewUrlParser: true},(err, res)=>{
	if(err){console.log('Error: En consulta...',err)};
	console.log('Data Base ok...');
})