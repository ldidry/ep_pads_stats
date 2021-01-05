var API        = require('ep_etherpad-lite/node/db/API'),
    async      = require('ep_etherpad-lite/node_modules/async');

var epVersion = parseFloat(require('ep_etherpad-lite/package.json').version);
var usePromises = epVersion >= 1.8
var getRevisionsCount

if (usePromises) {
  getRevisionsCount = callbackify1(API.getRevisionsCount)
  listAllPads = callbackify0(API.listAllPads)
} else {
  getRevisionsCount = API.getRevisionsCount
  listAllPads = API.listAllPads
}

// What about a little cache variable :-)
var blankPads = {};
var q = async.queue(function (pad, cb) {
    if (blankPads[pad] === undefined) {
        getRevisionsCount(pad, cb);
    } else {
        cb && cb();
    }
}, 10);

// We need to update the cache on some events
exports.padLoad = function (hook_name, context, cb) {
    var pad = context.pad;
    if (pad.head === 0) {
        blankPads[pad.id] = 1;
    } else {
        if (blankPads[pad.id] !== undefined) {
            delete blankPads[pad.id];
        }
    }
    cb && cb();
}
exports.padRemove = function (hook_name, context, cb) {
    var padId = context.padID;
    if (blankPads[padId] !== undefined) {
        delete blankPads[padId];
    }
    cb && cb();
}
exports.padUpdate = function (hook_name, context, cb) {
    var pad = context.pad;
    if (pad.head === 0) {
        blankPads[pad.id] = 1;
    } else {
        if (blankPads[pad.id] !== undefined) {
            delete blankPads[pad.id];
        }
    }
    cb && cb();
}

// At startup
exports.registerRoute = function (hook_name, args, cb) {
    // Let's fill the blankPads var
    listAllPads(function(err, data) {
        async.each(data.padIDs, function(pad, cb) {
            q.push(pad, cb);
        });
    });
    // Answer to the route
    args.app.get('/stats.json', function(req, res) {
        listAllPads(function(err, data) {
            var timestamp = (new Date).getTime() / 1000 | 0;
            res.setHeader('Content-Type', 'application/json');
            res.send('{"timestamp": '+timestamp+', "padsCount": '+data.padIDs.length+', "blankPads": '+Object.keys(blankPads).length+'}');
        });
    });
    cb && cb();
};

function wrapPromise (p, cb) {
  return p.then(function (result) { cb(null, result); })
    .catch(function(err) { cb(err); });
}

function callbackify1 (fun) {
  return function (arg1, cb) {
    return wrapPromise(fun(arg1), cb);
  };
};

function callbackify0 (fun) {
  return function (cb) {
    return wrapPromise(fun(), cb);
  };
};
