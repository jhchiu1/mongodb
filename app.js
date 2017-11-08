var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('express-flash');
var session = session = require('express-session');
var MongoClient = require('mongodb').MongoClient;

var index = require('./routes/index');

var app = express();

var db_url = "mongodb://dbUser:password23@127.0.01:27017/todo?authSource=admin";


// Set the environment variable MONGO_URL to the correct URL
var db_url = process.env.MONGO_URL;

// And connect to mongoose, log success or error
mongoose.Promise = global.Promise;  // use native ES6 promises
mongoose.connect(db_url, { useMongoClient: true })
    .then( () => {  console.log('Connected to MongoDB') } )
    .catch( (err) => { console.log('Error Connecting to MongoDB', err); });

console.log(process.env.MONGO_URL);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Configure flash messaging. Do this after cookieParser
app.use(session( {secret: 'top secret', resave : false, saveUninitialized: false }))
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));
db_url = "mongodb://dbUser:password23@127.0.0.1:27017/todo?authSource=admin"
MongoClient.connect(db_url).then( (db) => {

    var tasks = db.collection('tasks');
    app.use('/', function(req, res, next) {
        req.tasks = tasks;
        next();
    });

    app.use('/', index);


// catch 404 and forward to error handler
    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

// error handler
    app.use(function (err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error');
    });

}).catch((err) => {
  console.log('Error connecting to MongoDB', err);
  process.exit(-1);
});
module.exports = app;
