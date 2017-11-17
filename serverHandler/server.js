var http = require('http');
var url = require('url');
var fs = require('fs');
var multer = require('multer');
var multiparty = require('multiparty');
var path = require('path');

// Create Http server instances.
function first() {
  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    console.log(pathname)
    route(handle, pathname, response, request)


  };
    console.log("Server listening on port 3003")
    http.createServer(onRequest).listen(3003)


};
first();


// Create handle object to run eventHandler functions
var handle = {};
handle['/'] = start;
handle['/start'] = start;
handle['/upload'] = upload;
handle['/:file'] = show;

// Create route to match endpoint and function
var route = function(handle, pathname, response, request) {
  if(typeof handle[pathname] === 'function') {;
    handle[pathname](response, request);
  } else {
    response.writeHead(200, {'contentType': 'text/html'});
    response.write("Can not find handler ");
    response.end();
  }
}

//create start function for html page response
function start(response) {
  var html = '<html>'+
    '<head>'+
    '<meta http-equiv="Content-Type" content="text/html; '+
    'charset=UTF-8" />'+
    '<title>Dev upload page</title>'+
    '</head>'+
    '<body>'+
    '<form action="/upload" enctype="multipart/form-data" '+
    'method="post">'+
    '<input type="file" name="newImage" />'+
    '<input type="submit" value="Upload image" />'+
    '</form>'+
    '</body>';
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write(html);
    response.end();
}

var storage = multer.diskStorage({
  destination: './uploads',

  filename: function(request, file, callback) {
    //console.log(request.file);
    callback(null, file.fieldname + '-' + 'fullsize' + path.extname(file.originalname))
  }
});

function upload(response, request) {
    var uploads = multer({storage: storage}).single('newImage')
    uploads(request, response, function() {
    //console.log(request.file)
    });
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write("received image: <br/>")
    response.write('<img src="/:file">')
    response.end();
  }

  function show(response, request) {
    console.log('Request handler show was called.');
    console.log(request.file);
    file = 'newImage-fullsize.png';
    var img = fs.readFileSync(__dirname + '/uploads/' + file);
    console.log(file);
    response.writeHead(200, {'Content-Type': 'image/png'});
    response.end(img, 'binary');
  }
