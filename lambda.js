// lambda.js
// Define the JavaScript translation of Scheme's lambda procedure, given
// an object passed by parser.parse.

var tools = require('./tools.js');

var math = require('./math_operators.js');
var procedures = tools.merge_objects([math.math, {'lambda': lambda}]);

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
    // the stack joined and the result of procedures calls on the expression
    return stack.join('') + '{return ' + procedures[expression['func']](expression['args']) + '};';
}    
exports.lambda = {'lambda': lambda};
