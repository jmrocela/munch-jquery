/**
 * munch-jquery
 * http://jmrocela.github.com/munch-jquery
 *
 * munch-jquery is a parser for munch.js
 *
 * Copyright (c) 2013 John Rocela
 * Licensed under the MIT license.
 * https://github.com/gruntjs/grunt/blob/master/LICENSE-MIT
 */
module.exports.parser = function(js) {
    var that = this;

    var pass1 = js.match(/(\$|jQuery)\([\'"](.*?)[\'"]/gi);
    if (pass1) {
        pass1.forEach(function(selector) {
            that.parseCssSelector(selector);
        });
    }

    var pass2 = /addClass\([\'"](.*?)[\'"]/gi;
    var match;
    while (match = pass2.exec(js)) this.addClass(match[1]);

    var pass3 = /removeClass\([\'"](.*?)[\'"]/gi;
    var match;
    while (match = pass3.exec(js)) this.addClass(match[1]);
    
    var pass6 = /attr\([\'"](id|class)[\'"], [\'"](.*?)[\'"]/gi;
    var match;
    while (match = pass6.exec(js)) {
        if (match[1] == 'class') this.addClass(match[2].split(' '), 2);
        if (match[1] == 'id') this.addId(match[2]);   
    }
}

module.exports.writer = function(js) {
    var that = this;

    var pass1 = js.match(/(\$|jQuery)\([\'"](.*?)[\'"]/gi);
    if (pass1) {
        pass1.forEach(function(selector) {
            var match = null,
                tid = selector.match(/#[\w\-]+/gi),
                tcl = selector.match(/\.[\w\-]+/gi);

            if (tid) {
                for (var i in tid) {
                    var match = tid[i];
                    var id = match.replace('#', '');
                    if (that.ignoreIds.indexOf(id) > -1) break;
                    var original = selector;
                    selector = selector.replace(id, that.map["id"][id]);
                    js = js.replace(original, selector);
                }
            }
            if (tcl) {
                for (var i in tcl) {
                    var match = tcl[i];
                    var cl = match.replace('.', '');
                    if (that.ignoreClasses.indexOf(cl) > -1) break;
                    var original = selector;
                    selector = selector.replace(cl, that.map["class"][cl]);
                    js = js.replace(original, selector);
                }
            }
        });
    }

    var pass2 = /addClass\([\'"](.*?)[\'"]/gi;
    var match;
    while (match = pass2.exec(js)) {
        if (that.ignoreClasses.indexOf(match[1]) > -1) continue;
        var selector = match[0].replace(match[1], that.map["class"][match[1]]);
        js = js.replace(match[0], selector);
    }

    var pass3 = /removeClass\([\'"](.*?)[\'"]/gi;
    var match;
    while (match = pass3.exec(js)) {
        if (that.ignoreClasses.indexOf(match[1]) > -1) continue;
        var selector = match[0].replace(match[1], that.map["class"][match[1]]);
        js = js.replace(match[0], selector);
    }
    
    var pass6 = /attr\([\'"](id|class)[\'"], [\'"](.*?)[\'"]/gi;
    var match;
    while (match = pass6.exec(js)) {
        if (match[1] == 'class') {
            var split = match[2].split(' ');

            for (var i in split) {
                if (that.ignoreClasses.indexOf(split[i]) > -1) break;
                var original = match[0];
                match[0] = match[0].replace(split[i], that.map["class"][split[i]]);
                js = js.replace(original, match[0]);
            }
        }

        if (match[1] == 'id') {
            if (that.ignoreIds.indexOf(match[2]) > -1) break;
            var original = match[0];
            match[0] = match[0].replace(match[2], that.map["id"][match[2]]);
            js = js.replace(original, match[0]);
        }
    }

    return js;
}

var pass = function (passes, that) {
    passes.forEach(function(pass) {
        that.parseCssSelector(pass);
    });
}