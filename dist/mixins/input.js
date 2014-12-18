'use strict';
var _ = require('ramda');

var Input = {
    getInitialState: function () {
        return {
            errors: [],
            value: ''
        };
    },

    getDefaultProps: function () {
        return {
            ref: 'input',
            onChange: function () {},
            onBlur: function () {}
        };
    },

    componentWillMount: function () {
        this.validators = [];

        this.props.onChange = _.compose(this.update, this.props.onChange);
        this.props.onBlur = _.compose(this.update, this.props.onBlur);
    },

    componentDidMount: function () {
        // Push validators based on properties
        if (this.props.required) {
            this.validators.push({required: function(value) {
                return value.trim().length > 0
            }});
        }

        if (this.props.equals) {
            var isFn = _.is(Function, this.props.equals);
            var equals = isFn ? this.props.equals : _.eq(this.props.equals);

            this.validators.push({equals: equals});
        }
    },

    checkForErrors: function (value) {
        return _.reduce(function (errors, validator) {
            validator = _.head(_.toPairs(validator));
            var errorType = _.head(validator);
            var foo = _.last(validator);

            if (!foo(value)) { errors.push(errorType); }

            return errors;
        }, [], this.validators);
    },

    update: function (submitted) {
        var value = this.refs.input.getDOMNode().value;
        var newState = {
            value: value,
            errors: this.checkForErrors(value)
        };

        this.setState(newState);

        return newState;
    }
};

module.exports = Input;
