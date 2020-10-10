var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
//documentations
var swaggerJsDocs = require('swagger-jsdoc');
var swaggerUiExpress = require('swagger-ui-express');

const swaggerOptions={
  swaggerDefinition: {
    info:{
      title:"decodeAI Api",
      description:" ",
      contact:{
        name:"Backend Team"
      },
      server:["localhost:3000"]
    }
  },
  apis:["app.js"]
};
const swaggerDocs=swaggerJsDocs(swaggerOptions);
var indexRouter = require('./routes/index/index');
// var logycodeRouter = require('./routes/logycode/logycode');
var usersRouter = require('./routes/user/index');
// var customersRouter = require('./routes/customer/index');
// var company = require('./routes/company/index');
// var unauthenticatedRoutes = require('./routes/unauthenticated/index');
// var notificationRoutes = require('./routes/notificationRoutes/index');
// var s3bucket = require('./controllers/commonControllers/fileUpload/s3Bucket');


var cors = require('cors');
var app = express();
app.use(cors());
app.use('/api-docs',swaggerUiExpress.serve,swaggerUiExpress.setup(swaggerDocs));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
//app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'),{ dotfiles: 'allow' }));

app.use('/', indexRouter);
/**
 * @swagger
 * /Admin Side:
 *  post:
 *    description: Use to Login
 *    responses:
 *      '200':
 *        description: A successful response
 */
app.use('/users', usersRouter);
// app.use('/lyc', logycodeRouter);
// app.use('/customer', customersRouter);
// app.use('/company', company);
// app.use('/unAuth', unauthenticatedRoutes);
// app.use('/notification',notificationRoutes );
// app.post('/s3Bucket', s3bucket.uploadFileAWS);
// app.post('/s3BucketMultiple', s3bucket.uploadFileAWSMultiple);

//test







app.post('/submitUsername', function(req, res){
    req.session.username = req.body.name;
    res.send(req.body);
});

app.post('/submitRoom', function(req, res){
    rooms[req.body.roomId] = new Room(req.body.roomName, req.body.roomId);
    res.send(req.body);
});


///testt

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
module.exports = app;
