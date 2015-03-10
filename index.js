var eejs       = require('ep_etherpad-lite/node/eejs/'),
    padManager = require('ep_etherpad-lite/node/db/PadManager'),
    ERR        = require('ep_etherpad-lite/node_modules/async-stacktrace'),
    async      = require('ep_etherpad-lite/node_modules/async');
var blankPads = {};
async.waterfall([
    function(callback){
        padManager.listAllPads(callback)
    },
    function(data, callback) {
        for (var pad in data.padIDs) {
            padManager.getPad(data.padIDs[pad], function(err, data) {
                if (data.getHeadRevisionNumber() == 0) {
                    blankPads[data.id] = 1;
                } else {
                    delete blankPads[data.id];
                }
            });
        }
        callback(null, data.padIDs.length);
    }
]);
exports.registerRoute = function (hook_name, args, cb) {
    args.app.get('/stats.json', function(req, res) {
        var pads = [];
        var data = [];
        async.waterfall([
            function(callback){
                padManager.listAllPads(callback)
            },
            function(data, callback) {
                for (var pad in data.padIDs) {
                    padManager.getPad(data.padIDs[pad], function(err, data) {
                        if (data.getHeadRevisionNumber() == 0) {
                            blankPads[data.id] = 1;
                        } else {
                            delete blankPads[data.id];
                        }
                    });
                }
                callback(null, data.padIDs.length);
            },
            function(data, callback) {
                var timestamp = (new Date).getTime() / 1000 | 0;
                res.setHeader('Content-Type', 'application/json');
                res.send('{"timestamp": '+timestamp+', "padsCount": '+data+', "blankPads": '+Object.keys(blankPads).length+'}');
                callback();
            }
        ]);
    });
};
