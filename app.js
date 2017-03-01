var express     = require('express');
var path = require('path');
var bodyParser  = require('body-parser');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var port        = process.env.PORT || 8000;

// [SH] Require Passport
var passport = require('passport');

// [SH] Bring in the data model
require('./server/models/database');
// [SH] Bring in the Passport config after model is defined
require('./server/config/passport');


// [SH] Bring in the routes for the API (delete the default routes)
var routesApi = require('./server/routes/index');

var app         = express();
var fs          = require('fs');
var guid        = require('guid');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));

// [SH] Initialise Passport before using the route middleware
app.use(passport.initialize());

// [SH] Use the API routes when path starts with /api
app.use('/api', routesApi);

// [SH] Otherwise render the index.html page for the Angular SPA
// [SH] This means we don't have to map all of the SPA routes in Express
app.use(function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// [SH] Catch unauthorised errors
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401);
        res.json({"message" : err.name + ": " + err.message});
    }
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;

var excel = require('./excel-generator');
var excel_generator = require('./excel-generator-common');
var control_excel = require('./control_excel-generator');

var xlsDirectory = __dirname + "/excel/";

/* GET home page. */
app.get('/', function (req, res, next) {
    res.status(200).sendFile(__dirname + '/public/index.html');
});

/* Create Excel Temp File */
app.post('/createExcel', function (req, res, next) {
    var data = req.body;
    var fileName = guid.raw();
    data.filename = fileName;
    excel_generator(xlsDirectory, data, function (err, location) {
        if (!err) {
            res.status(200);
            res.end(fileName);
        } else {
            res.status(500);
            res.end('Cannot fulfill the request. We are so sorry.');
        }
    });
});

/* Download Excel File and Delete temp file */
app.get('/downloadExcel/:fileName', function (req, res, next) {
    var fileName = req.params.fileName;
    var filePath = xlsDirectory + fileName;

    if (fs.existsSync(filePath)) {
        res.status(200);
        res.append('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.append('Content-Disposition', 'attachment; filename=output.xlsx')
        fs.readFile(filePath, function(err, data) {
            res.end(data);
            fs.unlink(filePath);
        });
    } else {
        res.status(404);
        res.end('Requested file does not exist!');
    }
});

app.post('/xlsx', function (req, res, next) {
    var data = req.body;
    var fileName = guid.raw();
    data.filename = fileName;
    excel(xlsDirectory, data, function (err, location) {
        if (!err) {
            res.status(200);
            res.end(fileName);
        } else {
            res.status(500);
            res.end('Cannot fulfill the request. We are so sorry.');
        }
    });
});

app.post('/control_xlsx', function (req, res, next) {
    console.log(req);
    var data = req.body;
    var fileName = guid.raw();
    data.filename = fileName;
    control_excel(xlsDirectory, data, function (err, location) {
        if (!err) {
            res.status(200);
            res.end(fileName);
        } else {
            res.status(500);
            res.end('Cannot fulfill the request. We are so sorry.');
        }
    });
});


app.get('/download-excel/:fileName', function (req, res, next) {
    var fileName = req.params.fileName;
    var filePath = xlsDirectory + fileName;

    if (fs.existsSync(filePath)) {
        res.status(200);
        res.append('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.append('Content-Disposition', 'attachment; filename=output.xlsx')
        fs.readFile(filePath, function(err, data) {
            res.end(data);
            fs.unlink(filePath);
        });
    } else {
        res.status(404);
        res.end('Requested file does not exist!');
    }
});

app.get('/control_excel_download/:fileName', function (req, res, next) {
    var fileName = req.params.fileName;
    var filePath = xlsDirectory + fileName;

    if (fs.existsSync(filePath)) {
        res.status(200);
        res.append('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.append('Content-Disposition', 'attachment; filename=output.xlsx')
        fs.readFile(filePath, function(err, data) {
            res.end(data);
            fs.unlink(filePath);
        });
    } else {
        res.status(404);
        res.end('Requested file does not exist!');
    }
});

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);