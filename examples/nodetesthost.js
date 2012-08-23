var express = require('express'),
    app = express(),
    path = require("path");

app.use("/", express.static(path.resolve(__dirname)));
app.listen(3080);
console.log("Examples - Listening on port 3080");

// simply run node nodetesthost.js at the root of this project for lightweight test http server