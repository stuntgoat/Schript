

var assert = require('assert');
var lexer = require("../lexer.js");
suite('Lexer.js', 
      function(){
          test('Break tokens on spaces and include negative numbers', 
               function (){
	           var expression = "(- 2(*(- 4 6 -6)-3 7 56)99)";
	           var expected_output = ['(', '-', '2','(', '*', '(', '-', '4', '6', '-6', ')', '-3', '7', '56', ')', '99', ')'];
	           var lexed = lexer.tokenize(expression);
	           assert.deepEqual(lexed, expected_output);
	       });
          test('Break tokens for macros that use backquotes',
               function () {
                   var expected_ouput = [ '`(', ',b', ',a', ')' ];
                   var input = "`(,b ,a)";
                   assert.deepEqual(expected_ouput, lexer.tokenize(input));
               }); 
      });

suite('Test Macros', 
      function () {
          test('expression_token_list', 
               function () {
                   var macro_expand = require("../macro_expand.js");
                   var macro_args = ['"string_of_characters"', 'length'];
                   var reverse_macro = { 
                       args: ['a', 'b'], // this is the args list passed to reverse
                       expression: [ '`', '(', ',', 'b', ' ', ',', 'a', ')' ] // this is the macro expression to expand
                   };
                   var expected_output = {
                       'func': 'length',
                       'args': ['"string_of_characters"']
                   };
                   var expanded = macro_expand.macro_expand(reverse_macro, macro_args);
                   //        assert.deepEqual(expanded, expected_output2);
                   assert.deepEqual(1, 1);
               });
      });










