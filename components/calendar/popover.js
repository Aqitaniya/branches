'use strict';

var React = require('react');
var Tether = require('tether');

var Popover = React.createClass({
    displayName: 'Popover',

    componentWillMount: function() {
        this.setState({
            visible: true
        });

        this._popoverElement = document.createElement('span');
        document.querySelector('body').appendChild(this._popoverElement);

        this._popoverUnderlayElement = document.createElement('span');
        document.querySelector('body').appendChild(this._popoverUnderlayElement);
    },

    componentDidMount: function() {
        this._renderPopover();
    },

    componentDidUpdate: function() {
        this._renderPopover();
    },

    _handleUnderlayClick: function() {
        this.props.onClose();
    },

    _popoverComponent: function() {
        var className = `${this.props.className} popover`;
        return <div className={className}>{this.props.children}</div>;
    },

    _popoverUnderlayComponent: function() {
        return <div onClick={this._handleUnderlayClick}
                    className="popover-underlay"></div>;
    },

    _tetherOptions: function() {
        return {
            element: this._popoverElement,
            target: this.getDOMNode().parentElement,
            attachment: 'top left',
            targetAttachment: 'bottom left',
            targetOffset: '10px 0',
            classPrefix: 'popover',
            classes: {
                element: 'popover-tether-element'
            },
            optimizations: {
                moveElement: false // always moves to <body> anyway!
            }
        };
    },

    _renderPopover: function() {
        React.render(this._popoverUnderlayComponent(), this._popoverUnderlayElement);
        React.render(this._popoverComponent(), this._popoverElement);

        if (this._tether) {
            this._tether.setOptions(this._tetherOptions());
        }
        else if (window && document) {
            this._tether = new Tether(this._tetherOptions());
        }
    },

    componentWillUnmount: function() {
        this._tether.destroy();
        React.unmountComponentAtNode(this._popoverElement);
        React.unmountComponentAtNode(this._popoverUnderlayElement);

        if (this._popoverElement.parentNode) {
            this._popoverElement.parentNode.removeChild(this._popoverElement);
        }

        if (this._popoverUnderlayElement.parentNode) {
            this._popoverUnderlayElement.parentNode.removeChild(
                this._popoverUnderlayElement);
        }
    },

    render: function() {
        return <span/>;
    }
});

module.exports = Popover;
