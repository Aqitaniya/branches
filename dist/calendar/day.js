'use strict';

var React = require('react');
var moment = require('moment');

class Day extends React.Component {
    constructor(props) {
        super(props);
        this.state = { toolTip: false };
    }

    onClick(e) {
        this.props.onClick(this.props.day, this.props.markers, e);
    }

    onMouseEnter() {
        this.setState({
            toolTip: this.props.renderToolTip(this.props.day, this.props.markers)
        });
        this.props.onDayMouseEnter(this.props.day, this.props.markers);
    }

    onMouseLeave() {
        this.setState({ toolTip: false });
        this.props.onDayMouseLeave(this.props.day, this.props.markers);
    }

    render() {
        var className = `date ${this.props.className}`;
        var toolTip = (this.state.toolTip) ?  React.createElement("span", {className: "tooltip"}, this.state.toolTip) : false;

        return React.createElement("div", {
                    className: className, 
                    onClick: this.onClick.bind(this), 
                    onMouseEnter: this.onMouseEnter.bind(this), 
                    onMouseLeave: this.onMouseLeave.bind(this)}, 

            React.createElement("span", {className: "date-span"}, this.props.day.date()), 

            toolTip
        );
    }
}

Day.defaultProps = {
    className: '',
    day: moment(),
    renderToolTip: function() {  }
};

module.exports = Day;

