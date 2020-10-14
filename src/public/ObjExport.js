var ObjectId = require('mongoose').Types.ObjectId;

module.exports.Obj = {
    
    
    //Date String
    equalDateString: function(date1, date2){
        date1 = date1.split('/',3)
        date2 = date2.split('/',3)

        if (date1[2] === date2[2] && date1[1] === date2[1] && date1[0] === date2[0]){
            return true
        }else{
            return false
        }
    },//end equalDateString

    
    firstDateMayorString: function(date1, date2){
        date1 = date1.split('/',3)
        date2 = date2.split('/',3)

        //Si año fecha 1 es mayor que año fecha 2
        if(Number(date1[2]) > Number(date2[2])){
            return true
        }

        //Si ambos años son iguales pero mes1 es mayor que mes2
        if(Number(date1[2]) === Number(date2[2]) && Number(date1[1]) > Number(date2[1])){
            return true
        }

        //Si ambos años y mese son iguales pero dia1 es mayor que dia2
        if(Number(date1[2]) === Number(date2[2]) && Number(date1[1]) === Number(date2[1]) && Number(date1[0]) > Number(date2[0])){
            return true
        }

        return false
    },//end firstDateMayorString

    
    convertObjetDateToString: function(date){
        let dia_ = String(date.getDate());
        let mes_ = String((date.getMonth() + 1));
        let año_ = String(date.getFullYear());

        if (dia_.length == 1) {
            dia_ = '0' + dia_;
        }
        if (mes_.length == 1) {
            mes_ = '0' + mes_;
        }
        return String(dia_ + '/' + mes_ + '/' + año_)
    },//end convertObjetDateToString

    
    getMonthOfNumber: function(number){
        switch (number){
            case 2:
                return 'Febrero'
            break
            case 3:
                return 'Marzo'
            break
            case 4:
                return 'Abril'
            break
            case 5:
                return 'Mayo'
            break
            case 6:
                return 'Junio'
            break
            case 7:
                return 'Julio'
            break
            case 8:
                return 'Agosto'
            break
            case 9:
                return 'Septiembre'
            break
            case 10:
                return 'Octubre'
            break
            case 11:
                return 'Noviembre'
            break
            case 12:
                return 'Diciembre'
            break
        }
    },//getMonthOfNumber

    
    
    //Date Object
    equalDateObject: function(date1, date2){
        if (date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate()){
            return true
        }else{
            return false
        }
    },//end equalDateObject

    getDaysBetween2DatesObject:function(dmenor, dmayor){
        let dia;
        let diaMenor;
        let c = 0;
        
        if(dmenor > dmayor){
            
            return false
        }

        diaMenor = dmenor
        
        for(let i = 0; i == 0;){
            c++
            if(this.equalDateObject(diaMenor,dmayor)){
                return c
                break;
            }else{
                dia = diaMenor.getDate() + 1
                diaMenor.setDate(dia)
            }
        }
    },//getDaysBetween2DatesObject

    getFirstAndLastDateOfOneMounthAndAYear: function(mes, año){
        let date = new Date(año,mes,1)
        let primerDia = new Date(date.getFullYear(), date.getMonth(), 1)
        let ultimoDia = new Date(date.getFullYear(), date.getMonth() + 1, 0)
        return[String(this.completeTo2Digits(primerDia.getDate()) +'/'+ this.completeTo2Digits((Number(mes)) + 1)+ '/' + año), String(this.completeTo2Digits(ultimoDia.getDate())+ '/' + this.completeTo2Digits((Number(mes) + 1))+ '/'+ año)]
    },//getFirstAndLastDateOfOneMounthAndAYear

    
    

    //Colors Random
    randomColors: function(num) {
        let r;
        let g;
        let b;
        let colorArray = []
        
        for(let i =0; i < num; i++){
            r = Math.floor(Math.random() * 255);
            g = Math.floor(Math.random() * 255);
            b = Math.floor(Math.random() * 255);
            
            colorArray.push("rgb(" + r + "," + g + "," + b + ")")
        }//end for

        return colorArray
    },//end randomColors




    
    //Values
    getMayorValueOfArrayOfNumber: function(array){
        array.sortNumbers()
        array.reverse()
        return array[0]
    },//end getMayorValueOfArrayOfNumber

    completeTo2Digits: function(val){
        let value = String(val)
        if(value.length === 1){
            if(value === '0'){
                return value
            }else{
                return String('0' + value)
            }
        }else{
            return value
        }
    },//completeTo2Digits

    sortArrayOfObjectsByAnyField: (array, key) => {
        array.sort(function (a, b) {
            return a[key] >  b[key];
          })
          
          return array
          //return array.reverse()
    },//sortArrayOfObjectsByAnyField

    sortArrayOfObjectsAlfabetic: (array, key) => {
        array.sort(function (a, b) {
            
            if(a[key] >  b[key]){
                return 1
            }
            if(a[key] <  b[key]){
                return -1
            }
            return 0
          })
          
    },//sortArrayOfObjectsAlfabetic

    getIndexOfObjectArray: (array, value) => {
        for(let i = 0; i < array.length; i++){
            if(array[i].mes === value){
                return i
            }
        }//end for
    },//getIndexOfObjectArray

    findValueInObjectArray:(array, value) => {
        var flag = false
        
        array.forEach(e => {
            for(let i in e){
                //console.log(e[i])
                if(e[i] === value){
                    flag = true
                }
            }
        })//end for

        if(flag === true){
            return true
        }else{
            return false
        }
    },//findValueInObjectArray

    countIdInObjectArray:(array, id) => {
        c = 0
        array.forEach(e => {
            if(String(e.id_alumno) === id){
                c++
            }
        })//end for
        //console.log(c)
        return c
    },//end countIdInObjectArray

    mayorValueInObject: function(obj){
        let a;
        let keys = []
        let values = []
            
      //Paso el Objeto devuelto a dos Arrays
      for(let i in obj){
          keys.push(i)
          values.push(Number(obj[i]))
      }//end for

      a = keys.sort()
      a.reverse()
      return a[0]
    },//end mayor value

    twoObjectArrayAreEqual: (array1, array2) => {
        let cant1 = array1.length   
        let cant2 = array2.length
        //console.log(cant1,cant2,'ok')
        let c = 0

        array1.forEach(e => {

            array2.forEach(f => {

                if(String(e.id_materia) === String(f._id)){
                    c++
                }

            })//end for2

        })//end for
        //console.log(c, 'cont')
        if(c === cant1 && c=== cant2){
            return true
        }else{
            return false
        }
    },



}//end obj


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

Array.prototype.sortNumbers = function(){
    return this.sort(
        function(a,b){
            return a - b
        }
    );
}

  