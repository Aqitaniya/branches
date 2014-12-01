"use strict";

/**
 * For children we want to maintain their onMouseEnter handler's if they are
 * set. Using this function will ensure that both handlers get called.
 *
 * TODO: See if this will leak memory. But I don't think it should
 */

// =============================================================================
// TOOLTIP MIXIN
// ============================================================================
var Mixin = {
    /** By using this mixin showTooltip will be set to true when it is determined
     * that the tooltip should be shown.
     *
     * It's up to the mixer to render its content accordingly.
     */
    getInitialState: function () {
        return {
            showTooltip: false
        };
    },

    /**
     * Because a tooltip can have multiple children. We need to bind handlers
     * to the appropriate child that is tooltipped.
     */
    componentWillMount: function () {
        this._bindChildToolTipHandlers(this.props.children);
    },

    // Being a tooltip doesn't get any easier than this.
    onMouseEnter: function () {
        this.setState({showToolTip: true});
    },

    // No, seriously it doesn't.
    onMouseLeave: function () {
        this.setState({showToolTip: false});
    },

    /**
     * Adds the apporpriate events handlers qualify something as a tooltip.
     * Essentially it just copies over the onMouseEnter and onMouseLeave defined in this
     * Mixin. It will also combines with any similar handlers, preserving mouseover behaviours if
     * set.
     */
    _addToolTipEvents: function (childCount, child) {
        // Given two functions foo, and bar, return a function that both foo and bar if bar
        // is defined.
        var merge = function (foo, bar) {
            if (bar) {
                return function () {
                    foo.apply(this, arguments);
                    bar.apply(this, arguments);
                }.bind(this);
            }

            return foo;
        };

        // Only copy over event for the first and only child, or the specified tooltipped
        // child.
        if (child.props.tooltipped || childCount === 1) {
            if (this._tooltipped) {
                console.warn('A tooltipped child was already found for this component');
            } else {
                child = this._tooltipped = React.addons.cloneWithProps(child, {
                    onMouseEnter: merge(this.onMouseEnter, child.props.onMouseEnter),
                    onMouseLeave: merge(this.onMouseLeave, child.props.onMouseLeave)
                });
            }
        }

        return child;
    },

    /**
     * Binds tooltip handlers on the first child, or the specified child with property `tooltipped`
     * in the case of multiple children.
     *
     * @return true iff the child's handlers were successfully created
     */
    _bindChildToolTipHandlers: function () {
        var childCount = React.Children.count(this.props.children);
        var createToolTip = this._addToolTipEvents.bind(this, childCount);

        if (childCount === 0) {
            console.warn('A tooltip must be created with at least one child');
            return false;
        }

        this.props.children = React.Children.map(this.props.children, createToolTip);

        if (!this._tooltipped) {
            console.warn('Component with multiple children must specify a component with tooltipped prop');
            return false;
        }

        delete this._tooltipped;
        return true;
    }

};

// =======================================================================================================
// TOOLTIP COMPONENT
// ======================================================================================================
var ToolTip = React.createClass({
    mixins: [Mixin],

    statics: {
        /**
         * A More intricate Component can mix this in using Tooltip.Mixin
         */
        mixin: Mixin,

        /**
         * @param {Object} The properties the ToolTip will be created with
         * @param {Child} The Child Component the ToolTip will wrap.
         *
         * @return a ToolTip component.
         */
        wrap: function (props, child) {
            child = React.addons.cloneWithProps(child, {
                tooltipped: true
            });

            if (typeof props === 'string') {
                props = {message: props};
            }

            return ( <ToolTip {...props}>{child}</ToolTip> );
        }
    },

    propType: {
        // ~ Required Properties ..........................................
        message: React.PropTypes.oneOf([
            React.PropTypes.String,
            React.PropTypes.Element
        ]).isRequired,

        // ~ Optional Propeties ...........................................
        containerClass: React.PropTypes.string,
        messageClass: React.PropTypes.string
    },

    getDefaultProps: function () {
        return {
            containerClass: 'tooltip-container',
            messageClass: 'tooltip'
        };
    },

    render: function () {
        return (
            <div className={this.props.containerClass}>
                {this.props.children}
                {this.state.showToolTip ? this.renderMessage(): false}
            </div>
        );
    },

    renderMessage: function () {
        if (typeof this.props.message === 'string') {
            return <p className={this.props.messageClass}>{this.props.message}</p>;
        } else {
            return this.props.message;
        }
    }
});

module.exports = ToolTip;
