var express = require("express");
var port = 1200;
var app = express();
var bodyParser = require("body-parser");
var path = require('path');
var fs = require('fs');
var csvWriter = require('csv-write-stream') 
var csv = require('csv-parser');
var filename = 'Reports.csv'


//SETTING
app.use(express.static(path.join(__dirname, './')));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/'));


//start listen port 1200
app.listen(port, function () {
    console.log("server runs on port " + port);

});
app.get('/', function (req, res) {
    res.render('mypage.html')

})

app.post('/CMD', function (req, res) {
    var dat = req.body
    console.log(dat);

    var split = dat.CMD.split(' ')
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

    if(cmd=='Fetch'){
        buf = []
        fs.createReadStream(filename)
        .pipe(csv())
        .on('data', (row) => {
            buf.push(row)
            console.log(row);
        })
        .on('end', (dat) => {
            console.log('CSV file successfully processed');
            console.log(buf) 

            pack.dat = buf
            pack.ACK = true
            res.send(pack)
        });
    }

})
 