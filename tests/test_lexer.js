
    

var lexer = require('../lexer.js');
var assert = require('assert');

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
                   var lexer = require("../lexer.js");
                   var expected_ouput = [ '`(', ',b', ',a', ')' ];
                   var input = "`(,b ,a)";
                   assert.deepEqual(expected_ouput, lexer.tokenize(input));
               }); 
      });

