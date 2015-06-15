'use strict';

var React = require('react');
var _ = require('ramda');
var moment = require('moment');
var Day = require('./day');
var $ = require('../helpers/ramdaExtras');


/**
 * getMonthForYear
 *
 * This function will return all CALENDAR days in a month. This includes
 * padding for the previous and next month
 *
 * @param {String} targetMonth The index of the month (from moment) of the month
 * @param {String} targetYear The year
 * @return {Array[moment]} The array of moments representing all the dates in the month
 */
function getMonthForYear(targetMonth, targetYear) {
    var target = moment().month(targetMonth).year(targetYear);

    var start = target.clone().startOf('month').startOf('week');
    var end = target.clone().endOf('month').endOf('week');

    var month = [];
    var day = start.clone();

    while(day.isBefore(end)) {
        month.push(day.clone());
        day.add(1, 'day');
    }

    return month;
}

var ____Class0=React.Component;for(var ____Class0____Key in ____Class0){if(____Class0.hasOwnProperty(____Class0____Key)){Calendar[____Class0____Key]=____Class0[____Class0____Key];}}var ____SuperProtoOf____Class0=____Class0===null?null:____Class0.prototype;Calendar.prototype=Object.create(____SuperProtoOf____Class0);Calendar.prototype.constructor=Calendar;Calendar.__superConstructor__=____Class0;function Calendar(){if(____Class0!==null){____Class0.apply(this,arguments);}}

    Calendar.prototype.renderWeekNames=function() {
        return _.map(function(day)  {
            return React.createElement("div", {className: "day"}, 
                moment().weekday(day).format(this.props.dayHeaderFormat)
            );
        }.bind(this), _.range(0, 7));
    };

    Calendar.prototype.renderWeeks=function(weeks) {
        return _.map(function(week)  {return React.createElement("div", {className: "week"}, 
            this.renderDays(week)
        );}.bind(this), weeks);
    };

    Calendar.prototype.renderDays=function(days) {
        return _.map(function(day)  {
            var markers = _.filter(function(marker)  {return moment(marker.day).isSame(day, 'day');}, this.props.markers);

            // Boil down all the markers' classNames into one string
            var className = _.compose(
                _.join(' '),
                _.uniq,
                _.map(_.trim),
                _.split(' '),
                _.join(' '),
                _.pluck('className')
            )(markers);

            if (this.props.month === day.month()) {
                className += ' currentMonth';
            }

            if (day.dayOfYear() === moment().dayOfYear() && day.year() === moment().year()) {
                className += ' currentDay';
            } else if (day.isBefore(moment())) {
                className += ' older';
            } else if (day.isAfter(moment())) {
                className += ' newer';
            }

            // Render the day
            return React.createElement(Day, {
                        className: className, 
                        day: day, 
                        markers: markers, 
                        onClick: this.props.onDayClick, 
                        onDayMouseEnter: this.props.onDayMouseEnter, 
                        onDayMouseLeave: this.props.onDayMouseLeave, 
                        renderToolTip: this.props.renderToolTip});
        }.bind(this), days);
    };

    Calendar.prototype.render=function() {
        var className = (this.props.className + " calendar");
        var month = getMonthForYear(this.props.month, this.props.year);
        var weeks = $.chunk(7, month);

        return React.createElement("div", React.__spread({},  this.props, {className: className}), 
            React.createElement("div", {className: "title"}, 
                React.createElement("span", {className: "month"}, 
                    moment().month(this.props.month).format(this.props.monthHeaderFormat)
                ), 
                React.createElement("span", {className: "year"}, 
                    ' ' + moment().year(this.props.year).format('YYYY')
                )
            ), 

            React.createElement("div", {className: "day-of-week"}, 
                this.renderWeekNames.call(this)
            ), 

            React.createElement("div", {className: "weeks"}, 
                this.renderWeeks(weeks)
            )
        );
    };




// Give our component some default properties so we can
// avoid doing null checks
Calendar.defaultProps = {
    className: '',

    month: moment().month(),
    year: moment().year(),

    markers: [],

    renderToolTip: function() {  },

    onDayClick: function() {  },

    onDayMouseEnter: function() {  },
    onDayMouseLeave: function() {  },

    dayHeaderFormat: 'dd',
    monthHeaderFormat: 'MMMM'
};



/**
 * Marker
 *
 * A marker can contain any amount of data. They only require className
 * and day to function. All other properties can be used in your onClick
 * and renderTooltip callbacks
 *
 * @param {Object} day A moment or string represneting the day
 * @param {String} className Any classes you want to apply to the day
 */
var MarkerShape = React.PropTypes.shape({
    day: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.object
    ]),
    className: React.PropTypes.string
});

Calendar.propTypes = {
    markers: React.PropTypes.arrayOf(MarkerShape)
};


module.exports = Calendar;
