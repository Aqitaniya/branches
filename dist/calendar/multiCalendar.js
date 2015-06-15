'use strict';

var React = require('react');
var _ = require('ramda');
var moment = require('moment');
var Calendar = require('./base');


var ____Class2=React.Component;for(var ____Class2____Key in ____Class2){if(____Class2.hasOwnProperty(____Class2____Key)){MultiCalendar[____Class2____Key]=____Class2[____Class2____Key];}}var ____SuperProtoOf____Class2=____Class2===null?null:____Class2.prototype;MultiCalendar.prototype=Object.create(____SuperProtoOf____Class2);MultiCalendar.prototype.constructor=MultiCalendar;MultiCalendar.__superConstructor__=____Class2;

    function MultiCalendar(props) {
        ____Class2.call(this);

        this.state = {
            year: props.year,
            month: props.month
        };
    }

    MultiCalendar.prototype.componentWillReceiveProps=function(nextProps) {
        if (nextProps.year !== this.props.year) {
            this.setState({ year: nextProps.year });
        }

        if (nextProps.month !== this.props.month) {
            this.setState({ month: nextProps.month });
        }
    };

    MultiCalendar.prototype.getCalendars=function(date) {
        var range = _.range(0, this.props.numCalendars);
        return _.map(function(num)  {return date.clone().add(num, 'month');}, range);
    };

    MultiCalendar.prototype.increment=function(direction) {
        var next = moment()
                    .month(this.state.month)
                    .year(this.state.year)
                    .add(direction, 'month');

        if (!this.props.shouldTransitionMonth(next)) { return; }

        this.setState({
            month: next.month(),
            year: next.year()
        });
    };

    MultiCalendar.prototype.render=function() {
        var date = moment()
                    .month(this.state.month)
                    .year(this.state.year);

        var Calendar = this.props.calendarComponent;
        var calendars = this.getCalendars(date)
                                .map(function(calendar)  {return React.createElement(Calendar, React.__spread({}, 
                                                    this.props, 
                                                    {month: calendar.month(), 
                                                    year: calendar.year()}));}.bind(this));

        var canGoBack = this.props.shouldTransitionMonth(date.clone().add(-1, 'month'));
        var canGoForward = this.props.shouldTransitionMonth(date.clone().add(1, 'month'));
        var classNames = ("multiple-month-calendar " + this.props.className);

        return React.createElement("div", {className: classNames}, 
            React.createElement("div", {
                className: ("previous " + (!canGoBack ? 'disabled' : 'enabled')), 
                onClick: this.increment.bind(this, -1)}), 

            React.createElement("div", {
                className: ("next " + (!canGoForward ? 'disabled' : 'enabled')), 
                onClick: this.increment.bind(this, 1)}), 

            React.createElement("div", {className: "calendar-row"}, 
                calendars
            )
        );
    };



MultiCalendar.defaultProps = {
    className: '',

    numCalendars: 1,

    month: moment().month(),
    year: moment().year(),

    // Whenever the calendar tries to change months, allow the user
    // to decide if it is available or not
    shouldTransitionMonth: _.always(true),

    calendarComponent: Calendar
};

module.exports = MultiCalendar;
