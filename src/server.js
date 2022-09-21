const http = require('http'); // http module
const url = require('url'); // url module
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const jsonUrlStruct = {
    GET: {
        notFound: jsonHandler.notFound,
        '/getUsers': jsonHandler.getData,
        '/notReal': jsonHandler.badRequestHandler,
        '/': htmlHandler.getIndex,
        '/style.css': htmlHandler.getCSS,
    },
    HEAD: {
        notFound: jsonHandler.notFoundMeta,
        '/getUsers': jsonHandler.getDataMeta,
        '/notReal': jsonHandler.badRequestHandlerMeta,
        '/': jsonHandler.getData,
    },
};

// function to handle requests
// eslint-disable-next-line consistent-return
const onRequest = (request, response) => {
    const parsedUrl = url.parse(request.url);

    if (!jsonUrlStruct[request.method]) {
        return jsonUrlStruct.HEAD.notFound(request, response);
    }
    if (jsonUrlStruct[request.method][parsedUrl.pathname]) {
        jsonUrlStruct[request.method][parsedUrl.pathname](request, response);
    } else {
        jsonUrlStruct[request.method].notFound(request, response);
    }
};

// start server
http.createServer(onRequest).listen(port, () => {
    console.log(`Listening on 127.0.0.1: ${port}`);
});
