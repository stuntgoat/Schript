// tests.js

var assert = require('/usr/local/lib/node_modules/chai').assert;
var lexer = require("../lexer.js");
var translate = require("../translate.js");
var predicates = require("../predicates.js");
var parser = require("../parser.js");
// debug
var print = console.log;

suite('predicates.js', 
      function() {
          test('is_quoted_twice',
               function (){
		   var expression = '"\"doubles\""';
	           assert.deepEqual(true, predicates.is_quoted_twice(expression));
	       });},

      function() {
          test('is_quoted_once',
               function (){
		   var expression = '"single-ish"';
	           assert.deepEqual(true, predicates.is_quoted_once(expression));
	       });
      },

      function() {
          test('is_quoted_once should ',
               function (){
		   var expression = '"single\"-ish"';
	           assert.deepEqual(true, predicates.is_quoted_once(expression));
	       });
      });

suite('lexer.js', 
      function(){
          test('Break tokens on spaces and include negative numbers', 
               function (){
	           var expression = "(- a(*(- 4 -6)-3 4)99)";
	           var expected_output = ['(', '-', 'a', '(', '*', '(', '-', 4, -6, ')', -3, 4, ')', 99, ')'];
	           assert.deepEqual(expected_output, lexer.tokenize(expression));
	       });

          test('Break tokens for macros that use backquotes',
               function () {
                   var expected_output = [ '`', '(', ',', 'b', ',', 'a', ')' ],
                   input = "`(,b ,a)";
                   assert.deepEqual(expected_output, lexer.tokenize(input));
               }); 

          test('Comma within backquote, un-escaping opening paren',
               function () {
                   var expected_output = [ '`', '(', ',', 'b', ',', '(', '+', 'zip', 'zop', ')', ')' ];
                   var input = "`(,b ,(+ zip zop))";
                   assert.deepEqual(expected_output, lexer.tokenize(input));
               });
      });

suite('parser.js', 
      function () {
          test('parse nested expression with negative numbers', 
               function (){
                   // "(- a(*(- 4 -6)-3 4)99)";
	           var tokens = ['(', '-', 'a', '(', '*', '(', '-', 4, -6, ')', -3, 4, ')', 99, ')'];
                   var expected_output = [['-', 'a', ['*', ['-', 4, -6, null], -3, 4, null], 99, null ]];
	           assert.deepEqual(parser.parse(tokens), expected_output);
	       });

          test('parse define expression that delcares one variable', 
               function (){
	           var tokens = ['(', 'define', 'foo', 2, ')'];
	           var expected_output = [['define', 'foo', 2, null]];
	           assert.deepEqual(parser.parse(tokens), expected_output);
	       });

          test('parse define: define procedure that accepts 3 variables', 
               function (){
	           var tokens = ['(', 'define', '(', 'mult_us', 'x', 'y', 'z', ')', '(', '*', 'x', 'y', 'z', ')', ')'];
	           var expected_output =  [['define', ['mult_us', 'x', 'y', 'z', null], ['*', 'x', 'y', 'z', null], null]];
	           assert.deepEqual(expected_output, parser.parse(tokens));
	       });

          test('parse define: define procedure that accepts 2 variables', 
               function (){
	           var tokens = ['(', 'let', '(', '(', 'y', 8, ')', '(', 'z', 7, ')', ')', '(', '*', 'y', 'z', ')', '(', '+', 'y', 'z', ')', ')'];
	           var expected_output = [['let', [['y', 8, null], ['z', 7, null], null], ['*', 'y', 'z', null], ['+', 'y', 'z', null], null]]; 
	           assert.deepEqual(expected_output, parser.parse(tokens));
	       });

          test('parse quasi quotes: defmacro; backquoted sexp, 2 escaped vars ', 
               function (){
		   var input = "(defmacro hammer (x) `(* ,x ,x 99999))";
	           var expected_output = [["defmacro","hammer",["x",null],["BACKQUOTE",["*",["COMMA","x"],["COMMA","x"],99999,null]],null]];
		   var parsed = lexer.tokenize(input);
		   print(JSON.stringify(parser.parse(parsed)));
	           assert.deepEqual(expected_output, parser.parse(parsed));
	       });



});


suite('translate.js', 
      function(){
	  test('AST to JS: Basic arithmetic', 
               function (){
		   var ast = ['/', 5, 2, null];
		   var expected_output = "(5/2)";
	           assert.deepEqual(expected_output, translate.ast_to_js(ast, {}));
	       });          

          test('AST to JS: Basic arithmetic; nested expression', 
               function (){
		   var ast = ['+', 5, 2, ['-', 3, 6, 8, null], null];
		   var expected_output = "(5+2+(3-6-8))";
	           assert.deepEqual(expected_output, translate.ast_to_js(ast, {}));
	       });          
	  test('AST to JS: Basic comparisons; 2 arguments', 
               function (){
		   var ast = ['>', 3, 2, null];
		   var expected_output = "(3 > 2)";
	           assert.deepEqual(expected_output, translate.ast_to_js(ast, {}));
	      });
              
          test('AST to JS: Basic comparisons; 3 arguments', 
               function (){
		   var ast = ['>', 3, 2, 1, null];
		   var expected_output = "(3 > 2) && (2 > 1)";
	           assert.deepEqual(expected_output, translate.ast_to_js(ast, {}));
	       });

          test('AST to JS: Basic comparisons; 4 arguments', 
               function (){
		   var ast = ['>', 3, 2, 1, 0, null];
		   var expected_output = "(3 > 2) && (2 > 1) && (1 > 0)";
	           assert.deepEqual(expected_output, translate.ast_to_js(ast, {}));
	       });

          test('AST to JS: Procedure: define: variable assignment', 
               function (){
		   var ast = ['define', 'foo', 2, null];
		   var expected_output = "var foo = 2;";
                   var LOCAL_ENV = {};
	           assert.deepEqual(expected_output, translate.ast_to_js(ast, LOCAL_ENV));
		   assert.deepEqual(LOCAL_ENV['foo'], 2);
                   delete LOCAL_ENV;
	       });

          test('AST to JS: Procedure: define: variable assignment to string', 
               function (){
		   var ast = ['define', 'foo', '"ham"', null];
		   var expected_output = 'var foo = "ham";';
                   var LOCAL_ENV = {};
	           assert.deepEqual(expected_output, translate.ast_to_js(ast, LOCAL_ENV));
		   assert.deepEqual ('"ham"', LOCAL_ENV['foo']);
		   delete LOCAL_ENV;
	       });

          test('AST to JS: Procedure: define: function assignment', 
               function (){
		   var ast = ['define', ['mult_us', 'x', 'y', 'z', null], ['*', 'x', 'y', 'z', null], null];
		   var expected_output = "var mult_us = function (x, y, z) {return (x*y*z);};";
                   var LOCAL_ENV = {};
	           assert.deepEqual(expected_output, translate.ast_to_js(ast, LOCAL_ENV));
//		   assert.deepEqual("mult_us(2, 3, 4);", LOCAL_ENV['mult_us']([2, 3, 4, null]));
		   delete LOCAL_ENV['mult_us'];
	       });

          test('AST to JS: Procedure: if: return expression', 
               function (){
		   var ast = ['if', ['<', 2, 5, 8, null], ['+', 9, 9, null], ['-', 9, 9, null], null];
		   var expected_output = "function () { if ((2 < 5) && (5 < 8)) { return (9+9); } else { return (9-9); }}()";
	           assert.deepEqual(expected_output, translate.ast_to_js(ast, {}));
	       });

          test('AST to JS: Procedure: if: return value', 
               function (){
		   var ast = ['if', ['<', 2, 5, 8, null], 0, 1, null];
		   var expected_output = "function () { if ((2 < 5) && (5 < 8)) { return 0; } else { return 1; }}()";
	           assert.deepEqual(expected_output, translate.ast_to_js(ast, {}));
	       });

          test('AST to JS: procedure: cons: string to list', 
               function (){
		   var input = ['cons', '\"hammer\"', ['QUOTE', [0, 4, null]], null];
		   var expected_ouput = '["hammer",0,4,null]';
	           assert.deepEqual(expected_ouput, translate.ast_to_js(input));
	       });

	  test('AST to JS: procedure: cons: quoted symbol to list', 
               function (){
		   var input = ['cons', 'hammer', ['QUOTE', [0, 4, null]], null];
		   var expected_ouput = '[hammer,0,4,null]';
	           assert.deepEqual(expected_ouput, translate.ast_to_js(input));
	       });

	  test('AST to JS: procedure: cons: quoted list to quoted list', 
               function () {
		   var input = ['cons', ['QUOTE', ['list', 8, 9, null]], ['QUOTE', [0, 4, null]], null];
		   var expected_ouput = '[[list,8,9,null],0,4,null]';
	           assert.deepEqual(expected_ouput, translate.ast_to_js(input));
	       });

	  test('AST to JS: procedure: cons: evaled list to quoted list', 
               function () {
		   var input = ['cons', ['cons', 8, ['QUOTE',[9, null]]], ['QUOTE', [0, 4, null]], null];
		   var expected_ouput = '[[8,9,null],0,4,null]';
	           assert.deepEqual(expected_ouput, translate.ast_to_js(input, null));
	       });

	  test('AST to JS: procedure: cons: dotted pair to list', 
               function () {
		   var input = ['cons', ['QUOTE', [8, 9]], ['QUOTE', [4, null]], null];
		   var expected_ouput = '[[8,9],4,null]';
	           assert.deepEqual(expected_ouput, translate.ast_to_js(input, null));
	       });

	  test('AST manipulation: backquoted s-expressions: single escaped variable', 
               function () { 
		   var input = ['define', 'a', ['COMMA', 'x'], null];
		   var expected_ouput = ['define', 'a', 8, null];
                   var LOCAL_ENV = {
                       x: 8
                   };
	           assert.deepEqual(expected_ouput, translate.expand_vars(input, LOCAL_ENV));
                   delete LOCAL_ENV;
	       });
           
  	  test('AST to JS: procedure: backquoted s-expressions: escaped expression and escaped var', 
               function () {
		   var input = ['if', ['<', ['COMMA', 'x'], ['COMMA', ['+', 'y', 3, null]], null], 1, 0, null];
		   var expected_ouput = [ 'if', [ '<', 8, [ '+', 92, 3, null ], null ], 1, 0, null ];
                   var LOCAL_ENV = {
                       x:8,
                       y:92
                   };
	           assert.deepEqual(expected_ouput, translate.expand_vars(input, LOCAL_ENV)); 
                   delete LOCAL_ENV;
	       });
 
	  test('Scheme to JS: simple arithmetic', 
               function () {
		   var input = "(+ 6 77)";
		   var expected_ouput = "(6+77)\n";
                   var LOCAL_ENV = {};
                   var output = translate.schript(input, LOCAL_ENV);
	           assert.deepEqual(output, expected_ouput);
                   delete LOCAL_ENV;
	       });

	  test('Scheme to JS: nested arithmetic', 
               function () {
		   var input = "(+ 6 77(- 27 9 11))";
		   var expected_ouput = "(6+77+(27-9-11))\n";
                   var LOCAL_ENV = {};
                   var output = translate.schript(input, LOCAL_ENV);
	           assert.deepEqual(expected_ouput, output);
                   delete LOCAL_ENV;
	       });

	  test('Scheme to JS: multiple statements, calling defined functions', 
               function () {

	           var input = "(define (s y) (* y y))(define e 39999)(* (s 8) e)";
	           var expected_ouput = "var s = function (y) {return (y*y);};\nvar e = 39999;\n(s(8);*e)\n";
                   var LOCAL_ENV = {};
                   var output = translate.schript(input, LOCAL_ENV);
	           assert.deepEqual(expected_ouput, output);
                   delete LOCAL_ENV;
	       });

	  test('Scheme to JS: multiple statements', 
               function () {
	           var input = "(define x 27)(define y 9)(+ x y)";
	           var expected_ouput = "var x = 27;\nvar y = 9;\n(x+y)\n";
                   var LOCAL_ENV = {};
                   var output = translate.schript(input, LOCAL_ENV);
	           assert.deepEqual(expected_ouput, output);
                   delete LOCAL_ENV;
	       });


	  test('Scheme to JS: recursive function definition', 
               function () {
                   var input = "(define (recurs x) (if (= x 0) x (+ x (recurs (- x 1)))))";
	           var expected_ouput = "var recurs = function (x) {return function () { if ((x === 0)) { return x; } else { return (x+recurs((x-1))); }}();};\n";
                   var output = translate.schript(input, {});
	           assert.deepEqual(expected_ouput, output);
                   delete LOCAL_ENV;
	       });

	  test('Scheme to JS: iterive function definition', 
               function () {
                   var input = "(define (fact n total) (if (= n 0) total (fact (- n 1) (* n total))))";
	           var expected_ouput = "var fact = function (n, total) {return function () { if ((n === 0)) { return total; } else { return fact((n-1),(n*total)); }}();};\n";
                   var output = translate.schript(input, {});
	           assert.deepEqual(expected_ouput, output);
                   delete LOCAL_ENV;
	       });

	  test('Scheme to JS: lambda zero args', 
               function () {
                   var input = "(lambda () (* 90 3))";
	           var expected_ouput = "function(){ return (90*3)};\n";
                   var output = translate.schript(input, {});
	           assert.deepEqual(expected_ouput, output);
	       });

	  test('Scheme to JS: lambda one arg', 
               function () {
                   var input = "((lambda (x) (* x x)) 2))";
	           var expected_ouput = "function(x){ return (x*x)}(2);\n";
                   var output = translate.schript(input, {});
	           assert.deepEqual(expected_ouput, output);
	       });

	  test('Scheme to JS: lambda 3 args not called with any arguments', 
               function () {
                   var input = "((lambda (x y z) (* x (+ y (- z 100)))))";
	           var expected_ouput = "function(x, y, z){ return (x*(y+(z-100)))};\n";
                   var output = translate.schript(input, {});
	           assert.deepEqual(expected_ouput, output);
	       });

	  test('Scheme to JS: lambda 3 args: call with 3 values', 
               function () {
                   var input = "((lambda (x y z) (* x y (* x z))) 2 3 4)";
	           var expected_ouput = "function(x, y, z){ return (x*y*(x*z))}(2, 3, 4);\n";
                   var output = translate.schript(input, {});
	           assert.deepEqual(expected_ouput, output);
	       });

	  test('Scheme to JS: let procedure', 
               function () {
                   var input =  "(let ((y 8)(z 7)) (* y z) (+ y z))";
	           var expected_ouput = "function() {var y = 8;var z = 7;(y*z);return (y+z);\n";
                   var output = translate.schript(input, {});
	           assert.deepEqual(expected_ouput, output);
	       });

      });



