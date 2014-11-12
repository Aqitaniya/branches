'use strict';

var React = require('react');

var Submit = React.createClass({
    
    render: function() {
        var value = this.props.value || 'Submit';
        var disabled = this.props.formIsValid ? '' : 'disabled';
        
        return (
            <input type="submit" value={value} disabled={disabled}/>        
        );
    }
});

module.exports = Submit;
