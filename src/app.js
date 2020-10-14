const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
// RUTAS
const allRoutes = require('./routes/routes');




//------------------------EXPRESS----------------------------------------------------------
const app = express();
//-----------------------------------------------------------------------------------------

// PASSPORT
require('./passport/passport');





//------------------------SETTINGS---------------------------------------------------------
app.set('views', path.join(__dirname, 'views'));
//-----------------------------------------------------------------------------------------








//-------------------------MIDDLEWARE------------------------------------------------------
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
//Sessions
app.use(session({
  secret: 'yonome1221',
  cookie: {
    maxAge: (1000 * 60 *30)
  },
  resave: false,
  saveUninitialized: false
}))
//Passport
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  app.locals.error = '';
  next();
});

app.use((req, res, next) => {
  //Control de Licencias
  //ContolDeLicencias()
  next()
})

//------------------------------------------------------------------------------------------




//--------------------------ROUTES----------------------------------------------------------
app.use('/', allRoutes)
//-----------------------------------------------------------------------------------------









//Conexion BD
require('./db_conection/conection');









//--------------------------SERVER---------------------------------------------------------
app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), () => {
  console.log(`Server corriendo en ${app.get('port')}`)
})
//------------------------------------------------------------------------------------------



async function ContolDeLicencias(){
  const Docentes = require('./schemas/Docentes')
  const Eventos = require('./schemas/Eventos')
  var ObjectId = require('mongoose').Types.ObjectId;
  const juan = require('./public/ObjExport')

  let result = await Eventos.where({active:true, confirm:true, down:false}).exec()
  if(result.length === 0){
    return false
  }

  let hoy = new Date()
  
  for(let i in result){
    //(juan.Obj.firstDateMayorString(hoy, result[i].fin))  ( hoy > result[i].fin)
    if ( hoy > result[i].fin) {
      
      //Si NO son Iguales las Fechas Actualizo y doy de Baja
      if(!juan.Obj.equalDateObject(hoy, result[i].fin)){
        console.log('Encontre a: '+ result[i].fin + '...')
        await Eventos.where({active:true, confirm:true, down:false, _id:ObjectId(result[i]._id)}).updateOne({active: false, down:true, low_motive:'Baja de Licencia por Sistema ' +hoy+'...' }).exec()
        console.log('Licencia Actualizada en: app.js...')
        return false
      }//end if
    }//end if
  }//end for
}//end function