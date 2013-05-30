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
    var pass1 = /(\$|jQuery)\([\'"](.*?)[\'"]/gi.exec(js);

    // class
    var pass2 = /addClass\([\'"](.*?)[\'"]/gi.exec(js);
    if (pass2) this.addClass(pass2[1].split(' '));

    var pass3 = /removeClass\([\'"](.*?)[\'"]/gi.exec(js);
    if (pass3) this.addClass(pass3[1].split(' '));
    
    var pass6 = /attr\([\'"](id|class)[\'"], [\'"](.*?)[\'"]/gi.exec(js);
    if (pass6 && pass6[1] == 'class') this.addClass(pass6[2].split(' '), 2);
    if (pass6 && pass6[1] == 'id') this.addId(pass6[2]);
}

module.exports.writer = function(js) {

}