// =============================================================================
// LIBRARIES
// =============================================================================
var React = require('react');
var NoScroll = require('./mixins/noscroll');


// =============================================================================
// LIGHTBOX MIXIN
// =============================================================================
var Mixin = {
    getInitialState: function() {
        return {
            _lightbox: false
        };
    },

    _lightboxOnClose: function(close/*, arguments */) {
        this.setState({_lightbox: false});

        var args = [].slice.call(arguments, 1);
        if (close) {
            close.apply(this, args);
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
            var close = this._lightboxOnClose.bind(this, lightbox.close);

            return <Lightbox {...lightbox} close={close} />
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
        close: React.PropTypes.func,
        overlayClick: React.PropTypes.func
    },

    // Fill in the blanks of our api
    getDefaultProps: function() {
        return {
            className: '',
            close: function() {},
            overlayClick: function() {}
        };
    },

    componentWillMount: function() {
        if (this.props.onClose) {
            cosnole.warn('Lightbox onClose will be depricated, please use close instead');
        }
    },

    close: function() {
        var close = this.props.onClose || this.props.close;
        close();
    },

    render: function() {
        var View = this.props.view;

        var classes = 'lightbox ' + this.props.className;

        var containers = 'lightbox-container ';
        if (this.props.className.length) {
            containers += this.props.className+'-container';
        }

        var props = _.omit(['className'], this.props);

        return (
            <div className={containers}>
                <div className={classes}>
                    <div className="lightbox-body">
                        <View ref="view" {...props} onClose={this.close} close={this.close} />
                    </div>
                </div>

                <div className="overlay" onClick={this.overlayClick}></div>
            </div>
        );
    }
});


// =============================================================================
// EXPORTS
// =============================================================================
module.exports = Lightbox;

