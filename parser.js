// parser.js
// Functions to create an abstract syntax tree from an array of Scheme tokens.
// exports: parse


function is_lparen(item) {
    if (item === '(') {
	return true;
    } else {
	return false;
    }
}

function is_rparen(item) {
    if (item === ')') {
	return true;
    } else {
	return false;
    }
}

function pre_parse(tokenized) {
    // Accepts: an array of Scheme tokens. Returns: a JavaScript array ofScheme
    //  functions and arguments; arguments that are other s-expressions will be
    // nested JavaScript arrays.
    var depth = 0;
    var stack = {};
    for (var i in tokenized) {
	if (is_lparen(tokenized[i])) {
	    depth += 1;
	    stack[depth] = [];
	} else if (is_rparen(tokenized[i])) {
	    if (depth !== 1) {
		stack[depth-1].push(stack[depth]);
		delete stack[depth];
		depth -=1;		
	    }
	} else {
	    stack[depth].push(tokenized[i]);
	}
    }
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
    var tester = Object.prototype.toString;
    for (var i in parsed) {
	if(i === '0') {
	    stack['func'] = parsed[i];
	    stack['args'] = [];
	} else if (tester.call(parsed[i]) === '[object Array]') {
	    stack['args'].push(ast(parsed[i]));
	} else {
	    stack['args'].push(parsed[i]);
	}
    }
    return stack;
}

function parse(tokenized) {
    // export parse    
    // accept a tokenized JavaScript Array and call pre_parse and ast on it
    var parsed = pre_parse(tokenized);
    return ast(parsed);
}

exports.parse = parse;
