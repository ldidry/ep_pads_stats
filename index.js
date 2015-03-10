var eejs       = require('ep_etherpad-lite/node/eejs/'),
    padManager = require('ep_etherpad-lite/node/db/PadManager'),
    API        = require('ep_etherpad-lite/node/db/API'),
    ERR        = require('ep_etherpad-lite/node_modules/async-stacktrace'),
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
                var timestamp = (new Date).getTime() / 1000 | 0,
                    padsCount = data.padIDs.length,
                    blankPads = 0;
                    for (var pad in data.padIDs) {
                        API.getRevisionsCount(data.padIDs[pad], function(err, data) {
                            if (data.revisions == 0) {
                                blankPads++;
                            }
                        });
                    }
                res.setHeader('Content-Type', 'application/json');
                res.send('{"timestamp": '+timestamp+', "padsCount": '+padsCount+', "blankPads": '+blankPads+'}');
                callback();
            }
        ]);
    });
};
