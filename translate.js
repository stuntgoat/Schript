// translate.js
// The generic Scheme translator. Accepts nested JavaScript arrays of and 
// returns valid JavaScript.
var tools = require('./tools.js');
var predicates = require('./predicates.js');

var lexer = require('./lexer.js');
var parser = require('./parser.js');

var defined_procedures = require('./procedures.js');

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

    console.log("in lambda:", procedures);
    if (obj['func'] != 'lambda') {
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


var procedures = tools.merge_objects([defined_procedures.procedures.operators, {'lambda': lambda}]);
console.log('defined procedures', defined_procedures.procedures.operators);
console.log('procedures', procedures);
function ast_to_js(parsed) {
    // translate a JavaScript abstract syntax tree to JavaScript code as text
    // 
    var args = parsed['args'];
    var func = parsed['func'];
//    console.log(func);
    var stack = [];
    for (var i in args) {
	console.log(args[i]);
	if (predicates.is_object(args[i])) { 
	    stack.push(ast_to_js(args[i]));
	} else {
	    stack.push(args[i]);
	}	
    }

    if  (procedures[func]) {
	// inserting enclosing paren may not work for other procedure-to-function 
	// translations- works for math procedures.
	console.log(func);
	console.log(stack);
	return '(' + procedures[func](stack) + ')';
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

exports.translate = translate;

// debug only
exports.pre_translate = pre_translate;

