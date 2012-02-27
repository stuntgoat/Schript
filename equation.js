// equation.js
// translate a string of Scheme math equations to a string of JavaScript equations.

var lexer = require('./lexer.js');
var parser = require('./parser.js');
var operators = require('./math_operators.js');

var tester = Object.prototype.toString;

function translate(parsed) {
    // translate a JavaScript abstract syntax tree to JavaScript code as text
    var args = parsed['args'];
    var func = parsed['func'];
    var stack = [];
    for (var i in args) {
	if (tester.call(args[i]) == '[object Object]') { 
	    stack.push(translate(args[i]));
	} else {
	    stack.push(args[i]);
	}	
    }
    
    return '(' + stack.join(func) + ')';
}

function pre_translate(expression) {
    var tokenized = lexer.tokenize(expression);
    var parsed = parser.parse(tokenized);
    return parsed;
}

function translate_scheme(equation) {
    var parsed = pre_translate(equation);
    return translate(parsed);
}

exports.translate = translate;
exports.translate_scheme = translate_scheme;