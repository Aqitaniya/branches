'use strict';

// Basic RegExp for checking emails
var EMAIL = new RegExp(/\S+@\S+\.\S+/);

// http://code.tutsplus.com/tutorials/8-regular-expressions-you-should-know--net-6149
var PASSWORD = new RegExp(/^[a-z0-9_-]{6,18}$/); 
var USERNAME = new RegExp(/^[a-z0-9_-]{3,16}$/);
var HEX_VALUE = new RegExp(/^#?([a-f0-9]{6}|[a-f0-9]{3})$/);
var SLUG = new RegExp(/^[a-z0-9-]+$/);
var URL = new RegExp(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/);
var IP_ADDRESS = new RegExp(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/);
var HTML_TAG = new RegExp(/^<([a-z]+)([^<]+)*(?:>(.*)<\/\1>|\s+\/>)$/);

var validate = function(regexp) {
    return function(val) {
        return regexp.test(val);
    };
};

module.exports = {
    email: validate(EMAIL),
    password: validate(PASSWORD),
    username: validate(USERNAME),
    hexValue: validate(HEX_VALUE),
    slug: validate(SLUG),
    url: validate(URL),
    ipAddress: validate(IP_ADDRESS),
    htmlTag: validate(HTML_TAG)
};
