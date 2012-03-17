// parser.js
// Functions to create an abstract syntax tree from an array of Scheme tokens.
// exports: parse
var predicates = require('./predicates.js');
////////////////////////////////////////////////////////////////////////////////
// BEGIN PARSER

// null 'equals' [], that is they should be interchangable

// ("cat")
var string_cat = [['STRING', 'cat'], null];


// '(a 7 "cat")
var cat = ['QUOTE', ['a', 7, ['STRING', 'cat'], null]];

// ('a 7 "cat")
var unquoted_cat =  [['QUOTE', 'a'], 7, ['STRING', 'cat'], null];

// (+ 5 6 (- 8 3))
var arith_1 = ['+', 5, 6, ['-', 8, 3, null], null];

// (define foo 2)
var define_1 = ['define', 'foo', 2, null];

// ((lambda (x) (* x x)) 2)
var lambda_1 = [['lambda', ['x', null], ['*', 'x', 'x', null]], 2, null];

// (lambda () (* 90 3))
var lambda_2 = ['lambda', [null], ['*', 90, 3, null], null];

// (list 2 4 5)
var list_1 = ['list', 2, 4, 5, null];
// eval(cons(2, cons(4, cons(5, null)

// (if (< 2 5 8) 0 1)
var if_1 = ['if', ['<', 2, 5, 8, null], 0, 1, null];
// if = if eval(cadr if_node), eval(caddr), else cadddr.


// END PARSER
////////////////////////////////////////////////////////////////////////////////