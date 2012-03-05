// lambda.js
// Define the JavaScript translation of Scheme's lambda procedure


var tools = require('./tools.js');
var parser = require('./parser.js');
var translate = require('./translate.js');
var predicates = require('./predicates.js');

var math = require('./math_operators.js');
var procedures = tools.merge_objects([math.math, {'lambda': lambda}]); // may need zero_args

function zero_passed(argument_list) {
    var args = tools.merge_lambda_args(argument_list[0]);
    var expression = argument_list[1];
    return lambda(args, expression, undefined);
}
exports.zero_passed = zero_passed;

function lambda(argument_list, expression_list, passed_values) { 
    var parsed_expression;
    var expression;
    var stack = [];

    if (predicates.is_array(expression_list)) {
	// if lambda has passed in values, expression_list will need to be parsed and translated first
	var parsed_expression = parser.ast(expression_list);
	expression = translate.ast_to_js(parsed_expression);
    } else if (predicates.is_object(expression_list)) { 
	// lambda did not recieve passed in values so
	// simply evaluate the expression
	procedures['lambda'] = zero_passed;
	expression = procedures[expression_list['func']](expression_list['args']);
    }
    // list arguments
    stack.push('function ');
    if (argument_list.length === 0) {
	stack.push('()');
    } else if (argument_list.length === 1) {
	stack.push('(' + argument_list[0] + ')');
    } else {
	stack.push('(');
	for (var i in argument_list) {
	    if (i == argument_list.length - 1) {
		stack.push(argument_list[i]);
	    } else {
		stack.push(argument_list[i] + ',');
	    }
	}
	stack.push(')');
    }
    if (passed_values === undefined) { // call lambda with no args
	return stack.join('') + '{return ' + expression + '};';	
    } else {
	return stack.join('') + '{return ' + expression + '}(' + passed_values + ')';	// call lambda with args
    }
}    
exports.lambda = {'lambda': lambda};

