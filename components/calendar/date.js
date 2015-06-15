'use strict';

var React = require('react');
var $ = require('../helpers/ramdaExtras');
var FormatedInput = require('./formattedinput');
var moment = require('moment');
var _ = require('ramda');

var validLength = function(value) {
    if (value.length !== 10) {
        return 'Not a valid date format. Please enter your date in the format MM/DD/YYYY.';
    }
};

var validMonth = function(value) {
    var num = parseInt(value.substring(0, 2));
    if (num < 1 || num > 12) {
        return 'Not a valid month.';
    }
};

var validDay = function(value) {
    var num = parseInt(value.substring(2, 4));
    if (num < 1 || num > 31) {
        return 'Not a valid day.';
    }
};

var validYear = function(value) {
    var num = parseInt(value.substring(4, 8));
    var now = parseInt(moment().format('YYYY'));
    if (num < now) {
        return 'Not a valid year.';
    }
};

var format = function(value) {
    value = value || '';

    return _.reject($.isEmpty, [
        value.substring(0, 2),
        value.substring(2, 4),
        value.substring(4, 8)
    ]).join('/');
};


var deformat = function(value) {
    return value
       .replace(/[^0-9.]/g, '')
       .substring(0, 8);
};

var DateInput = React.createClass({

    getInitialState: function() {
        return {
            validators: [ validLength, validMonth, validDay, validYear ]
        };
    },

    serialize: function() {
        return this.refs.input.serialize();
    },

    render: function() {
        return <FormatedInput
                {...this.props}
                ref="input"
                type="text"
                format={format}
                deformat={deformat} />;
    }

});

module.exports = DateInput;
