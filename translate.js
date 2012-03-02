// translate.js
// The generic Scheme translator. Accepts nested JavaScript arrays of and 
// returns valid JavaScript.
var tools = require('./tools.js');
var predicates = require('./predicates.js');

var lexer = require('./lexer.js');
var parser = require('./parser.js');

var math = require('./math_operators.js');
var lambda = require('./lambda.js');
var procedures = tools.merge_objects([math.math, lambda.lambda]);

function ast_to_js(parsed) {
    // translate a JavaScript abstract syntax tree to JavaScript code as text
    var args = parsed['args'];
    var func = parsed['func'];
    var stack = [];
    if  (procedures[func]) {
	return procedures[func](args);
    } else {
	return func + ' not supported';	
    }
}
exports.ast_to_js = ast_to_js;

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

