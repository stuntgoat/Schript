

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
    print(eq);
    for (var r in eq) { 
	if (eq[r] !== '') {
	    stack.unshift(eq[r]);
	}
    }
    return stack;
};

function is_operator(item) {
    for (var o in operator) {
	if (item === operator[o]) {
	    return true;
	} else {
	    return false;
	}
    }
}

function ast(rpn_array) {
    //return an abstract syntax tree    
    var stack = [];
    for (var i in rpn_array) {
	var item = rpn_array[i];
	if (is_operator(item)) {
	    // make a node with the last 2 elements in the stack
	    left = stack.pop();
	    right = stack.pop();
	    stack.push(make_leaf(left, right, item));
	} else {
	    // make a leaf and place on the stack
	    stack.push(make_leaf(item));
	}
    }
};

print(rpn(expression1));
print(ast(rpn(expression1)));
