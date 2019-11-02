var express = require("express");
var port = 1200;
var app = express();
var bodyParser = require("body-parser");
var path = require('path');
var fs = require('fs');
var csvWriter = require('csv-write-stream') 
var createCsvWriter = require('csv-writer').createArrayCsvWriter;
var csvReader = require('csv-reader');
var csv = require('csv-parser');
var filename = 'Reports.csv'


//SETTING
app.use(express.static(path.join(__dirname, './'))); 
app.use(express.static(path.join(__dirname, './','CSS/'))); 
app.use(express.static(path.join(__dirname,  'CSS/')));
console.log(path.join(__dirname,  'CSS/')) ;
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/')); 
app.use(express.static(__dirname + '/CSS/')); 


//start listen port 1200
app.listen(port, function () {
    console.log("server runs on port " + port);

});
app.get('/', function (req, res) {
    res.render('mypage.html')

}) 
var index=0;
var deleteLine = -1;
var datapack = []
app.post('/CMD', function (req, res) {
    var dat = req.body
    //console.log(dat);

    var split = dat.CMD.split(';')
    var cmd = split[0]

    pack = { ACK: false }
    if (cmd == 'Hello') {
        pack.ACK = true;
        res.send(pack)
        return
    }

    if (cmd == 'Report') {

        var fields = ['Name', 'Latitude', 'Longtitude', 'Possibility', 'Time'];
    
        if (!fs.existsSync(filename))
            writer = csvWriter({ headers: fields });
        else
            writer = csvWriter({ sendHeaders: false });

        writer.pipe(fs.createWriteStream(filename, { flags: 'a' }))
        pack = {}
        for (var i = 0; i < split.length - 1; i++) {
            var name = fields[i]
            if (name == undefined) {
                name = i.toString()
            }
            pack[fields[i]] = split[i + 1]
        }
        
        writer.write(pack)
        pack = {}
        pack.ACK = true
        res.send(pack)
        return

    }

    if(cmd == 'Delete'){
        deleteLine = parseInt(split[1])
        var fields = ['Name', 'Latitude', 'Longtitude', 'Possibility', 'Time'];
        
        var inputStream = fs.createReadStream(filename, 'utf8');

        datapack=[]
        index=0;
        inputStream
        .pipe(csvReader({ parseNumbers: true, parseBooleans: true, trim: true }))
        .on('data', function (row) {
            //console.log('A row arrived: ', row);
            if(index>0){
                datapack.push(row)
            }
            
            index++;

        })
        .on('end', function (data) {
            
            pack=[]
            for(var i=0;i<datapack.length;i++){
                if(i==deleteLine-1) continue
                pack.push(datapack[i])
            }

            var csvWriter = createCsvWriter({
                header:fields,
                path: filename
            });
            csvWriter.writeRecords(pack)       // returns a promise
            .then(() => {
                pack = {}
                pack.ACK = true
                res.send(pack)
            });
        });
    }

    if(cmd=='Fetch'){
        buf = []
        fs.createReadStream(filename)
        .pipe(csv())
        .on('data', (row) => {
            buf.push(row)
            //console.log(row);
        })
        .on('end', (dat) => {
            //console.log('CSV file successfully processed');
            //console.log(buf) 

            pack.dat = buf
            pack.ACK = true
            res.send(pack)
        });
    }

})
 