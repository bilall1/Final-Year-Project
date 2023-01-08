const express = require("express");
const bodyParser = require("body-parser");
const e = require("express");
const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));


//Handling get request from the UI input
var to_find = "search";
app.get("/val", function (req, res) {
    res.send(to_find);
});


//Handling Start and end of sessions
var start = 0;
var end = 0;

app.post("/session", (req, res) => {
    res.send("cjdkajldk");

    var keys = Object.keys(req.body);
    var values = keys.toString();
    var obj = JSON.parse(values);

    whichState = "";
    whichState = obj.state;

    console.log("--------------------------------");
    console.log("Current session " + whichState+"s!!!");

    if(whichState=="start"){
        start=1;
    }

    if(whichState=="end"){
        end=1;
    }

});


var Pattern = ""
// Handling request 
app.post("/", (req, res) => {
    res.send("cjdkajldk");

    var keys = Object.keys(req.body);
    var values = keys.toString();
    var obj = JSON.parse(values);

    
    if(start==1 && end==0){

        Pattern += obj.Testing_pattern;
        Pattern += ' ';
        console.log("Tester's Pattern: " + Pattern);
    
    
        fs = require('fs');
        fs.appendFile('Pattern.txt', obj.Testing_pattern + ' ', function (err) {
            if (err) return console.log(err);
        });

    }
    if(end==1){
        Pattern="";
        start=0;
        end=0;
        fs = require('fs');
        fs.appendFile('Pattern.txt', '\n', function (err) {
            if (err) return console.log(err);
        });

    }
    
});

app.post("/val", (req, res) => {
    res.send("cjdkajldk");
    var keys = Object.keys(req.body);
    var values = keys.toString();
    var obj = JSON.parse(values);
    to_find = obj.ok;
});

app.listen(3000, function () {
    console.log("Sever is listning on port 3000");
    console.log("--------------------------------");
    console.log("Live Tracking of Tester: ");
});