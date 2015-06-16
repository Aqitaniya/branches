'use strict';

var React = require('react');
var R = require('ramda');
var { flux } = require('flux');

/**
 * Wrapper for stores and creates a 'store component'
 * Used to limit the usage of mixins (taken out in ES6)
 *
 * @function StoreWatchWrapper
 * @author Kevin Welcher
 */ 
var StoreWatchWrapper = function(stores, getStateFromStores, Component) {

    var keys = R.keys(Component.prototype.constructor);
    var ComponentProps = R.pick(keys, Component.prototype.constructor);
    var statics = R.omit(['getDefaultProps', 'displayName', 'contextTypes', 'propTypes', 'defaultProps'], ComponentProps);

    /**
     * @class StoreWatchComponent
     */ 
    var StoreWatchComponent = React.createClass(R.merge(ComponentProps, {

        statics: statics,

        componentDidMount: function() {
            R.forEach((store) => {
                flux.store(store).on('change', this.setStateFromStores);
            }, stores);
        },

        componentWillUnmount: function() {
            R.forEach(store => {
                flux.store(store).removeListener('change', this.setStateFromStores);
            }, stores);
        },

        getInitialState: function() {
            return getStateFromStores.call(this);
        },

        setStateFromStores: function() {
            this.setState(getStateFromStores.call(this));
        },

        render: function() {
            return <Component {...this.props} {...this.state} />;
        }
    }));

    return StoreWatchComponent;
};

module.exports = StoreWatchWrapper;

