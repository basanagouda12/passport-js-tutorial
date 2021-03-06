const express = require('express')
const expressLayouts = require('express-ejs-layouts');
const mongoose =require('mongoose');
const app = express();
const flash =require('connect-flash');
const session = require('express-session')
const passport=require('passport');
//passport 
require('./config/passport')(passport);
const db = require('./config/keys').MongoURI;

mongoose.connect(db, { useNewUrlParser: true ,useUnifiedTopology: true })
.then(() => console.log('mongoDB connected...'))
.catch(err => console.log(err));

app.use(expressLayouts);

app.set('view engine', 'ejs');
//body parser
app.use(express.urlencoded({ extended: false }));

///express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    
  }));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
//global vars
app.use((req,res,next)=> {
    res.locals.success_msg =req.flash('success_msg');
    res.locals.error_msg =req.flash('error_msg');
    res.locals.error=req.flash('error');
    next();
});


//router
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));

const PORT = process.env.PORT || 5000;

app.listen(PORT,console.log(`Server started on port ${PORT}`));
