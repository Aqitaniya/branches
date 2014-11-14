'use strict';

var React = require('react');

var encryptTypes = [
    'application/x-www-form-urlencoded',
    'multipart/form-data',
    'text/plain'
];

var inputTypes = [
    'button',
    'checkbox',
    'color',
    'date', 
    'datetime', 
    'datetime-local', 
    'email', 
    'file',
    'hidden',
    'image',
    'month', 
    'number', 
    'password',
    'radio',
    'range',
    'reset',
    'search',
    'submit',
    'tel',
    'text',
    'time',
    'url',
    'week'
];

var inputValidProps = [
    'accept',
    'alt',
    'autocomplete',
    'autofocus',
    'checked',
    'disabled',
    'form',
    'formaction',
    'formenctype',
    'formmethod',
    'formnovalidate',
    'formtarget',
    'height',
    'list',
    'max',
    'maxlength',
    'min',
    'multiple',
    'name',
    'pattern',
    'placeholder',
    'readonly',
    'required',
    'size',
    'src',
    'step',
    'type',
    'width'
];

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
        'formenctype':      React.PropTypes.oneOf(encryptTypes),
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
        'type':             React.PropTypes.oneOf(inputTypes),
        'value':            React.PropTypes.string,
        'width':            React.PropTypes.string,

        // Component Properties
        'validateWith':     React.PropTypes.func,
        'className':        React.PropTypes.string
    },

    getInitialState: function() {
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
        this.setInputAttributes();
        this._updateValidationState = this.props._updateValidationState;
        this._updateValidationState(this.state.valid, this.props.name);
        this._updateFieldValue = this.props._updateFieldValue;
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
        var value = e.target.value;

        if (e.target.type === 'checkbox') {
            value = e.target.checked;
        };
        
        this._updateFieldValue(this.props.name, value);
        this.revalidateInput(value);
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
            if (inputValidProps.indexOf(prop) !== -1) {
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
        var value = this.props.formData[this.props.name];

        return (
            <input 
                {...this._inputAttributes}
                value={value}
                id={this.props.id} 
                className={classList}
                key={this.props.key}
                onChange={this.onChange}
            ></input>      
        );
    }
});

module.exports = Input;
