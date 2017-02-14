const config = require('../config');
const fs = require('fs');
module.exports = (req, res, next) => {
    res.locals.trace = {
        date: new Date().toLocaleString(),
        url: req.url,
        body: req.body,
        cookies: req.cookies
    };

    console.log(res.locals.trace.date);
    console.log(res.locals.trace.url);
    console.log(res.locals.trace.body);
    console.log();
        var lastLogFile = getLastLogFile();
        if (lastLogFile) {
            if (!checkOverFlow(lastLogFile)) {
                var logFile = fs.readFile(config.log.root + lastLogFile, (err, result)=> {
                        if (err) {
                            throw err;
                        }
                        if (result.length > 0) {
                            var logsArray = [];
                            try {
                                for (var i = 0; i < JSON.parse(result).length; i++)
                                    logsArray.push(JSON.parse(result)[i]);
                            }
                             catch (err){
                            console.log(err);
                            }
                            logsArray.push(res.locals.trace);
                            fs.writeFile(config.log.root + lastLogFile, JSON.stringify(logsArray))
                        }
                        else
                            fs.writeFile(config.log.root + lastLogFile, JSON.stringify(res.locals.trace))
                    }
                )
            }
            else {
                var logNumber = parseInt(lastLogFile.substring(0, lastLogFile.indexOf("."))) + 1;
                fs.writeFile(config.log.root + logNumber + config.log.format, JSON.stringify(res.locals.trace));
            }
        }
        else
            fs.writeFile(config.log.root + config.log.defaultName + config.log.format, JSON.stringify([res.locals.trace]));
        function getLastLogFile() {
            var dir = config.log.root;
            var files = fs.readdirSync(dir);
            files.sort((a, b)=> {
                    return fs.statSync(dir + a).mtime.getTime() - fs.statSync(dir + b).mtime.getTime()
                }
            );
            return files.length > 0 ? files[files.length - 1] : null;
        }

        function checkOverFlow(lastLogFile) {
            var logSize = config.log.logSize;
            var stats = fs.statSync(config.log.root + lastLogFile);
            var fileSize = stats["size"] / 1000;
            return fileSize > logSize;
        }
    next();
};
