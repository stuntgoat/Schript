// translate.js
// The generic Scheme translator. Accepts nested JavaScript arrays of and 
// returns valid JavaScript.
var tools = require('./tools.js');
var predicates = require('./predicates.js');

var lexer = require('./lexer.js');
var parser = require('./parser.js');

var math = require('./math_operators.js');
var lambda = require('./lambda.js');
var procedures = tools.merge_objects([math.math, {'lambda':lambda.zero_passed}]); // other objects may be passed to 
// merge objects in the future; lambda was passed in before it began it's metamorphosis into a special form


function ast_to_js(parsed) {
    // translate a JavaScript abstract syntax tree to JavaScript code as text
    var args = parsed['args'];
    var func = parsed['func'];
    var stack = [];

    if (func[0] === "lambda") { // lambda being called with passed in values
    	console.log("func[0] in translate.js is 'lambda'");
    	return lambda.lambda.lambda(func[1], func[2], args); // call lambda with the argument list, expression list and the passed in arguments
    } else if (procedures[func]) {
    	return procedures[func](args);

    // if  (procedures[func]) {
    // 	return procedures[func](args);

    // } else if (func[0] === "lambda") { // lambda being called with passed in values
    // 	console.log("func[0] in translate.js is 'lambda'");
    // 	return lambda.lambda.lambda(func[1], func[2], args); // call lambda with the argument list, expression list and the passed in arguments


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

