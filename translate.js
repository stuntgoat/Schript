// translate.js
// The generic Scheme translator. Accepts nested JavaScript arrays of and 
// returns valid JavaScript.
var tools = require('./tools.js');
var predicates = require('./predicates.js');

var lexer = require('./lexer.js');
var parser = require('./parser.js');

var defined_procedures = require('./procedures.js');

function lambda(obj) {
    // args is args in the following, 
    // example: [{"func":"x","args":["y","z"]}, {"func":"*","args":["x","y","z"]}]};
    // in this case, args will be a list; the first object in the list will be 
    // object with both func and args being all arguments to the lambda; 
    // tools.merge_lambda_args(obj) concatenates to Array. The second arg is the 
    // lambda procedure.
    var args = tools.merge_lambda_args(obj[0]);
    var expression = obj[1];
    var stack = [];

    stack.push('function');
    if (args.length === 0) {
	stack.push('()');
    } else if (args.length === 1) {
	stack.push('(' + args[0] + ')');
    } else {
	stack.push('(');
	for (var i in args) {
	    if (i == args.length - 1) {
		stack.push(args[i]);
	    } else {
		stack.push(args[i] + ',');
	    }
	}
	stack.push(')');
    }

    var procedures = tools.merge_objects([defined_procedures.procedures.operators, {'lambda': lambda}]);

    // the stack joined and the result of procedures
    return stack.join('') + '{return ' +  procedures[expression['func']](expression['args']) + '};';
}    
exports.lambda = {'lambda': lambda};
var procedures = tools.merge_objects([defined_procedures.procedures.operators, {'lambda': lambda}]);

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

// debug only
exports.pre_translate = pre_translate;

