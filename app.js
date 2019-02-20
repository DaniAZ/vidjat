const express= require('express');
const path=require('path')
const exphbs  = require('express-handlebars');
const methodOverride = require('method-override')
const flash=require('connect-flash');
const session=require('express-session')
const passport=require('passport');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const app= express();


//Load routes
const ideas=require('./routes/ideas');
const users=require('./routes/users');

//Passport Config
require('./config/passport')(passport);

//DB config
const db=require('./config/database');

//Map global promise -get rid of warning
mongoose.Promise=global.Promise;
//connect to mongoose
mongoose.connect(db.mongoURI,{
    //useMongoClient:true
    useNewUrlParser: true
})
//promise and callback i dont get it.
.then(()=>console.log("mongodb connected...."))
.catch(err=>console.log(err));



//Handlebars Middleware
//telling template that are using handlebars template
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//static folder
//app.use(express.static(path.join(__dirname,'public')))
app.use(express.static('public'))
//method override middleware
app.use(methodOverride('_method'));

//Express middleware session
//app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
  
}))

//after Express middleware session
//passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//Global variables

app.use(function(req,res,next)
{
    //success_msg is global variable
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.error=req.flash('error');
    res.locals.user=req.user || null;
    next();
})
//how middleware works
// app.use(function(req,res,next){
//     console.log(Date.now());
//     req.name="Daniel Zumeui";

//     next();
// });

//Index Route

app.get('/',(req,res)=>{
  //  console.log(req.name)
    const title='Home index'
     res.render('index',{
         title:title
     })
    //response.sendFile(path.resolve(__dirname,'Home.html')) 
})
 //about Route

app.get('/about',(req,res)=>{
    res.render('about')
   //response.sendFile(path.resolve(__dirname,'Home.html')) 
})


//use routes
app.use('/ideas',ideas)
app.use('/users',users)

const port=process.env.PORT || 5000;
app.listen(port,()=>{
    console.log(`Server started on port ${port}`);
})