'use strict';

var React = require('react');
var SimpleFormShared = require('../mixins/simple_form_shared');

var textareaValidAttributes = [
    'autofocus',
    'cols',
    'disabled',
    'form',
    'maxlength',
    'name',
    'placeholder',
    'readonly',
    'required',
    'rows',
    'wrap'
];

/**
 * @class Textarea
 */
var Textarea = React.createClass({displayName: 'Textarea',
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
        'autofocus':        React.PropTypes.oneOf(['autofocus']),
        'cols':             React.PropTypes.string,
        'disabled':         React.PropTypes.oneOf(['disabled']),
        'form':             React.PropTypes.string,
        'maxlength':        React.PropTypes.string,
        'name':             React.PropTypes.string.isRequired,
        'placeholder':      React.PropTypes.string,
        'readonly':         React.PropTypes.oneOf(['readonly']),
        'required':         React.PropTypes.oneOf(['required']),
        'rows':             React.PropTypes.string,
        'wrap':             React.PropTypes.oneOf(['hard', 'soft']),

        // Component Properties
        'validateWith':     React.PropTypes.func,
        'className':        React.PropTypes.string
    },

    componentDidMount: function() {
        this.setAttributes(textareaValidAttributes);
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
        this._updateFieldValue(this.props.name, value);
        this.revalidateSelf(value);
    },

    render: function() {
        var classList = this.getClassList();
        var value = this.props.formData[this.props.name];

        return (
            React.createElement("textarea", React.__spread({},  
                this._attributes, 
                {value: value, 
                id: this.props.id, 
                className: classList, 
                key: this.props.key, 
                onChange: this.onChange
            }))      
        );
    }

});

module.exports = Textarea;
