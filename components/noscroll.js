module.exports = {
    componentWillMount: function() {
        document.getElementByTagName('body')[0].className += " noscroll";
        console.log(document.getElementByTagName('body')[0].className);
    },

    componentWillUnmount: function() {
        var classes = document.getElementByTagName('body')[0].className;
        var cleaned = classes.replace(/(?:^|\s)noscroll(?!\S)/g , '');

        document.getElementByTagName('body')[0].className = cleaned;
    }
};
