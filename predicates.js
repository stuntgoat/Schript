// predicates.js

var tester = Object.prototype.toString;


function is_dotted_pair(AST) {
    return((AST.length == 3) && (AST[1] === "."));
}

function is_backquote(item) {
    return item === '`';
}

function is_forwardquote(item) {
    return item === "'";
}

function is_comma(item) {
    return item === ',';
}

function is_lparen(item) {
    return item === '(';
}

function is_rparen(item) {
    return item === ')';
}

function is_forward_quoted(node) { // inside ast
    return (node[0] === 'QUOTE');
}

function is_backquoted(node) {
    return (node[0] === 'BACKQUOTE');
}

function is_comma_escaped(node) {
    return (node[0] === 'COMMA');
}

function is_ast_meta_elem(node) {
    return is_comma_escaped(node) || is_backquoted(node) || is_forward_quoted(node);
}

function is_quoted(node) {
    return ((is_forward_quoted(node)) || (is_backquoted(node)));
}

function is_object(test) {
    return tester.call(test) === '[object Object]';
}
function is_null(test) {
    return tester.call(test) === '[object Null]';
}

function is_array(test) {
    return tester.call(test) === '[object Array]';
}

function is_string(test) {
    return tester.call(test) === '[object String]';
}

function is_number(test) {
    return tester.call(test) === '[object Number]';
}

function is_function(test) {
    return tester.call(test) === '[object Function]';
}

function is_boolean(test) {
    return tester.call(test) === '[object Boolean]';
}

function is_quoted_twice(string) {
    // check for two sets of quotes at the beginning and ending of a string
    var beginning = false;
    var ending = false;
    var beginning_group;    
    var ending_group;    
    var quote_test = /(\'\")|(\"\')|(\"\")|(\'\')/g;
    string.replace(quote_test, 
		   function () {
		       if (arguments[arguments.length-2] == 0) {
			   // acquire beginning group
			   beginning = true;	   
		       }
		       if (arguments[arguments.length - 1].length - 2 == arguments[arguments.length - 2]){
			   // acquire end group
			   ending = true;
		       }
		   });
    if ((beginning == true) && (ending == true)) { // check that groups match
	return true;
    } else {
	return false;
    }
}

function is_quoted_once(string) {
    // check for a single quote( either ' or " ) at the beginning and end of a string
    var quote_test = /(\')|(\")/g;
    var beginning = false;
    var ending = false;
    string.replace(quote_test, 
		   function () {
		       if (arguments[arguments.length-2] == 0) {
			   beginning = true;	   
		       }
		       if (arguments[arguments.length - 1].length - 2 == arguments[arguments.length -1]){
			   ending = true;
		       }
		   });
    if ((beginning == true) && (ending == true)) {
	return true;
    } else {
	return false;
    }
}

exports.is_dotted_pair = is_dotted_pair;
exports.is_backquote = is_backquote;
exports.is_forwardquote = is_forwardquote;
exports.is_quoted_twice = is_quoted_twice;
exports.is_quoted_once = is_quoted_once;
exports.is_comma = is_comma;
exports.is_lparen = is_lparen;
exports.is_rparen = is_rparen;
exports.is_object = is_object;
exports.is_null = is_null;
exports.is_array = is_array;
exports.is_string = is_string;
exports.is_number = is_number;
exports.is_function = is_function;
exports.is_quoted = is_quoted;
exports.is_forward_quoted = is_forward_quoted;
exports.is_backquoted = is_backquoted;
exports.is_comma_escaped = is_comma_escaped;
exports.is_ast_meta_elem = is_ast_meta_elem;


// console.log("given: ", '\""hammer"\"'); 
// console.log(double_to_single_quoted('"hammer"'));

// console.log("given: ", '"\"hammer"\"'); 
// console.log(double_to_single_quoted('"hammer"'));

// console.log("given: ", '"\"hammer\""'); 
// console.log(double_to_single_quoted('"hammer"'));


// console.log("given: ", '"hammer"'); 
// console.log(single_to_none('"hammer"'));

// console.log("given: ", "'hammer'"); 
// console.log(single_to_none("'hammer'"));
