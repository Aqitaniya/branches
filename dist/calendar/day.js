'use strict';

var React = require('react');
var moment = require('moment');

var ____Class1=React.Component;for(var ____Class1____Key in ____Class1){if(____Class1.hasOwnProperty(____Class1____Key)){Day[____Class1____Key]=____Class1[____Class1____Key];}}var ____SuperProtoOf____Class1=____Class1===null?null:____Class1.prototype;Day.prototype=Object.create(____SuperProtoOf____Class1);Day.prototype.constructor=Day;Day.__superConstructor__=____Class1;
    function Day(props) {
        ____Class1.call(this,props);
        this.state = { toolTip: false };
    }

    Day.prototype.onClick=function(e) {
        this.props.onClick(this.props.day, this.props.markers, e);
    };

    Day.prototype.onMouseEnter=function() {
        this.setState({
            toolTip: this.props.renderToolTip(this.props.day, this.props.markers)
        });
        this.props.onDayMouseEnter(this.props.day, this.props.markers);
    };

    Day.prototype.onMouseLeave=function() {
        this.setState({ toolTip: false });
        this.props.onDayMouseLeave(this.props.day, this.props.markers);
    };

    Day.prototype.render=function() {
        var className = ("date " + this.props.className);
        var toolTip = (this.state.toolTip) ?  React.createElement("span", {className: "tooltip"}, this.state.toolTip) : false;

        return React.createElement("div", {
                    className: className, 
                    onClick: this.onClick.bind(this), 
                    onMouseEnter: this.onMouseEnter.bind(this), 
                    onMouseLeave: this.onMouseLeave.bind(this)}, 

            React.createElement("span", {className: "date-span"}, this.props.day.date()), 

            toolTip
        );
    };


Day.defaultProps = {
    className: '',
    day: moment(),
    renderToolTip: function() {  }
};

module.exports = Day;

