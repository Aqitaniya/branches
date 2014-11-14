// =============================================================================
// LIBRARIES
// =============================================================================
var React = require('react');
var NoScroll = require('./mixins/noscroll');


// =============================================================================
// HELPERS
// =============================================================================
var maybe = function(predicate, result) {
   if (!predicate) { return null; }

   if (typeof predicate === "function") {
       return predicate() ? result : null;
   }

   return predicate ? result : null;
};


// =============================================================================
// ALERT MIXIN
// =============================================================================
var Mixin = {
    getInitialState: function() {
        return {
            _alert: false
        };
    },

    _alertOnClose: function(onClose) {
        this.setState({
            _alert: false
        });

        if (onClose) {
            onClose.apply(this, [].slice.call(arguments, 1));
        }
    },

    alertFactory: function(options) {
        var self = this;
        return function() {
            return self.alertCreate(options);
        };
    },

    alertCreate: function(options) {
        this.setState({ _alert: options });
    },

    renderAlert: function() {
        var options = this.state._alert;

        if (options) {
            var onClose = this._alertOnClose.bind(this, options.onClose);

            return (React.createElement(Alert, React.__spread({},  options, {onClose: onClose})));
        }
    }
};


// =============================================================================
// ALERT COMPONENT
// =============================================================================
var Alert = React.createClass({displayName: 'Alert',
    mixins: [NoScroll],

    statics: {
        mixin: Mixin
    },

    // Define our API
    propTypes: {
        // Transfered props
        className: React.PropTypes.string,
        // Custom
        title: React.PropTypes.string,
        message: React.PropTypes.string,
        buttons: React.PropTypes.object,
        // Callbacks
        onClose: React.PropTypes.func,
        onSuccess: React.PropTypes.func,
        onFail: React.PropTypes.func
    },

    // Fill in the blanks of our api
    getDefaultProps: function() {
        return {
            className: '',
            buttons: {no: 'No', yes: 'Yes'},
            onSuccess: function() {},
            onFail: function() {},
            onClose: function() {}
        };
    },

    buttonClick: function(button) {
        if (button === 'no') {
            this.props.onFail();
        } else {
            this.props.onSuccess(button);
        }

        this.props.onClose(button);
    },

    renderButtons: function() {
        var DOM = [];
        var buttons = this.props.buttons;

        for (var key in buttons) {
            if (buttons.hasOwnProperty(key)) {
                DOM.push(
                    React.createElement("span", {
                        key: key, 
                        className: key, 
                        onClick: this.buttonClick.bind(this, key)}, 
                        buttons[key]
                    )
                );
            }
        }

        return DOM;
    },

    render: function() {
        return (
            React.createElement("div", {className: "alert-container"}, 
                React.createElement("div", {className: "alert"}, 
                    React.createElement("div", {className: "alert-body"}, 
                        maybe(this.props.title, React.createElement("h1", null, this.props.title)), 
                        maybe(this.props.message, React.createElement("p", null, this.props.message))
                    ), 

                    React.createElement("div", {className: "button-container"}, 
                        this.renderButtons()
                    )
                )
            )
        );
    }
});


// =============================================================================
// EXPORTS
// =============================================================================
module.exports = Alert;

