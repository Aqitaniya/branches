'use strict';

// Basic RegExp for checking emails
var EMAIL = new RegExp(/\S+@\S+\.\S+/);

// 6 - 30 Characters long, 1 Uppercase, 1 Lowercase, 1 Number
var PASSWORD1 = new RegExp(/^(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z]).{6,30}$/); 

var validate = function(regexp) {
    return function(val) {
        return regexp.test(val);
    };
};

module.exports = {
    email: validate(EMAIL),
    password: validate(PASSWORD1)
};
