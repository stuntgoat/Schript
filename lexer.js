

function print(value) {
    console.log(value);
    return 
}


expression1 = "(- (* (- 4 6) 3) 99)";
expression2 = "( / (- (* (- 4 6) 3)) (* (- (/ 3 2) (+ 1 1)) 876))";
operators = ['+', '-', '*', '/'];

function make_leaf(leaf) {
    return {
	'leaf': leaf
    };
}

function make_node(l, r, operator) {
    var node = {'left': l,
		'right': r,
		'operator': operator};
    return node;
}

function rpn(equation) {
// given a Scheme equation string, place into a reverse Polish Notation array.
    var removable = /[\s()]+/;
    var eq = equation.split(removable);
    stack = [];
    for (var r in eq) { 
	if (eq[r] !== '') {
	    stack.unshift(eq[r]);
	}
    }
    return stack;
};

function is_operator(item) {
    var found = false;
    for (var o in operators) {
	if (item === operators[o]) {
	    found = true;	    
	}
    }
    return found;
}

function ast(rpn_array) {
    //return an abstract syntax tree    
    var stack = [];
    for (var i in rpn_array) {
	if (is_operator(rpn_array[i])) {
	    // make a node with the last 2 elements in the stack
	    left = stack.pop();
	    right = stack.pop();
	    stack.push(make_node(left, right, rpn_array[i]));
	} else {
	    // make a leaf and place on the stack
	    stack.push(make_leaf(rpn_array[i]));
	}
    }
    return stack;
};

print('input:');
print(expression2);
print('output');
print(JSON.stringify(ast(rpn(expression2))[0]));
