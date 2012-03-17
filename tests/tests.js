

var assert = require('/usr/local/lib/node_modules/chai').assert;

var lexer = require("../lexer.js");
var parser = require("../parser.js");
suite('Lexer.js', 
      function(){
          test('Break tokens on spaces and include negative numbers', 
               function (){
	           var expression = "(- a(*(- 4 -6)-3 4)99)";
	           var expected_output = ['(', '-', 'a', '(', '*', '(', '-', 4, -6, ')', -3, 4, ')', 99, ')'];
	           
                   console.log('input:', expression);                   
                   console.log('lexed:', lexer.tokenize(expression));
		   console.log('\n');
	           assert.deepEqual(expected_output, lexer.tokenize(expression));
	       });
          

          test('Break tokens for macros that use backquotes',
               function () {
                   var expected_output = [ '`', '(', ',', 'b', ',', 'a', ')' ],
                   input = "`(,b ,a)";
		   console.log('input:', input);                   
                   console.log('lexed:', lexer.tokenize(input));
		   console.log('\n');
                   assert.deepEqual(expected_output, lexer.tokenize(input));
               }); 

          test('Comma within backquote, un-escaping opening paren',
               function () {
                   var expected_output = [ '`', '(', ',', 'b', ',', '(', '+', 'zip', 'zop', ')', ')' ];
                   var input = "`(,b ,(+ zip zop))";
		   console.log('input:', input);                   
                   console.log('lexed:', lexer.tokenize(input));
		   console.log('\n');
                   assert.deepEqual(expected_output, lexer.tokenize(input));

               });
      });

suite('Parser.js', 
      function(){
          test('Basic arithmetic', 
               function (){
		   var ast = ['+', 5, 2, ['-', 3, 6, 8, null], null];
		   var expected_output = "(5+2+(3-6-8))";
	           
                   console.log('input:', ast);                   
                   console.log('lexed:', parser.ast_to_js(ast));
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











