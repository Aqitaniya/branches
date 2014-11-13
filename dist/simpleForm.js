'use strict';

var React = require('react/addons');

var encryptTypes = [
    'application/x-www-form-urlencoded',
    'multipart/form-data',
    'text/plain'
];

var formValidProps = [
    'accept-charset',
    'action',
    'autocomplete',
    'encrypt',
    'method',
    'name',
    'novalidate',
    'target'
];

/**
 * Creates a self validating form that 
 * manages it's values
 *
 * @class Form
 */
var Form = React.createClass({displayName: 'Form',
    /**
     * Includes a list of w3 form attributes
     *
     * @param {Object} propTypes
     */
    propTypes: {
        'accept-charset': React.PropTypes.string,
        'action':         React.PropTypes.string,
        'autocomplete':   React.PropTypes.oneOf(['on', 'off']),
        'encrypt':        React.PropTypes.oneOf(encryptTypes),
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
        return {
            fields: {},
            valid: false,
            data: {}
        }; 
    },

    componentWillMount: function() {
        this._children = this.registerChildren(this);
        this.setFormAttributes();
    },
    
    /** 
     * Recursive method that clones each 
     * child attaching callbacks on `Form`
     * specific inputs
     *
     * @method registerNestedChildren
     */
    registerChildren: function(element) {
        var children = React.Children.map(element.props.children, function(child, index) {
            if (this.validFormChild(child)) {
                return this.attachCallbacks(child, index);
            } else if (this.hasChildren(child)) {
                return this.registerChildren(child);
            } else {
                return child;
            }
        }.bind(this));
     
        return element === this ? children : React.addons.cloneWithProps(element, {
            children: children
        });
    },

    hasChildren: function(child) {
        return typeof child.props.children === 'object';
    },

    /**
     * Helper method to check if an
     * input is a valid `Form` input
     *
     * @method validFormChild
     * @return boolean
     */
    validFormChild: function(child) {
        return child.type && child.type.displayName === 'Input'; 
    },
    
    /**
     * Helper method that returns a
     * cloned version of a child with
     * it's key attached
     *
     * @method cloneWithKey
     */
    cloneWithKey: function(klass, index) {
        return React.addons.cloneWithProps(klass, {
            key: index
        });
    },
    
    /**
     * Helper method that attaches 
     * callbacks and a key to a `Form`
     * input
     *
     * @method attachCallbacks
     */
    attachCallbacks: function(child, index) {
        return React.addons.cloneWithProps(child, {
            _updateFieldValue : this._updateFieldValue,
            _updateValidationState : this._updateValidationState,
            key: index
        });
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
            if (formValidProps.indexOf(prop) !== -1) {
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
    _updateValidationState: function(valid, name) {
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
    _updateFieldValue: function(name, value) {
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
        return ( 
            React.createElement("form", React.__spread({},  this._formAttributes, {onSubmit: this.onSubmit}), 
                this._children
            )
        );
    }
});

module.exports = {
    Form: Form,
    Input: require('./input'),
    Validate: require('./validations')
};
