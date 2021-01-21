var express = require('express');
var http = require('http');
var static = require('serve-static');
var path = require('path');
var bodyParser = require('body-parser');
var expressErrorHandler = require('express-error-handler');

var user = require('./user');

var app = express();

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(static(path.join(__dirname,'views')));

var router = express.Router();

router.route('/process/adduser').post(user.adduser);

router.route('/process/login').post(user.login);

app.use('/', router);

var ErrorHandler = expressErrorHandler({
    static: {
        '404': './views/404.html'
    }
});

app.use( expressErrorHandler.httpError(404) );
app.use( ErrorHandler );

var server = http.createServer(app);
app.listen(app.get('port'), function(){
    console.log('server start : ' + app.get('port'));
});