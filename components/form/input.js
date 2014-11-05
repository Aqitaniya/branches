'use strict';

var React = require('react');
var utils = require('./utils');

/**
 * Creates a self validating form input that 
 * passes it's value and validation state to 
 * `Form`
 *
 * @class Input 
 */
var Input = React.createClass({
    /**
     * Includes a list of w3 input attributes and 
     * an optional `validateWith` function. NOTE: 
     * className must be passed as a space 
     * seperated string.
     *
     * @param {Object} propTypes 
     */
    propTypes: {
        // Input Attributes
        'accept':           React.PropTypes.string,
        'alt':              React.PropTypes.string,
        'autocomplete':     React.PropTypes.oneOf(['on', 'off']),
        'autofocus':        React.PropTypes.oneOf(['autofocus']),
        'checked':          React.PropTypes.oneOf(['checked']),
        'disabled':         React.PropTypes.oneOf(['disabled']),
        'form':             React.PropTypes.string,
        'formaction':       React.PropTypes.string,
        'formenctype':      React.PropTypes.oneOf(utils.encryptTypes),
        'formmethod':       React.PropTypes.string,
        'formnovalidate':   React.PropTypes.oneOf(['formnovalidate']),
        'formtarget':       React.PropTypes.string,
        'height':           React.PropTypes.string,
        'list':             React.PropTypes.string,
        'max':              React.PropTypes.string,
        'maxlength':        React.PropTypes.string,
        'min':              React.PropTypes.string,
        'multiple':         React.PropTypes.string,
        'name':             React.PropTypes.string.isRequired,
        'pattern':          React.PropTypes.string,
        'placeholder':      React.PropTypes.string,
        'readonly':         React.PropTypes.oneOf(['readonly']),
        'required':         React.PropTypes.oneOf(['required']),
        'size':             React.PropTypes.string,
        'src':              React.PropTypes.string,
        'step':             React.PropTypes.string,
        'type':             React.PropTypes.oneOf(utils.inputTypes),
        'value':            React.PropTypes.string,
        'width':            React.PropTypes.string,

        // Component Properties
        'validateWith':     React.PropTypes.func,
        'className':        React.PropTypes.string
    },

    getInitialState: function() {
        this.setInputAttributes();
        return {
            valid: this.isValid()
        };    
    },
    
    /**
     * Adds callbacks to `Input` for updating field value
     * and validation state on `Form` and calls `updateValidationState`.
     *
     * @method componentDidMount
     */ 
    componentDidMount: function() {
        this._updateValidationState = this.props.updateValidationState;
        this._updateValidationState(this.state.valid, this.props.name);
        this._updateFieldValue = this.props.updateFieldValue;
    },
    
    /**
     * Check to see if the state of validation has changed,
     * if it has, send callback to form with updated 
     * validation state.
     *
     * @method revalidateInput
     */
    revalidateInput: function(value) {
        if (this.state.valid !== this.isValid(value)) {
            this.setState({valid: !this.state.valid});
            this._updateValidationState(this.isValid(value), this.props.name);
        }
    },
    
    /**
     * Checks a fields validation state. If validation state
     * changes then a callback to `Form` is triggered passing
     * the name of the input and the new state.
     *
     * @method onChange
     */
    onChange: function(e) {
        this._updateFieldValue(this.props.name, e.target.value);
        this.revalidateInput(e.target.value);
    },
    
    /**
     * Checks if a field is valid. 
     * - If a validation function is provided the value is tested against it.
     *
     * - If no validation function is provided, but the field is required, a
     *   check will be done to see if there is a value present.
     *
     * - If no validation function is provided and the field is not required
     *   then the field is valid.
     *
     * @method isValid
     * @param {string} val - The value of the input field
     * @return {boolean}
     */
    isValid: function(val) {
        if (this.props.validateWith) {
            return this.props.validateWith(val);         
        } else if(this.props.required === 'required') {
            if (val === undefined || val === null) {
                return false;
            }
            return val.length > 0;
        }
        return true;
    }, 

    /**
     * Sets `_inputAttributes` to an object of 
     * valid w3 input attributes.
     *
     * @method setInputAttributes
     */
    setInputAttributes: function() {
        this._inputAttributes = {};
       
        for(var prop in this.props) {
            if (utils.inputValidProps.indexOf(prop) !== -1) {
                this._inputAttributes[prop] = this.props[prop];
            }          
        } 
    }, 
    
    /**
     * Takes any classes passed in with props and
     * merges them with the class name that matches 
     * the current validation state
     *
     * @method getClassList
     * @return {string} 
     */
    getClassList: function() {
        var classList = [];
        var isValid = this.state.valid ? 'form-field-valid' : 'form-field-invalid';
        
        if (this.props.className) {
            classList = this.props.className.split(' ');
        }

        classList.push(isValid);
        return classList.join(' ');
    },

    render: function() {
        var classList = this.getClassList();

        return (
            <input 
                {...this._inputAttributes}
                id={this.props.id} 
                className={classList}
                onChange={this.onChange}
            ></input>      
        );
    }
});

module.exports = Input;
