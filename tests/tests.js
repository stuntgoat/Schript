

var assert = require('/usr/local/lib/node_modules/chai').assert;
var lexer = require("../lexer.js");
suite('Lexer.js', 
      function(){
          test('Break tokens on spaces and include negative numbers', 
               function (){
	           var expression = "(- a(*(- 4 -6)-3 4)99)";
	           var expected_output = ['(', '-', 'a', '(', '*', '(', '-', 4, -6, ')', -3, 4, ')', 99, ')'];
	           var lexed = lexer.tokenize(expression);
                   console.log('expression', expression);                   
                   console.log('lexed', lexed);
                   console.log('expec', expected_output);
	           assert.deepEqual(lexed,  expected_output);
	       });
          

          test('compare to Arrays',
               function () {
                   var expected_ouput = ['8', '8'];
                   var output = ['8', '8'];
                   assert.deepEqual(output, expected_ouput);
               }); 

          // test('Break tokens for macros that use backquotes',
          //      function () {
          //          var expected_ouput = [ '`(', ',b', ',a', ')' ];
          //          var input = "`(,b ,a)";
          //          assert.deepEqual(expected_ouput, lexer.tokenize(input));
          //      }); 

          // test('Comma within backquote, un-escaping opening paren',
          //      function () {
          //          var expected_ouput = [ '`(', ',b', ',(', '+', 'zip', 'zop', ')', ')' ];
          //          var input = "`(,b ,(+ zip zop))";
          //          assert.deepEqual(expected_ouput, lexer.tokenize(input));
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











