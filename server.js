const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.send(`<html><body><h1>Hello from Softwareplus ${process.env.BUILD_NUMBER || 'local'}</h1></body></html>`);
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});