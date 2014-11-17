'use strict';

var React = require('react');
var SimpleFormShared = require('../mixins/simple_form_shared');

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

var inputValidAttributes = [
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
    mixins: [SimpleFormShared],

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
        'onChange':         React.PropTypes.func,
        'className':        React.PropTypes.string
    },
    
    /**
     * Adds callbacks to `Input` for updating field value
     * and validation state on `Form` and calls `updateValidationState`.
     *
     * @method componentDidMount
     */ 
    componentDidMount: function() {
        this.setAttributes(inputValidAttributes);
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

        // if (e.target.type === 'file') {
        //     value = e.target.files;
        // }
        
        this._updateFieldValue(this.props.name, value);
        this.revalidateSelf(value);
        
        if (this.props.onChange) {
            this.props.onChange(e);
        }
    },
    
    render: function() {
        var classList = this.getClassList();
        var value = this.props.formData[this.props.name];

        return (
            <input 
                {...this._attributes}
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
