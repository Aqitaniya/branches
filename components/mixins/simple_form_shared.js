module.exports = {
    getInitialState: function() {
        return {
            valid: this.isValid()
        };    
    },
    
    /**
     * Adds callbacks to the field for updating value
     * and validation state on `Form` and calls `updateValidationState`.
     *
     * @method componentDidMount
     */ 
    componentDidMount: function() {
        this._updateValidationState = this.props._updateValidationState;
        this._updateValidationState(this.state.valid, this.props.name);
        this._updateFieldValue = this.props._updateFieldValue;
    },
    
    /**
     * Check to see if the state of validation has changed,
     * if it has, send callback to form with updated 
     * validation state.
     *
     * @method revalidateInput
     */
    revalidateSelf: function(value) {
        if (this.state.valid !== this.isValid(value)) {
            this.setState({valid: !this.state.valid});
            this._updateValidationState(this.isValid(value), this.props.name);
        }
    },

    /**
     * Checks if a field is valid. 
     * - If a validation function is provided the value is tested against it.
     *
     * - If no validation function is provided, but the field is required, a
     *   check will be done to see if there is a value present.
     *
     * - If no validation function is provided and the field is not required
     *   then the field is valid.
     *
     * @method isValid
     * @param {string} val - The value of the input field
     * @return {boolean}
     */
    isValid: function(val) {
        if (this.props.validateWith) {
            return this.props.validateWith(val);         
        } else if(this.props.required === 'required') {
            if (val === undefined || val === null) {
                return false;
            }
            return val.length > 0;
        }
        return true;
    }, 

    /**
     * Sets `_attributes` to an object of 
     * valid w3 input attributes.
     *
     * @method setInputAttributes
     */
    setAttributes: function(attributeList) {
        this._attributes = {};
       
        for(var prop in this.props) {
            if (attributeList.indexOf(prop) !== -1) {
                this._attributes[prop] = this.props[prop];
            }          
        } 
    }, 
    
    /**
     * Takes any classes passed in with props and
     * merges them with the class name that matches 
     * the current validation state
     *
     * @method getClassList
     * @return {string} 
     */
    getClassList: function() {
        var classList = [];
        var isValid = this.state.valid ? 'form-field-valid' : 'form-field-invalid';
        
        if (this.props.className) {
            classList = this.props.className.split(' ');
        }

        classList.push(isValid);
        return classList.join(' ');
    }
};
