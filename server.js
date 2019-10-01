var express = require("express");
var port = 1200;
var app = express();
var bodyParser = require("body-parser"); 
var path = require('path'); 


//SETTING
app.use(express.static(path.join(__dirname, './')));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//start listen port 1200
app.listen(port, function () {
    console.log("server runs on port " + port);

});
app.get('/', function (req, res) {
    console.log("root");
    res.render('mypage.html')

})

app.post('/LoadFeature', function (req, res) {
    var dat = req.body
    if (dat['cmd'] == 'Fetch All Data') {
        pack={}
        pack["allFeatures"]=dataSet.allFeatures
        pack["allProducts"]=dataSet.allProducts
        pack['featureGroup']=config.FeatureGroup
        pack['featureUnit']=config.FeatureUnit
      
        res.send(pack)  
    }
       
}) 