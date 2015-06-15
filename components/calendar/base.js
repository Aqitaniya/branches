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

class Calendar extends React.Component {

    renderWeekNames() {
        return _.map((day) => {
            return <div className="day">
                {moment().weekday(day).format(this.props.dayHeaderFormat)}
            </div>;
        }, _.range(0, 7));
    }

    renderWeeks(weeks) {
        return _.map(week => <div className="week">
            {this.renderDays(week)}
        </div>, weeks);
    }

    renderDays(days) {
        return _.map((day) => {
            var markers = _.filter(marker => moment(marker.day).isSame(day, 'day'), this.props.markers);

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
            return <Day
                        className={className}
                        day={day}
                        markers={markers}
                        onClick={this.props.onDayClick}
                        onDayMouseEnter={this.props.onDayMouseEnter}
                        onDayMouseLeave={this.props.onDayMouseLeave}
                        renderToolTip={this.props.renderToolTip} />;
        }, days);
    }

    render() {
        var className = `${this.props.className} calendar`;
        var month = getMonthForYear(this.props.month, this.props.year);
        var weeks = $.chunk(7, month);

        return <div {...this.props} className={className}>
            <div className="title">
                <span className="month">
                    {moment().month(this.props.month).format(this.props.monthHeaderFormat)}
                </span>
                <span className="year">
                    {' ' + moment().year(this.props.year).format('YYYY')}
                </span>
            </div>

            <div className="day-of-week">
                {this.renderWeekNames.call(this)}
            </div>

            <div className="weeks">
                {this.renderWeeks(weeks)}
            </div>
        </div>;
    }


}

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
