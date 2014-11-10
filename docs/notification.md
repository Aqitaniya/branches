# Notification

There are two main interactions that can be performed on a notification.
It can either be acknowledge, or dismissed.

To acknowledge a Notification means it has been clicked.

To dismiss a Notification means the close button was explictly clicked, or the `timeout` has expired.

#Properties
You can set the following properties on the `<Notification>`:

* `onDismissed` `func` Callback to be triggered once the notifcation is dismissed
* `onAcknowledged` `func` Callback to be triggered once the notification is acknowledged (AKA clicked)
* `showClose` `bool` Whether or not to show a close element that will explictly dismiss the notification when clicked. Clicking the close button will *not* acknowledge the view
* `timeout` `int` Time in ms that will dismiss the modal.

## Examples
It's best to learn through example, so here are the some notifications reimagined in React. Enjoy.

### The Basics
The classic Notification goes away when clicked.

```
var React = require('react');

var Navigation = require('react-router').Navigation;
var CurrentPath = require('react-router').CurrentPath;

var Notification = require('../components/Notification');

var AppView = React.createClass({
    mixins: [Navigation, CurrentPath],

    getInitialState: function () {
        return {
            shouldRenderNotification: true
        }
    },

    onNotificationAcknowledged: function () {
        this.setState({shouldRenderNotification: false});
    },

    renderNotification: function () {
        if (this.state.shouldRenderNotification) {
            return Notification.create({
                type: 'info',
                message: "Hey check me out!",
                onAcknowledged: this.onNotificationAcknowledged
            });
        }
    },

    render: function() {
        return (
            <div>
                {this.renderNotification()}
            </div>
        );
    }
});
```

### Cookie Warning
The cookie warning dismisses only if the user explictly clicks on the close button. If it's clicked anywhere else we navigate the user to information about cookies.

```
var React = require('react');

var Navigation = require('react-router').Navigation;
var CurrentPath = require('react-router').CurrentPath;

var Notification = require('../components/Notification');

var AppView = React.createClass({
    mixins: [Navigation, CurrentPath],

    getInitialState: function () {
        return {
            shouldRenderNotification: true
        }
    },

    onNotificationAcknowledged: function () {
        if (this.getCurrentPath() !== '/info/about/cookies') {
            this.transitionTo('/info/about/cookies');
        }
    },

    onNotificationDismissed: function () {
        this.setState({shouldRenderNotification: false});
    },

    renderNotification: function () {
        if (this.state.shouldRenderNotification) {
            return Notification.create({
                type: 'info',
                message: "This site uses cookies!",
                showClose: true,
                onDismissed: this.onNotificationDismissed,
                onAcknowledged: this.onNotificationAcknowledged
            });
        }
    },

    render: function() {
        return (
            <div>
                {this.renderNotification()}
            </div>
        );
    }
});
```

### Payment  Informer
This informs a user they need to update their payment information. When acknowledged it navigates the user to their account payment screen, and the Notification doesn't appear again until the app is refreshed.

```
var React = require('react');

var Navigation = require('react-router').Navigation;
var CurrentPath = require('react-router').CurrentPath;

var Notification = require('../components/Notification');

var AppView = React.createClass({
    mixins: [Navigation, CurrentPath],

    getInitialState: function () {
        return {
            shouldRenderNotification: true
        }
    },

    onNotificationAcknowledged: function () {
        this.setState({shouldRenderNotification: false});

        if (this.getCurrentPath() !== '/acccount/pay') {
            this.transitionTo('/account/pay');
        }
    },

    renderNotification: function () {
        if (this.state.shouldRenderNotification) {
            return Notification.create({
                type: 'info',
                message: "Dude, you need to pay!",
                onAcknowledged: this.onNotificationAcknowledged
            });
        }
    },

    render: function() {
        return (
            <div>
                {this.renderNotification()}
            </div>
        );
    }
});
```

### Network Connection Error
The network connection error shows up when window.navigator.onLine is not true. Kind of detecting if the network is connected.

This is probably *not the best way* to do this. But it was quick, cheap, and demonstrates how powerful React can be. I think ideally you would want to explictly dismiss the notification. And you would also want to modify *shouldComponentUpdate* so that the whole doesn't rerender every 1/4 second, but instead happens on change to connected.

```
    getInitialState: function() {
        return {
            connected: true;
        }
    },

    componentDidMount: function () {
        setInterval(function () {
            console.log(window.navigator.onLine);
            this.setState({connected: window.navigator.onLine});
        }.bind(this), 250);
    },

    renderNotification: function () {
        if (!this.state.connected) {
            return Notification.create({
                type: 'error',
                message: "You're not connected to the internet"
            });
        }
    },

    render: function() {
        return (
            <div>
                {this.renderNotification()}
            </div>
        );
    }
```
