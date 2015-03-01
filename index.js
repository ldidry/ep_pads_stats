var eejs       = require('ep_etherpad-lite/node/eejs/'),
    padManager = require('ep_etherpad-lite/node/db/PadManager'),
    ERR        = require("ep_etherpad-lite/node_modules/async-stacktrace"),
    async      = require('ep_etherpad-lite/node_modules/async');
exports.registerRoute = function (hook_name, args, cb) {
    args.app.get('/stats.json', function(req, res) {
        var pads = [];
        var data = [];
        async.waterfall([
            function(callback){
                padManager.listAllPads(callback)
            },
            function(data, callback){
                var timestamp = (new Date).getTime(),
                    padsCount = data.padIDs.length;
                res.send('{ timestamp: '+timestamp+', padsCount: '+padsCount+' }');
                callback();
            }
        ]);
    });
};
