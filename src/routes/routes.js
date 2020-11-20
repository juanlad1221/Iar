const express = require("express");
var ObjectId = require('mongoose').Types.ObjectId;
const path = require('path');
const bcrypt = require('bcryptjs');
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const Tools = require('../public/ObjExport')
const BackValidate = require('../public/Back_Validate')
var _ = require('lodash');


var PdfPrinter = require('pdfmake');
var fs = require('fs');

const fonts = require("../fonts")
const styles = require('../styles')
//const {content} = require('../pdfContent')


  


//Shemas
const User = require('../schemas/Users')
const Conceptos = require('../schemas/Conceptos')
const Alumnos = require('../schemas/Alumnos')
const Alumnos_Conceptos = require('../schemas/Alumnos_Conceptos')
const Materias = require('../schemas/Materias')
const Observaciones = require('../schemas/Observaciones')
const Grupos = require('../schemas/Grupos')
const { forEach, each } = require("lodash");

//Creo el obj router
const router = express.Router();



//Gral
router.get('/login', IsNotAuthenticated,function (req, res) {
  res.status(200).render('../views/login')
})//end get

router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/home',
  failureRedirect: '/login',
  passReqToCallback: true
}))//end post

router.get("/logout", IsAuthenticated, function (req, res) {
  req.logOut();
  res.redirect('/login');
})//end get

router.get('/home',IsAuthenticated ,async function (req, res) {
  
  if(req.user.tipo == 'profe'){
    res.redirect('/profes')
  }
  if(req.user.tipo == 'precep'){
    
    res.redirect('/preceptores')
  }
  if(req.user.tipo == 'psico'){
   
    res.redirect('/psicopedagoga')
  }
  
})//end get



//Profes
router.get('/profes', IsAuthenticated ,async function (req, res) {
  //console.log(req.sessionID)
  res.status(200).render('../views/menu_profes',{user: req.user.show_name, sexo:req.user.sexo,tipo:req.user.tipo})
})//end get

router.get('/editarInformes', IsAuthenticated ,async function (req, res) {
  let arr = []
  //let cursos_asignados = await User.where({active:true, _id:ObjectId(req.user.id)})
  let conceptos = await Conceptos.where({active:true})
  
  //console.log(req.user.tipo)
  res.status(200).render('../views/editar_informes',{user: req.user.show_name,
    sexo:req.user.sexo , conceptos, tipo:req.user.tipo})
})//end get

router.get('/conceptos', IsAuthenticated ,async function(req,res){
  let usuario = req.user.id
  let result = await Alumnos_Conceptos.where({user:ObjectId(usuario)})
  let dato = {data:result}
  res.status(200).json(dato)
})//end get

router.post('/alumnos', IsAuthenticated ,async function (req, res) {
  let data = []
  let alumnos = await Alumnos.where({active:true,curso:req.body.curso})
  let alumnos_conceptos = await Alumnos_Conceptos.where({cuatrimestre:queCuatrimestreEs()})
 
  let arrDescontar = []
  let arrEnviar = []
  alumnos.forEach(e =>{
    alumnos_conceptos.forEach(f => {
      
      if(String(e._id) === String(f.id_alumno)){
        
        if(req.body.materia === f.materia){
          arrDescontar.push(f.id_alumno)
          data.push(e)
        }
      }
    })//end for2
  })//end for
  
  let data3=[]
  _.each(alumnos,function(objeto) {
  
    var elemento_en_data2 = _.find(data,objeto);
    
    if(elemento_en_data2===undefined) {
      data3.push(objeto);
    }
    
  });

  arrEnviar = data3
  

  res.status(200).json(Tools.Obj.sortArrayOfObjectsByAnyField(arrEnviar,'last_name'))
})//end post

router.get('/cursosAsignados', IsAuthenticated ,async function(req,res){
  let cursos_asignados = await User.where({active:true, _id:ObjectId(req.user.id)})
  
  res.status(200).json(cursos_asignados[0].cursos)
})//end get

router.post('/datosModal', IsAuthenticated ,async function(req, res){
  let arr = []
  let valoracion;
  let id = req.body.id
  let result = await Alumnos_Conceptos.where({_id:ObjectId(id)})

  //console.log(result[0].conceptos[1].p)
  
  if(result[0].conceptos[0].positivo == true){
    valoracion = 'Valoración Positiva' 
  }else{
    valoracion = 'Valoración Negativa'
  }
  arr.push({tipo:result[0].conceptos[0].tipo, concepto:result[0].conceptos[0].nombre, positivo:valoracion})
  

  //let result3 = await Conceptos.where({_id:ObjectId(result[0].conceptos[0]['2'])})
  if(result[0].conceptos[1].positivo == true){
    valoracion = 'Valoración Positiva' 
  }else{
    valoracion = 'Valoración Negativa'
  }
  arr.push({tipo:result[0].conceptos[1].tipo, concepto:result[0].conceptos[1].nombre, positivo:valoracion})
  

  //let result4 = await Conceptos.where({_id:ObjectId(result[0].conceptos[0]['3'])})
  if(result[0].conceptos[2].positivo == true){
    valoracion = 'Valoración Positiva' 
  }else{
    valoracion = 'Valoración Negativa'
  }
  arr.push({tipo:result[0].conceptos[2].tipo, concepto:result[0].conceptos[2].nombre, positivo:valoracion})
  
  console.log(arr)
  res.status(200).json(arr)
})//end post

router.post('/agregar', IsAuthenticated ,async function (req, res) {
  if(typeof(req.body.alumno) !== 'string' || req.body.alumno == '' || req.body.alumno == null){
    res.status(401).end()
    return false
  }
  if(typeof(req.body.select1) !== 'string' || req.body.select1 == '' || req.body.select1 == null){
    res.status(401).end()
    return false
  }
  if(typeof(req.body.select2) !== 'string' || req.body.select2 == '' || req.body.select2 == null){
    res.status(401).end()
    return false
  }
  if(typeof(req.body.select3) !== 'string' || req.body.select3 == '' || req.body.select3 == null){
    res.status(401).end()
    return false
  }
  
  //Obtengo el usuario
  let usuario = req.user.id
  //Obtengo la materia
  let materia = req.body.materia
  //Obtengo el cuatrimestre
  let cuatrimestre = req.body.cuatrimestre
  //Obtengo id_materia
  let id_materia = req.body.id_materia
  
  //cuento el alumno que ingresa en la bd
  let cant_alumnos = await Alumnos_Conceptos.where({id_alumno:ObjectId(req.body.alumno),
    user:ObjectId(usuario), id_materia:id_materia, cuatrimestre:cuatrimestre})
  
  //Obtengo los datos del alumno
  let dato_alumno = await Alumnos.where({active:true, _id:ObjectId(req.body.alumno)})
  

  //Obtengo el nombre del concepto
  let concepto1 = await Conceptos.where({active:true, _id:ObjectId(req.body.select1)})
  let concepto2 = await Conceptos.where({active:true, _id:ObjectId(req.body.select2)})
  let concepto3 = await Conceptos.where({active:true, _id:ObjectId(req.body.select3)})

  let obj = [
  {concepto1:req.body.select1, nombre:concepto1[0].concepto, positivo:concepto1[0].positivo, tipo:concepto1[0].tipo},
  {concepto2:req.body.select2, nombre:concepto2[0].concepto, positivo:concepto2[0].positivo, tipo:concepto2[0].tipo},
  {concepto3:req.body.select3, nombre:concepto3[0].concepto, positivo:concepto3[0].positivo, tipo:concepto3[0].tipo},
]
  
  
  if(cant_alumnos.length == 2){
      res.status(402).end()
  }//end if

  if(cant_alumnos.length == 0 || cant_alumnos.length == 1){
    
    let nuevo = await new Alumnos_Conceptos()
    nuevo.id_alumno = ObjectId(req.body.alumno)
    nuevo.name = dato_alumno[0].name
    nuevo.last_name = dato_alumno[0].last_name
    nuevo.curso = dato_alumno[0].curso
    nuevo.cuatrimestre = cuatrimestre
    nuevo.user = ObjectId(usuario)
    nuevo.materia = materia
    nuevo.id_materia = ObjectId(id_materia)
   
    nuevo.conceptos = obj
    nuevo.save(function(err){
      if (err) throw err;
      res.status(200).end()
    })
  }

  


})//end post

router.delete('/delete', IsAuthenticated ,async function(req, res){
  if(typeof(req.body.id) !== 'string' || req.body.id == '' || req.body.id == null){
    res.status(401).end()
    return false
  }
  await Alumnos_Conceptos.deleteOne({_id:ObjectId(req.body.id)})
  console.log('Se eliminó correctamente...')
  res.status(200).end()
})//end delete

router.get('/estadisticas', IsAuthenticated ,function(req,res){

  res.status(200).render('../views/estadisticas',{user: req.user.show_name,
    sexo:req.user.sexo ,tipo:req.user.tipo})
})//end

router.get('/estadisticasprofes', IsAuthenticated ,async function(req,res){
  let arr = []
  let cursos_asignados = await User.where({active:true, _id:ObjectId(req.user.id)})
  let conceptos = await Alumnos_Conceptos.where({})  
  let alumnos = await Alumnos.where({})

  cursos_asignados[0].cursos.forEach(e => {
    
    let total_materia = Number(ExtraerCantAlumnosSegunCursoYMateria(conceptos, '2', e.curso, e.id_materia))

    let total = Number(ExtrarCantAlumnosSegunCurso(alumnos, e.curso))

    if(total_materia === 'NaN'){
      total_materia = 0
    }
    if(total === 'NaN'){
      total = 0
    }

    let porcentaje = Math.round((total_materia * 100)/ total) + '%'
    arr.push({name: e.curso +' '+e.materia, porcentaje:porcentaje})
  })//end for
  
  
  res.status(200).json(arr)
})//end get




//Preceptores
router.get('/botones', IsAuthenticated ,async function(req,res){
  let cursos_asignados = await User.where({active:true, _id:ObjectId(req.body.id)})
  let arr = cursos_asignados[0].cursos.sort(function (a, b) {
            
    if(a.name >  b.name){
        return 1
    }
    if(a.name <  b.name){
        return -1
    }
    return 0
  })

  res.status(200).json(arr)
})//end get

router.get('/preceptores', IsAuthenticated ,async function(req,res){
  let arrEnviar = []
  res.status(200).render('../views/menu_preceptores',{arrEnviar,user: req.user.show_name, sexo:req.user.sexo, tipo:req.user.tipo})
})//end get

router.get('/cursosAsignadosPreceptores', IsAuthenticated ,async function(req,res){

  let cursos_asignados_preceptores = await User.where({active:true, _id:ObjectId(req.user.id)})
  //console.log(cursos_asignados_preceptores[0].cursos)
  res.status(200).json(cursos_asignados_preceptores[0].cursos)
  
})//end get

router.post('/alumnos_preceptor', IsAuthenticated ,async function (req, res) {
  let data = []
  //console.log(req.body.curso)
  let alumnos = await Alumnos.where({active:true,curso:req.body.curso})
  
  let arrEnviar = []
  alumnos.forEach(e =>{
    arrEnviar.push({id:e._id, last_name:e.last_name, name:e.name})
  })//end for
  
  let data3=[]
  _.each(alumnos,function(objeto) {
  
    var elemento_en_data2 = _.find(data,objeto);
    
    if(elemento_en_data2===undefined) {
      data3.push(objeto);
    }
    
  });

  arrEnviar = data3
  
  res.status(200).json(arrEnviar)
})//end post

router.post('/alumnos2', IsAuthenticated ,async function(req,res){
  let curso = req.body.curso
  
  let alumnos = await Alumnos.where({curso:curso}).sort({last_name:1})
  
  res.status(200).json(alumnos)
  
})//end

router.post('/consultar', IsAuthenticated ,async function(req,res){
  let id_alumno = req.body.id_alumno
  let cuatrimestre = req.body.cuatrimestre
  
  let conceptos = await Alumnos_Conceptos.where({id_alumno:ObjectId(id_alumno), cuatrimestre:cuatrimestre})

  if(conceptos.length === 0){
    res.status(200).json({generar:false})
    return false
  }

  let materias_por_curso = await Materias.where({cursos:conceptos[0].curso})
  
  

  if(Tools.Obj.twoObjectArrayAreEqual(conceptos, materias_por_curso)){
    res.status(200).json({generar:true})
    return false
  }else{
    res.status(200).json({generar:false})
    return false
  }
})//end


//Psicopedagoga
router.get('/psicopedagoga', IsAuthenticated ,async function (req, res) {

  res.status(200).render('../views/menu_psico',{user: req.user.show_name, sexo:req.user.sexo,tipo:req.user.tipo})
})//end get

router.post('/estadisticaspsico', IsAuthenticated ,async function(req,res){
  let arr = []
  let cuatrimestre = req.body.cuatrimestre
  let materias = await Materias.where({})
  let conceptos = await Alumnos_Conceptos.where({})  
  let alumnos = await Alumnos.where({})
  
  materias.forEach(e => {
    
    e.cursos.forEach(f => {

      total_materia = Number(ExtraerCantAlumnosSegunCursoYMateria(conceptos, cuatrimestre, String(f), e._id))

      let total = Number(ExtrarCantAlumnosSegunCurso(alumnos, String(f)))

      let porcentaje = Math.round((total_materia * 100)/ total) + '%'
      arr.push({name: String(f) +' '+e.materia, porcentaje:porcentaje})
    })//end for
  })//end for
  
  //console.log(arr)
  res.status(200).json(arr)
})//end get

router.get('/estadisticaspsicopagina', IsAuthenticated ,function(req,res){

  res.status(200).render('../views/estadisticas2',{user: req.user.show_name,
    sexo:req.user.sexo ,tipo:req.user.tipo})
})//end

router.get('/conceptospsico', IsAuthenticated ,async function (req, res) {

  res.status(200).render('../views/conceptos',{user: req.user.show_name, sexo:req.user.sexo,tipo:req.user.tipo})
})//end get

router.get('/api-conceptos', IsAuthenticated ,async function (req, res) {
  let arr = []
  let valoracion_ = ''
  let conceptos = await Conceptos.where({active:true})
  
  conceptos.forEach(e => {
    if(e.positivo === true){
      valoracion_ = 'Positiva'
    }else{
      valoracion_ = 'Negativa'
    }
    arr.push({id:e._id, tipo:e.tipo, concepto:e.concepto, valoracion:valoracion_})
  })//end

  let dato = {data:arr}
  res.status(200).json(dato)
})//end get

router.post('/addconcept', IsAuthenticated ,async function(req,res){
  let concepto = req.body.concepto
  let tipo = req.body.tipo
  let positivo = req.body.positivo

  if(positivo === 'Positiva'){
    positivo = true
  }
  if(positivo === 'Negativa'){
    positivo = false
  }

  let result = await Conceptos.where({active:true, tipo:tipo, concepto:concepto, positivo:positivo})

  if(result.length !== 0){
    res.status(401).end()
    return false
  }

  let dato = new Conceptos()
  dato.concepto = concepto
  dato.tipo = tipo
  dato.positivo = positivo
  dato.save(function(err){
    if (err) throw err;
    res.status(200).end()
  })
})//end

router.delete('/deleteConcept', IsAuthenticated ,async function(req,res){
  if(typeof(req.body.id) !== 'string' || req.body.id == '' || req.body.id == null){
    res.status(401).end()
    return false
  }

  let id = req.body.id
  await Conceptos.deleteOne({_id:ObjectId(id)})
  console.log('Se eliminó correctamente...')
  res.status(200).end()
})//end

router.post('/searchConcept', IsAuthenticated,async function(req, res){
  let valoracion;
  let id = req.body.id
  
  let result = await Conceptos.where({active:true, _id:ObjectId(id)})
  if(result[0].positivo === true){
    valoracion = 'Positiva'
  }else{
    valoracion = 'Negativa'
  }
  let obj = {
    tipo:result[0].tipo,
    positivo:valoracion,
    concepto:result[0].concepto,
  }
  res.status(200).json(obj)
})//end

router.post('/updateConcept', IsAuthenticated ,async function(req,res){
  if(typeof(req.body.id) !== 'string' || req.body.id == '' || req.body.id == null){
    res.status(401).end()
    return false
  }
 
  if(req.body.positivo === 'Positiva'){
    positivo = true
  }
  if(req.body.positivo === 'Negativa'){
    positivo = false
  }

  let t = await Conceptos.findByIdAndUpdate(ObjectId(req.body.id),{tipo:req.body.tipo,
  positivo:positivo, concepto:req.body.concepto})
  res.status(200).end()
})//end

router.get('/grupos', IsAuthenticated ,async function(req,res){
  let grupos =await Grupos.where({})

  
  res.status(200).json(grupos)
})//end

router.get('/observaciones', IsAuthenticated ,function(req,res){
  res.status(200).render('../views/observaciones',{user: req.user.show_name, sexo:req.user.sexo,tipo:req.user.tipo})
})//end

router.get('/api-alumnos', IsAuthenticated,async function(req,res){
  let obj = {}
  let arr = []
  let result = await Alumnos.where({active:true})
  let obs = await Observaciones.where({})
  
  result.forEach(e => {
    obj={
      id_obs: '',
      id_alumno:e._id,
      last_name:e.last_name,
      name:e.name,
      curso:e.curso,
      obs:false
    }
    arr.push(obj)
  })//

  arr.forEach(e => {
    obs.forEach(f => {
      
      if(e.id_alumno.equals(f.id_alumno)){
        e.id_obs = f._id
       e.obs = true
      }
    })//
  })//end

  
  //console.log(arr)
  res.status(200).json(arr)
})//end

router.post('/addObs', IsAuthenticated ,async function(req,res){
  let apellido = req.body.apellido
  let comentario = req.body.comentario
  let nombre = req.body.nombre
  let curso = req.body.curso

  let datos = await Alumnos.where({active:true, last_name:apellido.trim(), 
    name:nombre.trim(), curso:curso.trim()})
  
  //Controla que no haya duplicado
  let result = await Observaciones.where({id_alumno:ObjectId(datos[0]._id)})
  if(result.length !== 0){
    res.status(401).end()
    return false
  }

  let data = new Observaciones()
  data.id_alumno = ObjectId(datos[0]._id)
  data.observacion = comentario
  data.save(function(err){
    if (err) throw err;
    res.status(200).end()
  })
})//end

router.delete('/deleteobs',IsAuthenticated, async (req, res) =>{
  
  let id = req.body.id
  await Observaciones.deleteOne({_id:ObjectId(id)})
  console.log('Se eliminó correctamente...')
  res.status(200).end()
})//end

router.post('/getObs',IsAuthenticated,async (req,res) => {
  let id = req.body.id
  let obs = await Observaciones.where({_id: ObjectId(id)})

  res.status(200).json(obs)
})//end

router.put('/editObs',IsAuthenticated,async (req,res) => {
  let id = req.body.id
  let coment = req.body.comentario
 
  await Observaciones.updateOne({_id:ObjectId(id)},{$set: {observacion:coment}})
  //console.log(y)
  res.status(200).end()
})//end


//Pdf
router.post('/descarga', IsAuthenticated ,async function(req, res){
  let id_alumno = req.body.id_alumno
  let curso = req.body.curso
  let cuatrimestre = req.body.cuatrimestre
  
  //Obtengo las materias del curso
  let materias = await Materias.where({cursos:curso}).sort({materia:1})
  //Obtengo los conceptos del alumno
  let conceptos_guardados = await Alumnos_Conceptos.where({id_alumno:ObjectId(id_alumno)})
  //Obtengo la observacion
  let obs = await Observaciones.where({id_alumno:ObjectId(id_alumno), cuatrimestre:cuatrimestre})
  
  let nombreAlumno = conceptos_guardados[0].last_name + ' ' +  conceptos_guardados[0].name
  
  res.status(200).json({status:true, materias, conceptos_guardados, obs, cuatrimestre, nombreAlumno})
})//end get























router.get('/cargarUsuario', async  (req, res) => {
  let user = await new User()
  user.username = 'guillermo'
  user.password = bcrypt.hashSync('12xp', 10)
  user.show_name = 'Cabral Guillermo'
  user.sexo = 'm'
  user.tipo = 'profe'
  user.active = true;
  user.cursos.push(
  {curso:'4H', materia:'Tecnología'},
  {curso:'4CN', materia:'Tecnología'},
  /*{curso:'3CN', materia:'Biblia'},
  {curso:'2A', materia:'Inglés'},
  {curso:'1A', materia:'Inglés'},
  {curso:'2B', materia:'Inglés'},
  {curso:'1B', materia:'Inglés'},
  {curso:'5H', materia:'Inglés'},
  {curso:'4H', materia:'Inglés'},
  {curso:'4CN', materia:'Inglés'},
  {curso:'2A', materia:'Fisico-Quimica'},
  {curso:'4H', materia:'Quimica'}*/
  )
  user.save()
  res.send('ok')
  
  //await User.updateOne({active:true, _id:ObjectId('5f3a7d89a3586b0e5438c594')},{$push: {cursos: {curso:'3A'}} })
})//end get


router.get('/editarclave', async  (req, res) => {
  let id = '5f785fe24ac16b1608ecab27'

  let newpass =  bcrypt.hashSync('ros22', 10)  //users[0].password
  await User.updateOne({active:true, _id:ObjectId(id)},{$set: {password:newpass }})
  res.status(200).send('ok...')
})






















//Functions
function IsAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }
}

function IsNotAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/home");
  }
}

function queCuatrimestreEs(){
  let mes = new Date()
  if((mes.getMonth() + 1) <= 7){
    return '1'
  }
  if((mes.getMonth() + 1) >= 8){
    return '2'
  }
}

function fecha(){
  let f = new Date();
  return(f.getDate() + "-"+ f.getMonth()+ "-" +f.getFullYear());
}

//extrae conceptos del alumno segun la materia
function ExtraerConceptosSegunMateria(array2, valor, id_materia){
  let arr = []
  let cuatrimestre = valor
  let idmateria = id_materia
    
  array2.forEach( f => {
      
    if(String(idmateria) === String(f.id_materia) && String(cuatrimestre) === String(f.cuatrimestre) ){
  
      arr.push({text:f.materia,alignment: 'center'}, {text:f.conceptos[0].nombre,alignment: 'center'}, {text:f.conceptos[1].nombre,alignment: 'center'}, {text:f.conceptos[2].nombre,alignment: 'center'})
    }//end if
  })//end for
    
  return arr
}//end fun

function ExtraerCantAlumnosSegunCursoYMateria(array_cursos, cuatrimestre_, curso_, idMateria){
  let cuatrimestre = cuatrimestre_
  let id_materia = idMateria
  let curso = curso_
  let c = 0

  array_cursos.forEach( e => {

    if(e.cuatrimestre === cuatrimestre && e.curso === curso && String(e.id_materia) === String(id_materia)){
      c++
    }

  })//end for

  return c
}//end funcion


function ExtrarCantAlumnosSegunCurso(array_alumnos, curso_){
//let cuatrimestre = cuatrimestre_
let curso = curso_
let c = 0

array_alumnos.forEach( e => {

  if(e.curso === curso){
    c++
  }
})//end for
return c
}//end funcion

function UbicarEnY(total,porcentaje){
  return Math.round((porcentaje * total)/100)
}//end

//Exporto las rutas
module.exports = router;




