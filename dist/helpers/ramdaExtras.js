'use strict';

var _ = require('ramda');
var accounting = require('accounting');
var moment = require('moment');

module.exports = {};


/**
 * objRemoveEmpty
 *
 * @param {Object} obj An object to filter over
 * @return {Object} The object without Nil or Empty strings / arrays
 */
module.exports.objRemoveEmpty = _.compose(
    _.fromPairs,
    _.reject(function($__0 ) {var key=$__0[0],value=$__0[1]; return _.isNil(value) || !value.length; }),
    _.toPairs
);


/**
 * objRemoveNil
 *
 * @param {Object} obj An object to filter over
 * @return {Object} The object without Nil or Empty strings / arrays
 */
module.exports.objRemoveNil = _.compose(
    _.fromPairs,
    _.reject(function($__0 ) {var key=$__0[0],value=$__0[1];
        return _.isNil(value) ||
                (_.is(String, value) && !value.length) ||
                (_.is(Array, value) && !value.length);
    }),
    _.toPairs
);

/**
 * maybe
 *
 * @param {Boolean} pred A truthy variable to decide wether or not to show the val
 * @param {Anything} val This gets returned based on the predicate
 * @return {val || undefined}
 */
module.exports.maybe = function(pred, value) {
    return pred ? value : null;
};


/**
 * execute
 *
 * @param {Function || Anything} func A value to either execute or return
 * @param {args} args A list of arguments for the possible function
 * @return {Anything} Whatever func returns or ececutes and returns
 */
module.exports.execute = function(func /* ...args */) {
    var args = [].slice.call(arguments, 1);
    return _.is(Function, func) ? func.apply(null, args) : func;
};


/**
 * isStringOrNumber
 *
 * @param {String} val A value to test
 * @return {Boolean} A boolean to indicate if the value is a string or number
 */
module.exports.isStringOrNumber = function(val) {
    return _.is(String, val) || _.is(Number, val);
};


/**
 * toRegExp
 *
 * @param {String || Number} val A value to convert to a regexp
 * @return {RegExp} A regexp
 */
module.exports.toRegExp = _.curry(function(options, val) {
    return new RegExp(''+val, options);
});


/**
 * isEmpty
 *
 * @param {Array || String} list A list like object
 * @return {Boolean}
 */
module.exports.isEmpty = function(list) {
    return !list.length;
};


/**
 * stringToRegExps
 *
 * @param {String} strDelimiter The delimiter for the string
 * @param {String} regOptions Options for the regular expressions
 * @param {String} str A delimted string
 * @return {Array[RegExp]} An array of regular expressions
 */
module.exports.stringToRegExps = _.curry(function(strDelimiter, regOptions, str) {
    return _.compose(
        _.map(module.exports.toRegExp(regOptions)),
        _.reject(module.exports.isEmpty),
        _.split(strDelimiter)
    )(str);
});


/**
 * objToString
 *
 * This function ignores Nils and maps objects to strings
 *
 * @param {String} strDelimiter The delimiter for the string
 * @return {String} An array of regular expressions
 */
module.exports.objToString = function(obj) {

    var ts = function(x) { return x.toString(); };

    return _.compose(
        _.join(' '),
        _.map(ts),
        _.reject(_.isNil),
        _.values
    )(obj);
};


/**
 * guid
 *
 * Generates a randome GUID
 *
 * @return {String} A random GUID string
 */
module.exports.guid = function() {
    return '' + Math.random() * 10000000000000000;
};


/**
 * formatPhone
 *
 * @param {String} str A string phone number
 * @return {String} A fromated phone number
 */
module.exports.formatPhone = function(val) {
    if (!val) { return ''; }

    var number = val.replace(/\D/g, '');
    number = number.slice(0, 10);
    var area = number.substr(0, 3);
    var pre = number.substr(3, 3);
    var post = number.substr(6, 4);

    if (number.length === 0) {
        return '';
    } else if (number.length < 4) {
        return ("(" + area);
    } else if (number.length < 7) {
        return ("(" + area + ") " + pre);
    } else {
        return ("(" + area + ") " + pre + "-" + post);
    }
};

/**
 * deformatPhone
 *
 * @param {String} str A string phone number
 * @return {String} A fromated phone number
 */
module.exports.deformatPhone = function(str) {
    return ('' + str).replace(/[^0-9]+/g, '');
};


/**
 * formatCurrency
 *
 * EXPECTS CURENCY IN CENTS
 *
 * @param {String} str A string number in cents
 * @return {String} A fromated currency number
 */
module.exports.formatCurrency = function(str) {
    return accounting.formatMoney(str, {
        symbol: "$",
        precision: 2,
        thousand: ",",
        format: {
            pos : "%s%v",
            neg : "-%s%v",
            zero: "%s%v"
        }
    });
};


/**
 * deformatCurrency
 *
 * EXPECTS CURRENCY IN DOLLARS
 *
 * @param {Sring} str A string number (cents or dolars)
 * @return {String} A deformated currency number in cents
 */
module.exports.deformatCurrency = function(str) {
    str = '' + (str || '');
    return str.replace(/[^0-9-.]+/g, '');
};

/**
 * Rename key in object
 *
 * @param {Sring} keyString string of key to rename
 * @param {Sring} newKeyString string to replace key with
 * @param {Object} js object wished to modify
 * @return {Object} js onject with renamed key
 */
module.exports.renameKey = function(keyString, newKeyString, obj) {
    var hasKey = _.has(keyString);
    if (hasKey(obj)) {
        obj[newKeyString] = obj[keyString];
        delete obj[keyString];
    }
    return obj;
};



/**
 * Rename keys in object
 *
 * @param {Object} key value map of keys to new keys
 * @param {Object} src object wished to modify
 * @return {Object} js onject with renamed key
 */
module.exports.renameKeys = _.curry(function(renameMap, src) {

    var rename = module.exports.renameKey;

    var kvPairs = _.toPairs(renameMap);

   return _.reduce(function(memo, kvPair) {
        return rename(kvPair[0], kvPair[1], memo);
    }, src, kvPairs);
});



/**
 * getExpiryDate
 *
 * @param {String} expiryString The expiry string '0814'
 * @return {moment(Date)} A moment wrapped date object
 */
module.exports.getExpiryDate = function(expiryString) {
    var month = parseInt(expiryString.substring(0, 2), 10) - 1;
    var year = parseInt(expiryString.substring(2), 10);
    // Since expiry date is only the last 2 digits of year and moment
    // expects 4 digits, make sure to supply moment with the rest
    return moment().month(month).year(("20" + year));
};


/**
 * capFirst
 *
 * @param {Sring} str A string to capitilize the first letter
 * @return {String} The formated string
 */
module.exports.capFirst = function(str) {
    str = '' + (str || '');
    if (!str.length) { return; }
    return str.substring(0, 1).toUpperCase() + str.substring(1);
};


/**
 * isExpiryOld
 *
 * @param {String} expiryString The expiry string '0814'
 * @return {Boolean} If the expiry date is old
 */
module.exports.isExpiryOld = function(expiryString) {
    var expiry = module.exports.getExpiryDate(expiryString);
    var now = moment().month(moment().month()).year(moment().year());
    return moment(now).isAfter(expiry);
};

/**
 * toLower
 *
 * @param {Sring} str A string to format
 * @return {String} The formated string
 */
module.exports.toLower = function(str) {
    str = '' + (str || '');
    return str.toLowerCase();
};


/**
 * formatZip
 *
 * @param {Sring} str A string to format
 * @return {String} The formated string
 */
module.exports.formatZip = function(val) {
    if (!val) { return ''; }

    var number = val.replace(/\D/g, '');

    var standard = number.slice(0, 5);
    var extended = number.slice(5, 9);

    if (number.length === 0) {
        return '';
    } else if (number.length < 6) {
        return (standard);
    } else {
        return (standard + "-" + extended);
    }
};

/**
 * deformatZip
 *
 * @param {Sring} str A string to format
 * @return {String} The formated string
 */
module.exports.deformatZip = function(str) {
    if (!str) { return ''; }
    return _.replace(/\D/g, '', str);
};

/**
 * formatNumeric
 *
 * @param {Sring} str A string to format
 * @return {String} The formated string
 */
module.exports.formatNumeric = function(str) {
    if (!str) { return ''; }
    return _.replace(/\D/g, '', str);
};


/**
 * formatNumeric
 *
 * @param {Sring} url A string to format
 * @return {null}
 */
module.exports.openNewTab = function (url) {
    var win = window.open(url, '_blank');
    win.focus();
};

/**
 * List customer's services
 *
 * @param {Object} service summary details
 * @return {Object} list of services
 */
module.exports.getServices = function (serviceSummaryDetails) {

    var services = _.compose(
            _.keys,
            _.groupBy(_.prop('serviceType')),
            _.defaultTo([])
        )(serviceSummaryDetails);

    return services;
};

/**
 * List Active customer's services
 *
 * @param {Object} service summary details
 * @return {Object} list of services
 */
module.exports.getActiveServices = function (serviceSummaryDetails) {

    var services = _.compose(
            _.keys,
            _.groupBy(_.prop('serviceType')),
            _.filter(function(obj)  { return obj.status === 'Active'; }),
            _.defaultTo([])
        )(serviceSummaryDetails);

    return services;
};

module.exports.log = function(a) {
    // jshint undef: false
    console.log(a);
    return a;
};


/**
 * List Active customer's services
 *
 * @param {Array[String]} The list of property names to make lenses for
 * @return {Object} The namespaced lenses
 */
module.exports.makeLenses = _.reduce(function(memo, prop) {
    return _.merge(
        memo,
        _.createMapEnty(prop, _.lensProp(prop))
    );
}, {});


/**
 * Check if a date falls within a range of dates
 *
 * @param {Date} fromDate The start date
 * @param {Date} toDate The end date
 * @param {Date} date The date in question
 * @return {Boolean} If the date lies within the range
 */
module.exports.isInRange = _.curry(function(fromDate, toDate, date) {
    var isBefore = moment(fromDate).isAfter(date);
    var isAfter = moment(toDate).isBefore(date);
    return !(isBefore || isAfter);
});



/**
 * chunk
 *
 * Takes in a chunk size and array and returns an array of arrays
 *
 * @param {Number} chunkSize The lenght of the sub-arrays
 * @param {Array} array The array to chunk
 * @return {Array[Array]} The nested array of arrays
 */
module.exports.chunk = _.curry(function(chunkSize, array) {
    var chunkStart, chunkStop;
    var retArray = [];

    for (var i=0; i < array.length/chunkSize; ++i) {
        chunkStart = i * chunkSize;
        chunkStop = chunkStart + chunkSize;

        retArray.push(array.slice(chunkStart, chunkStop));
    }

    return retArray;
});
