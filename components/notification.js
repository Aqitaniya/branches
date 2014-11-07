// =============================================================================
// LIBRARIES
// =============================================================================
var React = require('react');
var _ = require('ramda');
// =============================================================================
// NOTIFICATION COMPONENT
// =============================================================================
var Notification = React.createClass({
    // -------------------------------------------------------------------------
    // Initial State
    // -------------------------------------------------------------------------
    /**
     * We keep a reference to the timeout so that it can be cleared in cases
     * where the notification is not solely dismissable from a timeout, e.g.
     * user clicks the notification, dismissing it, before the timeout can
     * dismiss it.
     *
     * @return {Object} initialState explictly allocating _timeout
     */
    getInitialState: function() {
        return {
            _timeout: undefined
        };
    },

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
        var timeout;

        if (this.props.timeout) {
            timeout = setTimeout(this.dismiss, this.props.timeout);
            this.setState({_timeout: timeout});
        }
    },

    /**
     * Changes to state will not trigger a rerender. The reference to the
     * timeout function in inconsequential to its layout. So don't do anything
     * with it.
     *
     * @param newProps the new properties of the compontent
     * @param newState the new state of the component
     * @return true iff props are different.
     */
    shouldComponentUpdate: function (newProps, newState) {
        // State changes will not rerender the view
        return this.props.id !== newProps.id;
    },

    // -----------------------------------------------------------------------
    // Public
    // ----------------------------------------------------=------------------
    statics: {
        /**
         * Convience method to create the component. Because who likes
         * really long HTML in their javascript.
         *
         * @param props The properties you wish to create this object with
         * @return a JSX representation of the properities
         */
        create: function (props) {
            return <Notification {...props} />
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

        clearTimeout(this.state._timeout);
        this.setState({_timeout: undefined});

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
            <div className={this.getClassList()} onClick={this.acknowledge}>
                <p>{this.props.message}</p>
                {this.props.showClose ? <span onClick={this.dismiss} className="close">Close</span> : ''}
            </div>
        );
    }
});

// =============================================================================
// EXPORTS
// =============================================================================
module.exports = Notification;

