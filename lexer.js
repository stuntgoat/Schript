// lexer.js
// functions to tokenize a Scheme expression

var operators = ['+', '-', '*', '/'];

function is_operator(item) {
    var found = false;
    for (var o in operators) {
	if (item === operators[o]) {
	    found = true;	    
	}
    }
    return found;
}

function split_whitespace(equation) {
// split the s-expression at the whitespace and put each element in to an array
    var removable = /[\s]+/;
    var eq = equation.split(removable);
    return eq;
};
                                                                                
function split_elements(chunk) {
    // split parts of a Scheme equation, that has been split at whitespace, to
    // paren, functions, and function arguments
    var stack = [];
    var tmp_stack = [];
    var paren = /[()]/;
    for (var i in chunk) {
	if (paren.test(chunk[i])) {
	    if (tmp_stack.length) {
		stack.push(tmp_stack.join(''));
	    }
	    stack.push(chunk[i]);
	    tmp_stack = [];
	} else if (is_operator(chunk[i])) {
	    tmp_stack.push(chunk[i]);
	} else { 
	    tmp_stack.push(chunk[i]);
	}
    }
    if (tmp_stack.length) {
	stack.push(tmp_stack.join(''));	
    }
    return stack;
}

function tokenize(equation) {
    var stack = [];
    var split_eq = split_whitespace(equation);
    for (var chunk in split_eq) {
	stack.push.apply(stack, split_elements(split_eq[chunk]));
    }
    return stack;
}

exports.tokenize = tokenize;