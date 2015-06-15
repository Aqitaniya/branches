'use strict';

var React = require('react');
var _ = require('ramda');

var Input = React.createClass({displayName: 'Input',

    propTypes: {
        type: React.PropTypes.string.isRequired
    },

    getDefaultProps: function() {
        return {
            // NB: If you set clearable = true, you must provide an onChange
            // or else your form will not be notified of the change
            clearable: false,
            onChange: _.identity,

            validators: [],
            className: '',
            errors: [],
            format: _.identity,
            deformat: _.identity
        };
    },

    getInitialState: function() {
        return {
            validators: _.concat(this.props.validators, (this.validators || [])),
            value: this.props.value || this.props.defaultValue
        };
    },

    componentWillReceiveProps: function(nextProps) {
        if (_.has('value', nextProps)) {
            this.setState({
                value: nextProps.value,
            });
        }
    },

    isActive: function() {
        return !!(this.serialize() || '').length;
    },

    serialize: function() {
        if (this.props.type === 'checkbox') {
            return this.refs.input.getDOMNode().checked;
        }

        return this.props.deformat(this.refs.input.getDOMNode().value);

    },

    onChange: function() {
        if (this.props.disabled) { return; }

        this.setState({
            value: this.serialize()
        });

        // Notify any parents we changed
        this.props.onChange(this.serialize());
    },

    clearValue: function() {
        if (this.props.disabled) { return; }

        if (this.props.type === 'checkbox') {
            this.refs.input.getDOMNode().checked = false;
        }

        this.refs.input.getDOMNode().value = this.props.format('');
        this.onChange();
    },

    render: function() {
        var className = `input-container ${this.props.className} ${this.props.errors.length ? 'error' : ''}`;

        var clear;
        if (this.props.clearable && this.state.value && !this.props.disabled && this.props.type === 'text') {
            clear = React.createElement("span", {
                        className: "clear", 
                        onMouseDown: this.clearValue, 
                        onClick: this.clearValue, 
                        dangerouslySetInnerHTML: { __html: '&times;'}});
        }

        return React.createElement("div", {className: className}, 
            clear, 
            React.createElement("input", React.__spread({}, 
                this.props, 
                {value: this.props.format(this.state.value), 
                checked: this.props.checked || this.state.value, 
                onChange: this.onChange, 
                className: "", 
                ref: "input"}))
        );
    }

});

module.exports = Input;
