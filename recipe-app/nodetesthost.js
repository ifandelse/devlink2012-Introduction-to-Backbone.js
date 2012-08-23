var express = require('express'),
    app = express(),
    path = require("path");

app.use("/", express.static(path.resolve(__dirname)));
app.listen(3081);
console.log("Recipe App v1 - Listening on port 3081");

// simply run node nodetesthost.js at the root of this project for lightweight test http server