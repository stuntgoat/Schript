 
// ast.js
// Functions to create an abstract syntax tree from an array of Scheme tokens.

// stolen from Python
function print(string, value) {

    console.log(string, value);
    return;
}



var expression1 = "(-  2 (* 9 (- 4 6 6) 3 7 56) 99)";
var expression11 = "(- 2(* 9( - 4 6 6) 3 7 56 ) 99 )";
var expression111 = "(- 2(* 9(- 4 6 6)3 7 56)99)";
var expression2 = "( / (- (* (- 4 6) 3)) (* (- (/ 3 2) (+ 1 1)) 876))";





sexp = "(define (topcard rank hand)(cond ((eq? rank (car (car hand))) (topstack (car hand))    ) (else (topcard rank (cdr hand))) ))";



print(expression2);
print(JSON.stringify(tokenize(expression2)));

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

function add_to_stack(stack, item) {
    // add item to an array named 'stack'; 'item' can be another array or a value
    stack.push(item);
    return stack;
}

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
