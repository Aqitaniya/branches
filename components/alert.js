// =============================================================================
// LIBRARIES
// =============================================================================
var React = require('react');


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
        var onClose = this._alertOnClose.bind(this, options.onClose);

        this.setState({
            _alert: <Alert {...options} onClose={onClose} />
        });
    }
};


// =============================================================================
// ALERT COMPONENT
// =============================================================================
var Alert = React.createClass({
    // Define our API
    propTypes: {
        // Transfered props
        className: React.PropTypes.string,
        // Custom
        title: React.PropTypes.string,
        text: React.PropTypes.string,
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
                    <span
                        key={key}
                        className={key}
                        onClick={this.buttonClick.bind(this, key)}>
                        {buttons[key]}
                    </span>
                );
            }
        }

        return DOM;
    },

    render: function() {
        return (
            <div className="alert-container">
                <div className="alert">
                    <div className="alert-body">
                        {maybe(this.props.title, <h1>{this.props.title}</h1>)}
                        {maybe(this.props.text, <p>{this.props.text}</p>)}
                    </div>

                    <div className="button-container">
                        {this.renderButtons()}
                    </div>
                </div>
            </div>
        );
    }
});


// =============================================================================
// EXPORTS
// =============================================================================
module.exports = {
    mixin: Mixin,
    component: Alert
};

