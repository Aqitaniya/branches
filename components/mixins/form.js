'use strict';
var _ = require('ramda');

var FormMixin = {
    componentWillMount: function () {
        if (this.onSubmit) {
            this.onSubmit = _.compose(this.onSubmit, this.serialize);
        }
    },

    serialize: function (event) {
        event.preventDefault();

        var data = _.reduce(function (memo, ref) {
            var inputName = _.head(ref);
            var data = _.last(ref).update(true);

            if (data.errors.length) {
                memo.valid = false;
                memo.errors[inputName] = data.errors;
            }

            memo.formData[inputName] = data.value;

            return memo;
        }, {valid: true, formData: {}, errors: {}}, _.toPairs(this.refs));

        return data;
    }
};

module.exports = Form;
