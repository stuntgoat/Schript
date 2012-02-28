// equation.js
// translate a string of Scheme math equations to a string of JavaScript equations.

var lexer = require('./lexer.js');
var parser = require('./parser.js');
var operators = require('./math_operators.js');
var predicates = require('./predicates.js');

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
    if  (operators.operators[func]) {
	return '(' + operators.operators[func](stack) + ')';
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

exports.pre_translate = pre_translate;
exports.translate = translate;
