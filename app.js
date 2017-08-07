var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var index = require('./routes/index');
var users = require('./routes/users');

//para conexion mongodb remota
mongoose.connect('mongodb://admin:admin@ds157740.mlab.com:57740/angular');
var db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error'));
db.once('open',function(){
  console.log('mongoose connection successful');
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// muestra log de todos los request
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// localizacion de los ficheros estaticos
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



let basedatos = require('./models/base.js');


// Rutas de nuestro API
// GET de basedatos
app.get('/api/todos', function(req, res) {
    Todo.find(function(err, basedatos) {
        if(err) {
            res.send(err);
        }
        res.json(basedatos);
    });
});

// POST que crea un basedatos y devuelve todos tras la creación
app.post('/api/todos', function(req, res) {
    Todo.create({
        text: req.body.text,
        done: false
    }, function(err, basedatos){
        if(err) {
            res.send(err);
        }
        basedatos.find(function(err, basedatos) {
            if(err){
                res.send(err);
            }
            res.json(basedatos);
        });
    });
});

// DELETE un basedatos específico y devuelve todos tras borrarlo.
app.delete('/api/todos/:todo', function(req, res) {
    Todo.remove({
        _id: req.params.todo
    }, function(err, basedatos) {
        if(err){
            res.send(err);
        }

        Todo.find(function(err, basedatos) {
            if(err){
                res.send(err);
            }
            res.json(basedatos);
        });

    })
});

// Carga una vista HTML simple donde irá nuestra Single App Page
// Angular Manejará el Frontend
app.get('*', function(req, res) {
    res.sendfile('./public/index.html');
});

module.exports = app;
