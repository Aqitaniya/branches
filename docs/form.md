[Back](https://github.com/willowtreeapps/branches/tree/master/docs)

#Form

## Form
Form is a top level component that manages the state of the form 
and the value of all it's sub components. 

## Input
Input is a self validating sub component of Form. Input accepts
all w3 attributes in the props array.

### `validateWith`
`validateWith` is a function that is passed into the props array that
validates its value. `Form.Validate` has some validations, 
but any function can be passed into the `validateWith` prop that accepts 
a value as one of its properties and returns either true or false. (true being the 
field is valid) 

##Example

```js
var React = require('react');
var F = require('form');

var MyForm = React.createClass({
    
    render: funciton() {
        return (
            <F.Form onSubmit={onSubmit}>
                <F.Input 
                    name={'name'}
                    placeholder={'name'}
                    className={'username'}
                    required={'required'}
                />
            
                <F.Input    
                    name={'email'}
                    type={'email'}
                    validateWith={emailValidation}
                />
            
                <F.Input
                    name={'password'}
                    type={'password'}
                    validateWith={F.Validate.password}
                />
            </F.Form>
        ); 
    }
});

function emailValidation(val) {
    return new RegExp(/\S+@\S+\.\S+/).test(val);    
}

function onSubmit(e, data) {
    e.preventDefault();

}
```


