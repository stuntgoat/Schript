// tests.js

var assert = require('/usr/local/lib/node_modules/chai').assert;

var lexer = require("../lexer.js");
var parser = require("../parser.js");
var predicates = require("../predicates.js");

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

suite('Parser.js',  // These tests are not for the parser !!!
      function(){
	  test('Basic arithmetic', 
               function (){
		   var ast = ['/', 5, 2, null];
		   var expected_output = "(5/2)";
	           
                   console.log('input:', ast);                   
                   console.log('output:', parser.ast_to_js(ast));
		   console.log('\n');
	           assert.deepEqual(expected_output, parser.ast_to_js(ast));
	       });          

          test('Basic arithmetic; nested expression', 
               function (){
		   var ast = ['+', 5, 2, ['-', 3, 6, 8, null], null];
		   var expected_output = "(5+2+(3-6-8))";
	           
                   console.log('input:', ast);                   
                   console.log('output:', parser.ast_to_js(ast));
		   console.log('\n');
	           assert.deepEqual(expected_output, parser.ast_to_js(ast));
	       });          
	  test('Basic comparisons; 2 arguments', 
               function (){
		   var ast = ['>', 3, 2, null];
		   var expected_output = "(3 > 2)";
		   console.log('input:', ast);                   
		   console.log('output:', parser.ast_to_js(ast));
		   console.log('\n');
	           assert.deepEqual(expected_output, parser.ast_to_js(ast));
	      });
              
          test('Basic comparisons; 3 arguments', 
               function (){
		   var ast = ['>', 3, 2, 1, null];
		   var expected_output = "(3 > 2) && (2 > 1)";
	           
                   console.log('input:', ast);                   
                   console.log('output:', parser.ast_to_js(ast));
		   console.log('\n');
	           assert.deepEqual(expected_output, parser.ast_to_js(ast));
	       });

          test('Basic comparisons; 4 arguments', 
               function (){
		   var ast = ['>', 3, 2, 1, 0, null];
		   var expected_output = "(3 > 2) && (2 > 1) && (1 > 0)";
	           
                   console.log('input:', ast);                   
                   console.log('output:', parser.ast_to_js(ast));
		   console.log('\n');
	           assert.deepEqual(expected_output, parser.ast_to_js(ast));
	       });
          test('Procedure: define: variable assignment', 
               function (){
		   var ast = ['define', 'foo', 2, null];
		   var expected_output = "var foo = 2;";
                   console.log('input:', ast);                   
                   console.log('output 1:', parser.ast_to_js(ast));
		   console.log('output 2: ' + "parser.bindings['foo'] = " + parser.bindings['foo']);
		   console.log('\n');
		   assert.deepEqual (2, parser.bindings['foo']);
	           assert.deepEqual(expected_output, parser.ast_to_js(ast));
		   delete parser.bindings['foo'];
	       });

          test('Procedure: define: function assignment', 
               function (){
		   var ast = ['define', ['mult_us', 'x', 'y', 'z', null], ['*', 'x', 'y', 'z', null], null];
		   var expected_output = "var mult_us = function (x, y, z) {return (x*y*z);};";
                   console.log('input:', ast);                   
                   console.log('output 1: ', parser.ast_to_js(ast));
                   console.log('output 2: ' + "parser.bindings['mult_us'](2, 3, 4) = " + 
			       parser.bindings['mult_us'](2, 3, 4));
		   console.log('\n');

	           assert.deepEqual(expected_output, parser.ast_to_js(ast));
		   assert.deepEqual("mult_us(2, 3, 4);", parser.bindings['mult_us'](2, 3, 4));
		   delete parser.bindings['mult_us'];
	       });

          test('Procedure: if: return expression', 
               function (){
		   var ast = ['if', ['<', 2, 5, 8, null], ['+', 9, 9, null], ['-', 9, 9, null], null];
		   var expected_output = "function () { if ((2 < 5) && (5 < 8)) { return (9+9); } else { return (9-9); }}()";
                   console.log('input:', ast);                   
                   console.log('output:', parser.ast_to_js(ast));
		   console.log('\n');
	           assert.deepEqual(expected_output, parser.ast_to_js(ast));
	       });

          test('Procedure: if: return value', 
               function (){
		   var ast = ['if', ['<', 2, 5, 8, null], 0, 1, null];
		   var expected_output = "function () { if ((2 < 5) && (5 < 8)) { return 0; } else { return 1; }}()";
                   console.log('input:', ast);                   
                   console.log('output:', parser.ast_to_js(ast));
		   console.log('\n');
	           assert.deepEqual(expected_output, parser.ast_to_js(ast));
	       });

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
