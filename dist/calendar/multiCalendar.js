'use strict';

var React = require('react');
var _ = require('ramda');
var moment = require('moment');
var Calendar = require('./base');


class MultiCalendar extends React.Component {

    constructor(props) {
        super();

        this.state = {
            year: props.year,
            month: props.month
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.year !== this.props.year) {
            this.setState({ year: nextProps.year });
        }

        if (nextProps.month !== this.props.month) {
            this.setState({ month: nextProps.month });
        }
    }

    getCalendars(date) {
        var range = _.range(0, this.props.numCalendars);
        return _.map((num) => date.clone().add(num, 'month'), range);
    }

    increment(direction) {
        var next = moment()
                    .month(this.state.month)
                    .year(this.state.year)
                    .add(direction, 'month');

        if (!this.props.shouldTransitionMonth(next)) { return; }

        this.setState({
            month: next.month(),
            year: next.year()
        });
    }

    render() {
        var date = moment()
                    .month(this.state.month)
                    .year(this.state.year);

        var Calendar = this.props.calendarComponent;
        var calendars = this.getCalendars(date)
                                .map((calendar) => React.createElement(Calendar, React.__spread({}, 
                                                    this.props, 
                                                    {month: calendar.month(), 
                                                    year: calendar.year()})));

        var canGoBack = this.props.shouldTransitionMonth(date.clone().add(-1, 'month'));
        var canGoForward = this.props.shouldTransitionMonth(date.clone().add(1, 'month'));
        var classNames = `multiple-month-calendar ${this.props.className}`;

        return React.createElement("div", {className: classNames}, 
            React.createElement("div", {
                className: `previous ${!canGoBack ? 'disabled' : 'enabled'}`, 
                onClick: this.increment.bind(this, -1)}), 

            React.createElement("div", {
                className: `next ${!canGoForward ? 'disabled' : 'enabled'}`, 
                onClick: this.increment.bind(this, 1)}), 

            React.createElement("div", {className: "calendar-row"}, 
                calendars
            )
        );
    }

}

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
