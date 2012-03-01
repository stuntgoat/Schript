// tools.js
// convenience functions are here to save space in other modules

//var predicates = require('./predicates.js');

function merge_objects(objs) {
    // Accepts an array of objects; Returns: a single object
    // with keys in the previous objects overwritten by the 
    // next objects in the Array.
    var obj_stack = {};
    for (i in objs) {
	for (o in objs[i]) {
	    if (objs[i].hasOwnProperty(o)) {
		obj_stack[o] = objs[i][o];
	    }	
	}
    }

    return obj_stack;
}
exports.merge_objects = merge_objects;

function merge_lambda_args(obj) {
    // Accepts: an object in the form { 'func': 'arg0', 'args': ['arg1', 'argn']}
    // Returns: a single JavaScript Array with the value of each 
    var arg_stack = [];
    var arg_list = obj['args'];
    arg_stack.push(obj['func']);
    if (arg_list.length === 0) {
	return arg_stack;
    } else {
	for (var i in arg_list) {
	    arg_stack.push(arg_list[i]);
	}
    }
    return arg_stack;
}
exports.merge_lambda_args = merge_lambda_args;

tools = {
    merge_objects: merge_objects
}

exports.tools = tools;
