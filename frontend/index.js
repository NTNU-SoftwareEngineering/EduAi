import express from 'express';

let app = express();

app.use(express.static('www'));

let server = app.listen(8081, function () {
    let host = server.address().address;
    let port = server.address().port;

    console.log("Express listening at http://%s:%s", host, port);
});
