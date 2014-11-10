/*!
 * cbhelper.js
 * Call back helper to wait to run a callback after multiple asynchronous functions
 * 
 */

var idd = 0;
Function.prototype.multiCb = function() {
    var count = 0;
    var already_ran = false;
    var callback = this;
    var data = {};
    var runCheck;
    var id = idd++;
    var object;
    object = function(name) {
        clearTimeout(runCheck);
        count++;
        if(object.log) object.log({
            event: 'new_task',
            name: name,
            taskCount: count,
            already_ran: already_ran
        });
        return function() {
            count--;
            if(object.log) object.log({
                event: 'task_done',
                taskCount: count,
                name: name,
                already_ran: already_ran
            });
            if(name) {
                data[name] = arguments;
            }
            if(count === 0) {
                clearTimeout(runCheck);
                runCheck = setTimeout(function() {
                    if(already_ran)
                        return;
                    else
                        already_ran = true;
                    callback(data);                    
                }, 100);
            }
        };
    };

    object.timeout = function(ms) {
        setTimeout(function() {
            if(already_ran)
                return;
            else
                already_ran = true;
            callback(data, { error: 'timeout' });
        }, ms);
    };

    return object;
    
};

if(typeof Array.prototype.asyncSerialEach === 'undefined') {
    Object.defineProperty(Array.prototype, 'asyncSerialEach', {
        value: function(iterator, callback) {
            var len = this.length;
            var self = this;
            var cb_data = [];
            var step = function(i) {
                if(i >= len) {
                    return callback(cb_data);
                }
                iterator(self[i], function() {
                    cb_data.push(arguments);
                    step(i+1);
                }, i);
            };
            step(0);
        },
        enumerable: false
    });
}


var firstPerform = function(loopFn) {

    var logger = false;
    
    var actions;
    actions = {

        log: function(logfn) {
            logger = logfn;
            return actions;
        },

        
        
        then: function(finalFn) {
            var iterator = finalFn.multiCb();
            if(logger) iterator.log = logger;
            return loopFn(iterator);
        },

        seriesWithArray: function(array) {
            return {
                then: function(callback) {
                    array.asyncSerialEach(loopFn, function(cb_data) {
                        if(callback) callback(cb_data);
                    });
                }
            };
        }
        
    };

    return actions;
    
};