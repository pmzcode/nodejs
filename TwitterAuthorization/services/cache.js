const config = require('../config');
var cache = [];
module.exports = {
    set: (req, data) => {
        var date = new Date();
        var isHas = false;
        var cacheObj =
        {
            url: req.baseUrl,
            method: req.method,
            data: data,
            expiration: date.setSeconds(date.getSeconds() + config.cacheTime)
        };
        for(var i = 0;i<cache.length;i++){
            if(cache[i].method == cacheObj.method && cache[i].url == cacheObj.url){
                isHas = true;
            }
        }
        if(!isHas) cache.push(cacheObj);
    }
    ,
    get: (req) => {
        var date = new Date();
        var cacheObj =
        {
            url: req.originalUrl,
            method: req.method,
            expiration: date.getTime()
        };
        for(var i = 0;i<cache.length;i++){
            if(cache[i].method == cacheObj.method && cache[i].url == cacheObj.url){
                if(cache[i].expiration >= cacheObj.expiration){
                    return cache[i].data
                }
                else {
                    cache.splice(i,1);
                    i--;
                }
            }
        }
    }
};