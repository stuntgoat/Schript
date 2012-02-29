// lambda.js
// Define the JavaScript translation of Scheme's lambda procedure, given
// an object passed by parser.parse.

var procedures = require('./procedures.js');

function evaluate_procedure(args, procedure) {
    // evaluate a prodcedure    
    stack = [];
    
}
// method 1
function lambda(args, body) {
    // translate a lambda expression
    var stack = [];
    var tmp_stack = [];
    if (!args.length) {
	stack.push('() ');
    } else if (args.length === 1) {
	stack.push('(' + args[0] + ') ');
    } else {
	stack.push('(');
	for (var i in args) {
	    if (i === args.length -1){
		tmp_stack.push(args[i]);
	    } else {
		tmp_stack.push(args[i] + ',');
	    }
	}
	stack.push(')');
    }
    return stack.join('') + evaluate_procedure();
}
//exports.lambda = {lambda: lambda};

// method 2
function lambda2(obj) {
    // pass in the entire lambda object
    // example: {"func":"lambda","args":[{"func":"x","args":["y","z"]},{"func":"*","args":["x","y","z"]}]};
    // in this case, args will be a list; the first object in the list will be an 
    // object with the func being the first actual argument to the lambda, the args list if not
    // empty will be the list of following arguments. The second function in the list will be 
    // a procedure with an argument list.
    if (obj['func'] !== 'lambda') {
	return 'Error: ' + obj + ' is not a lambda';
    }
    var expression = obj['args'];
    var stack = [];
    var tmp_stack = [];
    if (!args.length) {
	stack.push('() ');
    } else if (args.length === 1) {
	stack.push('(' + args[0] + ') ');
    } else {
	stack.push('(');
	for (var i in args) {
	    if (i === args.length -1){
		tmp_stack.push(args[i]);
	    } else {
		tmp_stack.push(args[i] + ',');
	    }
	}
	stack.push(')');
    }
    return procedures.procedures[obj];
}    
exports.lambda = {lambda: lambda};
