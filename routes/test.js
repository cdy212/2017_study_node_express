
var page = require('webpage').create();  
page.open('http://blog.saltfactory.net', function (status) {  
    if (status) {
        var html = page.content;
        console.log(html);
    };
    phantom.exit();
});