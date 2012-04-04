// tests.js

var assert = require('/usr/local/lib/node_modules/chai').assert;

var lexer = require("../lexer.js");
var translate = require("../translate.js");
var predicates = require("../predicates.js");
var parser = require("../parser.js");


suite('predicates.js', 
      function() {
          test('is_quoted_twice',
               function (){
		   var expression = '"\"doubles\""';
                   console.log('input:', expression);                   
                   console.log('output:', predicates.is_quoted_twice(expression));
		   console.log('\n');
	           assert.deepEqual(true, predicates.is_quoted_twice(expression));
	       });},

      function() {
          test('is_quoted_once',
               function (){
		   var expression = '"single-ish"';
                   console.log('input:', expression);                   
                   console.log('output:', predicates.is_quoted_once(expression));
		   console.log('\n');
	           assert.deepEqual(true, predicates.is_quoted_once(expression));
	       });
      },

      function() {
          test('is_quoted_once should ',
               function (){
		   var expression = '"single\"-ish"';
                   console.log('input:', expression);                   
                   console.log('output:', predicates.is_quoted_once(expression));
		   console.log('\n');
	           assert.deepEqual(true, predicates.is_quoted_once(expression));
	       });

      });

suite('lexer.js', 
      function(){
          test('Break tokens on spaces and include negative numbers', 
               function (){
	           var expression = "(- a(*(- 4 -6)-3 4)99)";
	           var expected_output = ['(', '-', 'a', '(', '*', '(', '-', 4, -6, ')', -3, 4, ')', 99, ')'];
	           
                   console.log('input:', expression);                   
                   console.log('output:', lexer.tokenize(expression));
		   console.log('\n');
	           assert.deepEqual(expected_output, lexer.tokenize(expression));
	       });

          test('Break tokens for macros that use backquotes',
               function () {
                   var expected_output = [ '`', '(', ',', 'b', ',', 'a', ')' ],
                   input = "`(,b ,a)";
		   console.log('input:', input);                   
                   console.log('output:', lexer.tokenize(input));
		   console.log('\n');
                   assert.deepEqual(expected_output, lexer.tokenize(input));
               }); 

          test('Comma within backquote, un-escaping opening paren',
               function () {
                   var expected_output = [ '`', '(', ',', 'b', ',', '(', '+', 'zip', 'zop', ')', ')' ];
                   var input = "`(,b ,(+ zip zop))";
		   console.log('input:', input);                   
                   console.log('output:', lexer.tokenize(input));
		   console.log('\n');
                   assert.deepEqual(expected_output, lexer.tokenize(input));
               });
      });

suite('parser.js', 
      function () {
          test('parse nested expression with negative numbers', 
               function (){
                   // "(- a(*(- 4 -6)-3 4)99)";
	           var tokens = ['(', '-', 'a', '(', '*', '(', '-', 4, -6, ')', -3, 4, ')', 99, ')'];
                   var expected_output = ['-', 'a', ['*', ['-', 4, -6, null], -3, 4, null], 99, null ];
                   console.log('input:', tokens);                   
                   console.log('output:', parser.parse(tokens));
		   console.log('\n');
	           assert.deepEqual(parser.parse(tokens), expected_output);
	       });

          test('parse define expression that delcares one variable', 
               function (){
	           var tokens = ['(', 'define', 'foo', 2, ')'];
	           var expected_output = ['define', 'foo', 2, null];
                   console.log('input:', tokens);
                   console.log('output:', parser.parse(tokens));
		   console.log('\n');
	           assert.deepEqual(parser.parse(tokens), expected_output);
	       });

          test('parse define: define procedure that accepts 3 variables', 
               function (){
	           var tokens = ['(', 'define', '(', 'mult_us', 'x', 'y', 'z', ')', '(', '*', 'x', 'y', 'z', ')', ')'];
	           var expected_output =  ['define', ['mult_us', 'x', 'y', 'z', null], ['*', 'x', 'y', 'z', null], null];
                   console.log('input:', tokens);                   
                   console.log('output:', parser.parse(tokens));
		   console.log('\n');
	           assert.deepEqual(expected_output, parser.parse(tokens));
	       });

          test('parse define: define procedure that accepts 2 variables', 
               function (){
	           var tokens = ['(', 'let', '(', '(', 'y', 8, ')', '(', 'z', 7, ')', ')', '(', '*', 'y', 'z', ')', '(', '+', 'y', 'z', ')', ')'];
	           var expected_output = ['let', [['y', 8, null], ['z', 7, null], null], ['*', 'y', 'z', null], ['+', 'y', 'z', null], null]; 

                   console.log('input:', tokens);                   
                   console.log('output:', parser.parse(tokens));
		   console.log('\n');
	           assert.deepEqual(expected_output, parser.parse(tokens));
	       });

});


suite('translate.js', 
      function(){
	  test('AST to JS: Basic arithmetic', 
               function (){
		   var ast = ['/', 5, 2, null];
		   var expected_output = "(5/2)";
	           
                   console.log('input:', ast);                   
                   console.log('output:', translate.ast_to_js(ast, {}));
		   console.log('\n');
	           assert.deepEqual(expected_output, translate.ast_to_js(ast, {}));
	       });          

          test('AST to JS: Basic arithmetic; nested expression', 
               function (){
		   var ast = ['+', 5, 2, ['-', 3, 6, 8, null], null];
		   var expected_output = "(5+2+(3-6-8))";
	           
                   console.log('input:', ast);                   
                   console.log('output:', translate.ast_to_js(ast, {}));
		   console.log('\n');
	           assert.deepEqual(expected_output, translate.ast_to_js(ast, {}));
	       });          
	  test('AST to JS: Basic comparisons; 2 arguments', 
               function (){
		   var ast = ['>', 3, 2, null];
		   var expected_output = "(3 > 2)";
		   console.log('input:', ast);                   
		   console.log('output:', translate.ast_to_js(ast));
		   console.log('\n');
	           assert.deepEqual(expected_output, translate.ast_to_js(ast, {}));
	      });
              
          test('AST to JS: Basic comparisons; 3 arguments', 
               function (){
		   var ast = ['>', 3, 2, 1, null];
		   var expected_output = "(3 > 2) && (2 > 1)";
	           
                   console.log('input:', ast);                   
                   console.log('output:', translate.ast_to_js(ast));
		   console.log('\n');
	           assert.deepEqual(expected_output, translate.ast_to_js(ast, {}));
	       });

          test('AST to JS: Basic comparisons; 4 arguments', 
               function (){
		   var ast = ['>', 3, 2, 1, 0, null];
		   var expected_output = "(3 > 2) && (2 > 1) && (1 > 0)";
	           
                   console.log('input:', ast);                   
                   console.log('output:', translate.ast_to_js(ast));
		   console.log('\n');
	           assert.deepEqual(expected_output, translate.ast_to_js(ast, {}));
	       });

          test('AST to JS: Procedure: define: variable assignment', 
               function (){
		   var ast = ['define', 'foo', 2, null];
		   var expected_output = "var foo = 2;";
                   var LOCAL_ENV = {};
                   console.log('input:', ast);                   
                   console.log('output 1:', translate.ast_to_js(ast, LOCAL_ENV));
		   console.log('\n');

		   assert.deepEqual(LOCAL_ENV['foo'], 2);
	           assert.deepEqual(expected_output, translate.ast_to_js(ast, LOCAL_ENV));
                   delete LOCAL_ENV;
	       });

          test('AST to JS: Procedure: define: variable assignment to string', 
               function (){
		   var ast = ['define', 'foo', '"ham"', null];
		   var expected_output = 'var foo = "ham";';
                   var LOCAL_ENV = {};
                   console.log('input:', ast);                   
                   console.log('output 1:', translate.ast_to_js(ast, LOCAL_ENV));
		   console.log('\n');

		   assert.deepEqual ('"ham"', LOCAL_ENV['foo']);
	           assert.deepEqual(expected_output, translate.ast_to_js(ast, LOCAL_ENV));
		   delete LOCAL_ENV;
	       });

          test('AST to JS: Procedure: define: function assignment', 
               function (){
		   var ast = ['define', ['mult_us', 'x', 'y', 'z', null], ['*', 'x', 'y', 'z', null], null];
		   var expected_output = "var mult_us = function (x, y, z) {return (x*y*z);};";
                   console.log('input:', ast);
                   var LOCAL_ENV = {};
                   console.log('output 1: ', translate.ast_to_js(ast, LOCAL_ENV));
                   console.log('output 2: ' + "LOCAL_ENV['mult_us'](2, 3, 4) = " + 
			       LOCAL_ENV['mult_us'](2, 3, 4));
		   console.log('\n');
	           assert.deepEqual(expected_output, translate.ast_to_js(ast, LOCAL_ENV));
		   assert.deepEqual("mult_us(2, 3, 4);", LOCAL_ENV['mult_us'](2, 3, 4));
		   delete LOCAL_ENV['mult_us'];
	       });

          test('AST to JS: Procedure: if: return expression', 
               function (){
		   var ast = ['if', ['<', 2, 5, 8, null], ['+', 9, 9, null], ['-', 9, 9, null], null];
		   var expected_output = "function () { if ((2 < 5) && (5 < 8)) { return (9+9); } else { return (9-9); }}()";
                   console.log('input:', ast);                   
                   console.log('output:', translate.ast_to_js(ast));
		   console.log('\n');
	           assert.deepEqual(expected_output, translate.ast_to_js(ast));
	       });

          test('AST to JS: Procedure: if: return value', 
               function (){
		   var ast = ['if', ['<', 2, 5, 8, null], 0, 1, null];
		   var expected_output = "function () { if ((2 < 5) && (5 < 8)) { return 0; } else { return 1; }}()";
                   console.log('input:', ast);                   
                   console.log('output:', translate.ast_to_js(ast));
		   console.log('\n');
	           assert.deepEqual(expected_output, translate.ast_to_js(ast));
	       });

          test('AST to JS: procedure: cons: string to list', 
               function (){
		   console.log("Scheme : (cons \"hammer\" '(0 4))");
		   var input = ['cons', '\"hammer\"', ['QUOTE', [0, 4, null]], null];
		   var expected_ouput = '["hammer",0,4,null]';
		   console.log("input : ", input);
		   console.log("output: ", translate.ast_to_js(input));
	           assert.deepEqual(expected_ouput, translate.ast_to_js(input));
	       });

	  test('AST to JS: procedure: cons: quoted symbol to list', 
               function (){
		   console.log("Scheme : (cons \"hammer\" '(0 4))");
		   var input = ['cons', 'hammer', ['QUOTE', [0, 4, null]], null];
		   var expected_ouput = '[hammer,0,4,null]';
		   console.log("input : ", input);
		   console.log("output: ", translate.ast_to_js(input));
	           assert.deepEqual(expected_ouput, translate.ast_to_js(input));
	       });

	  test('AST to JS: procedure: cons: quoted list to quoted list', 
               function () {
		   console.log("Scheme : (cons \'(list 8 9) \'(0 4))");
		   var input = ['cons', ['QUOTE', ['list', 8, 9, null]], ['QUOTE', [0, 4, null]], null];
		   var expected_ouput = '[[list,8,9,null],0,4,null]';
		   console.log("input : ", input);
		   console.log("output: ", translate.ast_to_js(input));
	           assert.deepEqual(expected_ouput, translate.ast_to_js(input));
	       });
	  test('AST to JS: procedure: cons: evaled list to quoted list', 
               function () {
		   console.log("Scheme : (cons (cons 8 \'(9)) \'(0 4))");
		   var input = ['cons', ['cons', 8, ['QUOTE',[9, null]]], ['QUOTE', [0, 4, null]], null];
		   var expected_ouput = '[[8,9,null],0,4,null]';
		   console.log("input : ", input);
		   console.log("output: ", translate.ast_to_js(input, null));
	           assert.deepEqual(expected_ouput, translate.ast_to_js(input, null));
	       });

	  test('AST to JS: procedure: cons: dotted pair to list', 
               function () {
		   console.log("Scheme : (cons '(8 . 9) '(4))");
		   var input = ['cons', ['QUOTE', [8, 9]], ['QUOTE', [4, null]], null];
		   var expected_ouput = '[[8,9],4,null]';
		   console.log("input : ", input);
		   console.log("output: ", translate.ast_to_js(input));
	           assert.deepEqual(expected_ouput, translate.ast_to_js(input, null));
	       });

	  test('AST to JS: procedure: backquoted s-expressions: single escaped variable', 
               function () {
		   console.log("Scheme : `(define a ,x) // x=8, in `bindings` LOCAL_ENV");
		   var input = ['define', 'a', ['COMMA', 'x'], null];
		   var expected_ouput = ['define', 'a', 8, null];
                   var LOCAL_ENV = {
                       x: 8
                   };
		   console.log("input : ", input);
		   console.log("output: ", translate.expandbq(input, LOCAL_ENV));
	           assert.deepEqual(expected_ouput, translate.expandbq(input, LOCAL_ENV)); 
                   delete LOCAL_ENV;
	       });
 
 	  test('AST to JS: procedure: backquoted s-expressions: escaped expression and escaped var', 
               function () {
		   console.log("Scheme : `(if (< ,x ,(+ y 3)) 1 0) // x=8, y=92 in `bindings` LOCAL_ENV");
		   var input = ['if', ['<', ['COMMA', 'x'], ['COMMA', ['+', 'y', 3, null]], null], 1, 0, null];
		   var expected_ouput = ['if', ['<', 8, 95, null], 1, 0, null];
                   var LOCAL_ENV = {
                       x:8,
                       y:92
                   };
		   console.log("input : ", input);
		   console.log("output: ", translate.expandbq(input, LOCAL_ENV));
	           assert.deepEqual(expected_ouput, translate.expandbq(input, LOCAL_ENV)); 
                   delete LOCAL_ENV;
	       });
 
	  test('Scheme to JS: simple arithmetic', 
               function () {
		   var input = "(+ 6 77)";
		   var expected_ouput = "(6+77)";
                   var LOCAL_ENV = {};
		   console.log("input : ", input);
                   var lexed = lexer.tokenize(input);
                   var parsed = parser.parse(lexed);
                   var output = translate.ast_to_js(parsed, LOCAL_ENV);
		   console.log("output: ", output);
	           assert.deepEqual(expected_ouput, output);
                   delete LOCAL_ENV;
	       });

	  test('Scheme to JS: nested arithmetic', 
               function () {
		   var input = "(+ 6 77(- 27 9 11))";
		   var expected_ouput = "(6+77+(27-9-11))";
                   var LOCAL_ENV = {};
		   console.log("input : ", input);
                   var lexed = lexer.tokenize(input);
                   var parsed = parser.parse(lexed);
                   var output = translate.ast_to_js(parsed, LOCAL_ENV);
		   console.log("output: ", output);
	           assert.deepEqual(expected_ouput, output);
                   delete LOCAL_ENV;
	       });

	  // test('Scheme to JS: multiple statements', 
          //      function () {
	  //          var input = "(define x 27)(define y 9)(+ x y)";
	  //          var expected_ouput = "";
          //          var LOCAL_ENV = {};
	  //          console.log("input : ", input);
          //          var lexed = lexer.tokenize(input);
          //          var parsed = parser.parse(lexed);
          //          console.log("parsed: ", parsed);
          //          var output = translate.ast_to_js(parsed, LOCAL_ENV);
	  //          console.log("output: ", output);
	  //          // assert.deepEqual(expected_ouput, output);
          //          delete LOCAL_ENV;
	  //      });

  

      });



// suite('Macros: ', 
//       function () {
//           test('Given a macro expression, return an AST object ', 
//                function () {
//                    var macro_expand = require("../macro_expand.js");
//                    var macro_args = ['"string_of_characters"', 'length'];

//                    var reverse_macro = { 
//                        args: ['a', 'b'], // this is the args list passed to reverse
//                        expression: [ '`(', ',b',',a', ')'] // this is the macro expression to expand
//                    };

//                    var expected_output = {
//                        'func': 'length',
//                        'args': ['"string_of_characters"']
//                    };
//                    var expanded = macro_expand.macro_expand(reverse_macro, macro_args);
//                    assert.deepEqual(expanded, expected_output);
//                    // assert.deepEqual(1, 1);
//                });
//       });

// (let ((y 8)(z 7)) (* y z) (+ y z))

