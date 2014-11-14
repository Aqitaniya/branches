module.exports = {
    componentWillMount: function() {
        document.getElementsByTagName('body')[0].className += " noscroll";
    },

    componentWillUnmount: function() {
        var classes = document.getElementsByTagName('body')[0].className;
        var cleaned = classes.replace(/(?:^|\s)noscroll(?!\S)/g , '');

        document.getElementsByTagName('body')[0].className = cleaned;
    }
};
