[Back](https://github.com/willowtreeapps/branches/tree/master/docs)

# ToolTip
A ToolTip is a Component that will display a simple message when moused over. It has the following configurable properties.
* `message` (`string | element`) - `Required` the message you wish the tooltip to display.
* `messageClass` (`string`) - If the message is a String, the class you wish you apply to the `<p>` tag. Will default to `tooltip`.
* `containerClass` (`string`) - The class you wish to apply the the ToolTip container. `tooltip-container` is the default for this property.

A tooltip will automatically wrap around the first and only child, if there are multiple children you must specify the desired tooltipped
component with the `tooltipped` property.
# Examples

## Explicitly Creating

### Single Child
```
var App = React.createClass({
    render: function() {
        return (
            <form>
                <input type="text" />
                <ToolTip message="Insert your first name">
                    <p>?</p>
                </ToolTip>
            </form>
        );
    }
});
```

### Multiple Children
Notice the specification of the `tooltipped` property.

```
var App = React.createClass({
    render: function() {
        return (
            <form>
                <ToolTip message="Insert your first name">
                    <input type="text" />
                    <p tooltipped>?</p>
                </ToolTip>
            </form>
        );
    }
});
```

### Dynamic Creation
You can also create a `ToolTip` on the fly by using the `ToolTip.wrap` method.

```
var App = React.createClass({
    render: function() {
        return (
            <form>
                <input type="text" />
                {ToolTip.wrap("Insert your first name", <input type="text" />}
            </form>
        );
    }
});
```




