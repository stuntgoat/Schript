// lambda.js
// Define the JavaScript translation of Scheme's lambda procedure, given
// an object passed by parser.parse.

var procedures = require('./procedures.js');
var tools = require('./tools.js');

function evaluate_procedure(args, procedure) {
    // evaluate a prodcedure    
    stack = [];
    
}

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

// method 2
function lambda(obj) {
    // pass in the entire lambda object, that is, obj['func'] == 'lambda'
    // example: {"func":"lambda","args":[{"func":"x","args":["y","z"]},
    // {"func":"*","args":["x","y","z"]}]};
    // in this case, args will be a list; the first object in the list will be an 
    // object with the func being the first actual argument to the lambda, the
    //  args list if not
    // empty will be the list of following arguments. The second function in 
    // the list will be 
    // a procedure with an argument list.
    if (obj['func'] !== 'lambda') {
	return 'Error: ' + obj + ' is not a lambda';
    }
    // merge lambda args from first object in the args list, which is an object
    var args = tools.merge_lambda_args(obj['args'][0]);
    var expression = obj['args'][1];
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
	    console.log(args.length);
	    console.log(i);
	    if (i == args.length - 1) {
		console.log('holey shit');
		stack.push(args[i]);
	    } else {
		stack.push(args[i] + ',');
	    }
	}
	stack.push(')');
    }
    // the stack joined and the result of procedures
    return stack.join('') + '{' +  procedures.procedures[expression['func']](expression['args']) + '};';
}    
exports.lambda = {lambda: lambda};
