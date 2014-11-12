[Back](https://github.com/willowtreeapps/branches/tree/master/docs)

#Lightbox

**Warning: This API is liable to change drastically in the next few weeks, use with caution**

#Properties
You can set the following properties on the `<Lightbox>`:

- `className` (`string`): A css class that will get applied to the lightbox modal
- `onClose` (`function`): This callback will fire when the lightbox is closed. Containes optional arguments passed from the view
- `view` (`React.element`): This callback will only fire when the button `no` is clicked

## Examples

### The Easiest Way (mixins)

```
var React = require('react');
var Lightbox = require('branches').lightbox;

var Form = React.createClass({
    onClose: function() {
        this.props.onClose(this.refs.name.getDOMNode().value);
    },

    render: function() {
        return (
            <div>
                <input type="text" ref="name" placeholder="name" />
                <button onClick={this.onClose}>Done</button>
            </div>
        );
    }
});

var App = React.createClass({
    mixins: [Lightbox.mixin],

    formValue: function() {
        console.log(arguments);
    },

    render: function() {
        var renderLightbox = this.factoryLightbox({
            view: Form,
            onClose: this.formValue
        });

        return (
            <div>
                <button onClick={renderLightbox}>Open</button>

                {this.renderLightbox()}
            </div>
        );
    }
});
```

