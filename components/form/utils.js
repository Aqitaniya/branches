'use strict';

var encryptTypes = [
    'application/x-www-form-urlencoded',
    'multipart/form-data',
    'text/plain'
];

var inputTypes = [
    'button',
    'checkbox',
    'color',
    'date', 
    'datetime', 
    'datetime-local', 
    'email', 
    'file',
    'hidden',
    'image',
    'month', 
    'number', 
    'password',
    'radio',
    'range',
    'reset',
    'search',
    'submit',
    'tel',
    'text',
    'time',
    'url',
    'week'
];

var inputValidProps = [
    'accept',
    'alt',
    'autocomplete',
    'autofocus',
    'checked',
    'disabled',
    'form',
    'formaction',
    'formenctype',
    'formmethod',
    'formnovalidate',
    'formtarget',
    'height',
    'list',
    'max',
    'maxlength',
    'min',
    'multiple',
    'name',
    'pattern',
    'placeholder',
    'readonly',
    'required',
    'size',
    'src',
    'step',
    'type',
    'value',
    'width'
];

module.exports = {
    inputTypes: inputTypes,
    inputValidProps: inputValidProps,
    encryptTypes: encryptTypes
};
