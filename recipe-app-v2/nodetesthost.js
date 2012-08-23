var express = require('express'),
    app = express(),
    path = require("path");

app.use("/", express.static(path.resolve(__dirname)));
app.listen(3082);
console.log("Recipe App v2 - Listening on port 3082");

// simply run node nodetesthost.js at the root of this project for lightweight test http server