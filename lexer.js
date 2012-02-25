

function print(value) {
    console.log(value);
    return;
}


expression1 = "(-  2 (* 9 (- 4 6 6) 3 7 56) 99)";
expression11 = "(- 2(* 9( - 4 6 6) 3 7 56 ) 99 )";
expression111 = "(- 2(* 9(- 4 6 6)3 7 56)99)";

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

function split_whitespace(equation) {
// split the s-expression at the whitespace and put each element in to an array
    var removable = /[\s]+/;
    var eq = equation.split(removable);
    return eq;
};

function is_lparen(item) {
    if (item === '(') {
	return true;
    } else {
	return false;
    }
}

function is_rparen(item) {
    if (item === ')') {
	return true;
    } else {
	return false;
    }
}

function is_operator(item) {
    var found = false;
    for (var o in operators) {
	if (item === operators[o]) {
	    found = true;	    
	}
    }
    return found;
}

function add_to_stack(stack, item) {
    // add item to an array named 'stack'; 'item' can be another array or a value
    stack.push(item);
    return stack;
}

function tokenize(equation) {
    var stack = [];
    var split_eq = split_whitespace(equation);
    for (var chunk in split_eq) {
	stack.push.apply(stack, split_first_lparen(split_eq[chunk]));
    }
    return stack;
}
                                                                                
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

sexp = "(define (topcard rank hand)(cond ((eq? rank (car (car hand))) (topstack (car hand))    ) (else (topcard rank (cdr hand))) ))";

sexp2 = "(define (nextrank rank)  (cond ((eq? rank 'K) 'Q)        ((eq? rank 'Q) 'J)        ((eq? rank 'J) 'T)        ((eq? rank 'T) '9)        ((eq? rank '9) '8)        ((eq? rank '8) '7)        ((eq? rank '7) '6)        ((eq? rank '6) '5)        ((eq? rank '5) '4)        ((eq? rank '4) '3)        ((eq? rank '3) '2)        ((eq? rank '2) 'A)        ((eq? rank 'A) 'K)  ))";

print(sexp2);
print(JSON.stringify(tokenize(sexp2)));




// function ast(equation) {
//     //return an abstract syntax tree from array named 'equation'
//     var stack = [];
//     for (var i in equation) {
// 	if () {

// 	}
// 	if (is_lparen(equation[i])) {
// 	    // make a node with the last 2 elements in the stack
// 	    left = stack.pop();
// 	    right = stack.pop();
// 	    stack.push(make_node(left, right, equation[i]));
// 	} else {
// 	    // make a leaf and place on the stack
// 	    stack.push(make_leaf(equation[i]));
// 	}
//     }
//     return stack;
// };

// print('input:');
// // print(expression111);
// print('output');
// print(split_whitespace(expression111));

// function contains_lparen(item) {
//     // if item contains a left paren, return an array with the
//     if (item.length > 1) {
// 	for (var e in item) {
// 	    if (is_lparen(item[e])) {
		
// }

// }
