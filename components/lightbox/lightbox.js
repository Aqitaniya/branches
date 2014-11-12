// =============================================================================
// LIBRARIES
// =============================================================================
var React = require('react');
var NoScroll = require('../noscroll');


// =============================================================================
// LIGHTBOX MIXIN
// =============================================================================
var Mixin = {
    getInitialState: function() {
        return {
            _lightbox: false
        };
    },

    _lightboxOnClose: function(onClose/*, arguments */) {
        this.setState({_lightbox: false});

        var args = [].slice.call(arguments, 1);
        if (onClose) {
            onClose.apply(this, args);
        }
    },

    lightboxFactory: function(options) {
        return function() {
            this.setState({_lightbox: options});
        }.bind(this);
    },

    lightboxCreate: function(options) {
        this.setState({_lightbox: options});
    },

    renderLightbox: function() {
        var lightbox = this.state._lightbox;

        if (lightbox) {
            var onClose = this._lightboxOnClose.bind(this, lightbox.onClose);

            return <Lightbox {...lightbox} onClose={onClose} />
        }
    }
};


// =============================================================================
// LIGHTBOX COMPONENT
// =============================================================================
var Lightbox = React.createClass({

    mixins: [NoScroll],

    statics: {
        mixin: Mixin
    },

    // Define our API
    propTypes: {
        // Transfered props
        className: React.PropTypes.string,
        // Custom
        //view: React.PropTypes.element.isRequired,
        // Callbacks
        onClose: React.PropTypes.func
    },

    // Fill in the blanks of our api
    getDefaultProps: function() {
        return {
            className: '',
            onClose: function() {}
        };
    },

    close: function() {
        this.props.onClose();
    },

    render: function() {
        var View = this.props.view;

        var classes = 'lightbox ' + this.props.className;

        var containers = 'lightbox-container ';
        if (this.props.className.length) {
            containers += ' '
        }


        return (
            <div className={containers}>
                <div className={classes}>
                    <div className="lightbox-body">
                        <View ref="view" onClose={this.props.onClose} />
                    </div>
                </div>

                <div className="overlay" onClick={this.close}></div>
            </div>
        );
    }
});


// =============================================================================
// EXPORTS
// =============================================================================
module.exports = Lightbox;

