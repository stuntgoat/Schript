// translate.js
// The generic Scheme translator. Accepts nested JavaScript arrays of and 
// returns valid JavaScript.

var predicates = require('./predicates.js');

var lexer = require('./lexer.js');
var parser = require('./parser.js');

var procedures = require('./procedures.js');

function ast_to_js(parsed) {
    // translate a JavaScript abstract syntax tree to JavaScript code as text
    var args = parsed['args'];
    var func = parsed['func'];
    var stack = [];
    for (var i in args) {
	if (predicates.is_object(args[i])) { 
	    stack.push(ast_to_js(args[i]));
	} else {
	    stack.push(args[i]);
	}	
    }
    if  (procedures.procedures[func]) {
	// inserting enclosing paren may not work for other procedure-to-function 
	// translations- works for math procedures.
	return '(' + procedures.procedures[func](stack) + ')';
    }
    return func + ' not supported';
}

function pre_translate(expression) {
    var tokenized = lexer.tokenize(expression);
    var parsed = parser.parse(tokenized);
    return parsed;
}

function translate(equation) {
    var parsed = pre_translate(equation);
    return ast_to_js(parsed);
}
exports.translate = translate;

// debug only
exports.pre_translate = pre_translate;

