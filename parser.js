// parser.js
// Functions to create an abstract syntax tree from an array of Scheme tokens.
// exports: parse

var predicates = require('./predicates.js');

function pre_parse(tokenized) {
    // Accepts: an array of Scheme tokens. Returns: a JavaScript array of Scheme
    //  functions and arguments; arguments that are other s-expressions will be
    // nested JavaScript arrays.
    var depth = 0;
    var stack = {};
//    console.log(tokenized);
    for (var i in tokenized) {
//	console.log("tokenized[i]: ", tokenized[i]);
	if (predicates.is_lparen(tokenized[i])) {
	    depth += 1;
	    stack[depth] = [];
	} else if (predicates.is_rparen(tokenized[i])) {
	    if (depth !== 1) {
		stack[depth-1].push(stack[depth]);
		delete stack[depth];
		depth -=1;		
	    }
	} else {
	    stack[depth].push(tokenized[i]);
	}
    }
//    console.log("Stack Depth:", stack[depth]);
    return stack[depth];
}

// TODO: rename to parse?
function ast(parsed) {
    // Accepts: a JavaScript array of Scheme functions and values. Arguements
    //  that were Scheme s-expressions will be nested JavaScript arrays. Scheme
    // functions and vars are strings; if float(var) is true, return float.
    // Returns: an abstract syntax tree as a JavaScript object; with
    //  {'func': <scheme function>, 'args': <scheme arguments>}, where <scheme
    //  arguments> can be another JavaScript object with the same format.
    var stack = {};
    for (var i in parsed) {
	if(i === '0') {
	    stack['func'] = parsed[i];
	    stack['args'] = [];
	} else if (predicates.is_array(parsed[i])) {
	    stack['args'].push(ast(parsed[i]));
	} else {
	    stack['args'].push(parsed[i]);
	}
    }
    return stack;
}
exports.ast = ast;

function parse(tokenized) {
    // export parse    
    // accept a tokenized JavaScript Array and call pre_parse and ast on it
    var parsed = pre_parse(tokenized);
    return ast(parsed);
}
exports.parse = parse;

