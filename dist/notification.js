// =============================================================================
// LIBRARIES
// =============================================================================
var React = require('react');
var _ = require('ramda');
// =============================================================================
// NOTIFICATION COMPONENT
// =============================================================================
var Notification = React.createClass({displayName: 'Notification',
    // -------------------------------------------------------------------------
    // Initial State
    // -------------------------------------------------------------------------
    // How do I doc this up
    propTypes: {
        // ~ Required .........................................................
        message: React.PropTypes.string.isRequired,

        // ~ Optional ........................................................
        type: React.PropTypes.oneOf(['info', 'warn', 'error']),
        showClose: React.PropTypes.bool,
        timeout: React.PropTypes.number,
        onAcknowledge: React.PropTypes.func,
        onDismissed: React.PropTypes.func,
        dismissesOnClick: React.PropTypes.bool,
    },

    getDefaultProps: function() {
        return {
            type: 'info',
            timeout: undefined,
            showClose: false,
            dismissesOnClick: false,
            onAcknowledged: function () {},
            onDismissed: function () {}
        };
    },

    // ------------------------------------------------------------------------
    // Lifecycle Methods
    // ------------------------------------------------------------------------
    /**
     * Starts off a timeout that will dismiss the notification if necessary.
     *
     * @method componentDidMount
     */
    componentDidMount: function () {
        if (this.props.timeout) {
            this.timeout = setTimeout(this.dismiss, this.props.timeout);
        }
    },

    // -----------------------------------------------------------------------
    // Public
    // -----------------------------------------------------------------------
    statics: {
        /**
         * Convienence method to create the component. Because who likes
         * really long HTML in their javascript.
         *
         * @param props The properties you wish to create this object with
         * @return a JSX representation of the properities
         */
        create: function (props) {
            return React.createElement(Notification, React.__spread({},  props))
        }
    },

    // ------------------------------------------------------------------------
    // Interactions
    // ------------------------------------------------------------------------
    /**
     * Runs the on acknowleged callback when the notification is clicked aka
     * acknowledge.
     *
     * If the notification is dismissable once clicked, it will also call
     * this dismiss function.
     *
     * Why don't I name this onClick... eh. I like verbs.
     */
    acknowledge: function () {
        this.props.onAcknowledged();
    },

    /**
     * Runs the onDismissed callback if one is specified in props.
     * Also behaves nicely and clears out an existing timeouts.
     *
     * Notice the once trickery. Because a notification can forseeably
     * only be dismissed once, make it so. Use _.once keeps whether
     * or not the Notification is dismissed off of state. Which is nice!
     */
    dismiss: _.once(function (event) {
        if (event) {
            event.stopPropagation();
            event.nativeEvent.stopImmediatePropagation();
        }

        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = undefined;
        }

        this.props.onDismissed();
    }),

    // ------------------------------------------------------------------------
    // Rendering
    // ------------------------------------------------------------------------
    /**
     * @return the type of notifcation.. with notifcation. Strictly for styling.
     */
    getClassList: function () {
        return [this.props.type, 'notification'].join(" ");
    },

    render: function() {
        return (
            React.createElement("div", {className: this.getClassList(), onClick: this.acknowledge}, 
                React.createElement("p", null, this.props.message), 
                this.props.showClose ? React.createElement("span", {onClick: this.dismiss, className: "close"}, "Close") : ''
            )
        );
    }
});

// =============================================================================
// EXPORTS
// =============================================================================
module.exports = Notification;

