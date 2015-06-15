'use strict';

var React = require('react');
var _ = require('ramda');
var moment = require('moment');
var MultiCalendar = require('./multiCalendar');
var DateInput = require('./date');
var Popover = require('./popover');
var { maybe } = require('../helpers/ramdaExtras');

var DatePicker = React.createClass({displayName: 'DatePicker',

    getDefaultProps: function() {
        return {
            className: '',
            placeholderText: 'MM/DD/YYYY',
            dateFormat: 'MM/DD/YYYY',
            validators: [],
            errors: [],
            onChange: _.identity,
            calendar: MultiCalendar
        };
    },

    getInitialState: function() {
        var selected = this.props.selected || this.props.defaultSelected;
        var defaultValue = selected.format('MMDDYYYY');

        return {
            selected: selected ? moment(selected) : '',
            defaultValue: defaultValue,
            value: defaultValue,
            focus: false
        };
    },

    componentWillReceiveProps: function(nextProps) {
        if (!_.has('selected', nextProps)) { return; }

        this.setState({
            selected: nextProps.selected ? moment(nextProps.selected) : ''
        });
    },

    serialize: function() {
        return this.state.selected ?
               this.state.selected.format(this.props.dateFormat) :
               null;
    },

    handleFocus: function() {
        this.setState({
            focus: true
        });
    },

    hideCalendar: function() {
        setTimeout(() => {
            this.setState({
                focus: false
            });
        }, 0);
    },

    onChange: function(selected) {
        this.hideCalendar();

        if (this.props.disabled) { return; }

        var value;

        if (selected._isAMomentObject) {
            value = selected.format('MMDDYYYY');
        } else {
            value = selected;
            selected = moment(selected, 'MMDDYYYY');
        }

        if (selected.isBefore(this.props.minDate)) {
            return;
        }

        if (this.props.maxDate && selected.isAfter(this.props.maxDate)) {
            return;
        }

        setTimeout(() => {
            this.props.onChange(selected);
            this.setState({
                selected: selected,
                value: value
            });
        }, 0);
    },

    clearValue: function() {
        this.onChange('');
    },

    onKeyDown: function (e) {
        if (e.key === 'Tab' || e.key === 'Escape') {
            this.hideCalendar();
        }
    },

    onMouseEnter: function(day) {
        setTimeout(() => {
            this.setState({
                selected: day,
                value: day.format('MMDDYYYY')
            });
        }, 0);
    },

    render: function() {
        var className = `
            ${this.props.className}
            ${this.props.errors.length ? 'error' : ''}
            ${this.props.disabled ? 'disabled' : ''}
            datepicker-container
        `;

        var clear;
        if (this.state.selected && !this.props.disabled) {
            clear = React.createElement("span", {
                    className: "clear", 
                    onMouseDown: this.clearValue, 
                    onClick: this.clearValue, 
                    dangerouslySetInnerHTML: { __html: '&times;'}});
        }
        var Calendar = this.props.calendar;

        return React.createElement("div", {className: className, onKeyDown: this.onKeyDown}, 
            clear, 
            React.createElement("i", {className: "fa fa-calendar", onClick: this.handleFocus}), 
            React.createElement(DateInput, {
                ref: "dateInput", 
                errors: this.props.errors, 
                value: this.state.value, 
                defaultValue: this.state.defaultValue, 
                onChange: this.onChange, 
                onFocus: this.handleFocus, 
                placeholder: this.props.placeholderText}), 
             maybe(this.state.focus,
                React.createElement(Popover, {className: "popover-calendar-container", 
                         onClose: this.hideCalendar}, 
                    React.createElement("div", {className: "datepicker-triangle"}), 
                    React.createElement(Calendar, {
                        numCalendars: 1, 
                        onDayClick: this.onChange, 
                        onDayMouseEnter: this.onMouseEnter, 
                        markers: this.props.markers})
                )
             )
        );
    }
});

module.exports = DatePicker;
