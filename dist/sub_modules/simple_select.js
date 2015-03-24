'use strict';

var React = require('react');
var SimpleFormShared = require('../mixins/simple_form_shared');

var selectValidAttributes = [
    'autofocus',
    'disabled',
    'form',
    'multiple',
    'name',
    'required',
    'size'
];

/**
 * @class Select
 */
var Select = React.createClass({displayName: "Select",
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
        'disabled':         React.PropTypes.oneOf(['disabled']),
        'form':             React.PropTypes.string,
        'multiple':         React.PropTypes.string,
        'name':             React.PropTypes.string.isRequired,
        'required':         React.PropTypes.oneOf(['required']),
        'size':             React.PropTypes.string,

        // Component Properties
        'validateWith':     React.PropTypes.func,
        'className':        React.PropTypes.string
    },

    componentDidMount: function() {
        this.setAttributes(selectValidAttributes);
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

        return (
            React.createElement("select", React.__spread({},  
                this._attributes, 
                {id: this.props.id, 
                className: classList, 
                key: this.props.key, 
                onChange: this.onChange
            }), 
                this.props.children
            )      
        );
    }
});

module.exports = Select;
