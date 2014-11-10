[Back](https://github.com/willowtreeapps/branches/tree/master/docs)

#Alert

**Warning: This API is liable to change drastically in the next few weeks, use with caution**

#Properties
You can set the following properties on the `<Alert>`:

- `className` (`string`): A css class that will get applied to the alert modal
- `title` (`string`): The title the alert will have, displayed in a `<h1>` tag
- `message` (`string`): The message the alert will have, displayed in a `<p>` tag
- `buttons` (`object`): The alert defaults to having "Yes" and "No" buttons. "No" is a special button that will trigger your `onFail` callback, all other buttons trigger `onSuccess`. The key of the object is the event which will get passed to your callbacks, and the value is the text which the button will display. `{yes: 'Yes', no: 'No'}` are the defaults for this field
- `onClose` (`function`): This callback will be fired after either `onSuccess` or `onFail` fires. It will recive the key of the button clicked.
- `onSuccess` (`function`): This callback will fire for any button click other than `no`
- `onFail` (`function`): This callback will only fire when the button `no` is clicked

## Examples

### The Easiest Way (mixins)

```
var React = require('react');
var Alert = require('branches').alert;

var App = React.createClass({
    mixins: [Alert.mixin],

    onClick: function() {
        this.alertCreate({
            title: 'cool'
        });
    },

    render: function() {
        return (
            <div>
                <h1 onClick={this.onClick}>Hello</h1>
                {this.state._alert}
            </div>
        );
    }
});
```

