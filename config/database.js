if(process.env.NODE_ENV==='production'){
    module.exports={mongoURI:
    'mongodb+srv://MyFirstDataBase:MyFirstDataBase@cluster0-vuabq.mongodb.net/vidjot-prod?retryWrites=true'
    }
} else{
    module.exports={mongoURI:'mongodb://localhost/vidjot-dev'}
}