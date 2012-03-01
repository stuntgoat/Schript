// lambda.js
// Define the JavaScript translation of Scheme's lambda procedure, given
// an object passed by parser.parse.


var tools = require('./tools.js');
var defined_procedures = require('./procedures.js');

function lambda(args) {
    // args is args in the following, 
    // example: {"func":"lambda","args":[{"func":"x","args":["y","z"]},
    // {"func":"*","args":["x","y","z"]}]};
    // in this case, args will be a list; the first object in the list will be 
    // object with both func and args being all arguments to the lambda; 
    // tools.merge_lambda_args(obj) concatenates to Array. The second arg is the 
    // lambda procedure.
    console.log(defined_procedures.procedures);
    console.log(defined_procedures.procedures.procedures);
    var procedures = tools.merge_objects([defined_procedures.procedures.operators, {'lambda': lambda}]);

    // merge lambda args from first object in the args list, which is an object
    var args = tools.merge_lambda_args(args[0]);
    var expression = args[1];
    var stack = [];
    var tmp_stack = [];

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
    // the stack joined and the result of procedures
    return stack.join('') + '{return ' +  procedures.procedures[expression['func']](expression['args']) + '};';
}    
exports.lambda = {'lambda': lambda};




// // method 1
// function lambda(args, body) {
//     // translate a lambda expression
//     var stack = [];
//     var tmp_stack = [];
//     if (!args.length) {
// 	stack.push('() ');
//     } else if (args.length === 1) {
// 	stack.push('(' + args[0] + ') ');
//     } else {
// 	stack.push('(');
// 	for (var i in args) {
// 	    if (i === args.length -1){
// 		tmp_stack.push(args[i]);
// 	    } else {
// 		tmp_stack.push(args[i] + ',');
// 	    }
// 	}
// 	stack.push(')');
//     }
//     return stack.join('') + evaluate_procedure();
// }
// //exports.lambda = {lambda: lambda};
