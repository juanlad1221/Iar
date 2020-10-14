module.exports.Obj = {

    //value: the value to control.
    //schema: the configuration scheme. Must be array.


    Data: (value, schema) => {
        
        //Input data control....
        if(value === '' || value === ' ' || value === null || value === 'undefined'){console.log('Invalid input...');return false}
        if(! Array.isArray(schema) || schema.length === 0){console.log('Invalid schema...');return false}

        //Data control within the array
        var error = false //Flag
        schema.forEach(e => {
            
            if(typeof(e) !== 'string'){
                error = true
                return false
            }//end
        })//end
        if(error === true){
            console.log('Invalid schema...2')
            return false
        }//end


        


        //if pass the control....
        schema.forEach(e => {
            switch (e){

                case 'string':
                    if(typeof(value) === 'string'){
                        error = false
                        return false
                    }else{
                        error = true
                        return false
                    }
                break

                case 'number':
                    if(typeof(value) === 'number'){
                        error = false
                        return false
                    }else{
                        error = true
                        return false
                    }
                break

                case 'object':
                    if(typeof(value) === 'object'){
                        error = false
                        return false
                    }else{
                        error = true
                        return false
                    }
                break
                
                case 'boolean':
                    if(typeof(value) === 'boolean'){
                        error = false
                        return false
                    }else{
                        error = true
                        return false
                    }
                break

                case 'date':
                    if(value instanceof Date){
                        error = false
                        //console.log(value instanceof Date, 'ok')
                        return false
                        
                    }else{
                        error = true
                        //console.log(value instanceof Date)
                        return false
                    }
                break

                case 'coincidence':
                    //console.log(schema[1])
                    if(value === schema[1]){
                       error = false
                    }else{
                        error = true
                    }
                break
                }//end
        })//end


        if(error === true){
            return false
        }else{
            return value
        }
        

    }//end Data
}//end object