'use strict';

var React = require('react');
var utils = require('./form/utils');

/**
 * Creates a self validating form that 
 * manages it's values
 *
 * @class Form
 */
var Form = React.createClass({
    /**
     * Includes a list of w3 form attributes
     *
     * @param {Object} propTypes
     */
    propTypes: {
        'accept-charset': React.PropTypes.string,
        'action':         React.PropTypes.string,
        'autocomplete':   React.PropTypes.oneOf(['on', 'off']),
        'encrypt':        React.PropTypes.oneOf(utils.encryptTypes),
        'method':         React.PropTypes.string,
        'name':           React.PropTypes.string,
        'novalidate':     React.PropTypes.oneOf(['novalidate']),
        'target':         React.PropTypes.string,
        'onSubmit':       React.PropTypes.func
    },
    
    getDefaultProps: function() {
        return {
            // Required if user does not supply
            'onSubmit': function(){}
        };
    },
    
    getInitialState: function() {
        this.registerChildFields();
        this.setFormAttributes();
        return {
            fields: {},
            valid: false,
            data: {}
        }; 
    },
    
    /**
     * Adds callback properties to children 
     * classes to manage validation state and
     * field values.
     *
     * @method registerChildFields
     */
    registerChildFields: function() {
        React.Children.forEach(this.props.children, function(child) {
            child.props.updateValidationState = this.updateValidationState;
            child.props.updateFieldValue = this.updateFieldValue;
        }.bind(this));
    },
    
    /**
     * Sets `_fromAttributes` to an object of 
     * valid w3 form arttibutes.
     *
     * @method setFormAttributes
     */ 
    setFormAttributes: function() {
        this._formAttributes = {};

        for(var prop in this.props) {
            if (utils.formValidProps.indexOf(prop) !== -1) {
                this._formAttributes[prop] = this.props[prop];
            }     
        } 
    },
    
    /**
     * Callback placed on each child responsible for 
     * updating `Form`'s validation state.
     *
     * @method updateValidationState
     */
    updateValidationState: function(valid, name) {
        var fields = this.state.fields;
        fields[name] = valid;
        this.setState({fields: fields});
        this.validateForm();
    },
    
    /**
     * Callback placed on each child responsible
     * for maintaining field values of `Form`. 
     *
     * @method updateFieldValue
     */
    updateFieldValue: function(name, value) {
        var data = this.state.data;
        data[name] = value;
        this.setState({data: data});
    },

    /**
     * Updates `Form`'s validation state
     * by itterating through all the fields
     * and checking their state. 
     *
     * @method validateForm
     */
    validateForm: function() {
        var valid = true;
        var fields = this.state.fields;
    
        for(var field in fields) {
            if(fields[field] === false) {
                valid = false;
            }
        } 
        this.setState({valid: valid});
    },
    
    /**
     * Passes onSubmit function of form
     * to props `onSubmit` with the event 
     * and data from form. 
     *
     * @method onSubmit
     */ 
    onSubmit: function(e) {
        this.props.onSubmit(e, this.state.data);
    },

    render: function() {
        var submitValue = this.props.submitValue || 'Submit',
            disabled = this.state.valid ? '' : 'disabled';

        return ( 
            <form {...this._formAttributes} onSubmit={this.onSubmit}>
                {this.props.children}
                <input 
                    type="submit" 
                    value={submitValue}
                    disabled={disabled}
                ></input>
            </form>
        );
    }
});

module.exports = {
    Form: Form,
    Input: require('./form/input'),
    Validate: require('./form/validations')
};
