const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
var ObjectId = require('mongoose').Types.ObjectId;
// SCHEMAS
const User = require('../schemas/Users')


//Serialize
passport.serializeUser(function(user,done){
    done(null, user[0].id);
});

//Deserialize
passport.deserializeUser(async function(id,done){
    let user = await User.findById(id);
    done(null,user);
});


//Login
passport.use('local-login', new LocalStrategy({
    usernameField: 'user',
    passwordField:'password',
    passReqToCallback: true

},async function(req,username,password,done){
    
    let user = await User.where({username:username, active:true})
    
    //Si es length es 0 no coincide el username.
    if(user.length === 0){
        return done(null,false);
    }

    //Si coincide el user name controla el password
    let pass_desencriptada = bcrypt.compareSync(password, user[0].password);
    
    //Si  NO coincide la password
    if (!pass_desencriptada){
        //console.log(pass_desencriptada)
        return done(null,false);
    }
    
    //Si coincide
    done(null,user)
}))




