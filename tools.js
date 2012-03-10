// tools.js
// convenience functions are here to save space in other modules

//var predicates = require('./predicates.js');

function zip(array1, array2) {
    // Does not insure that passed in arrays are of equal length
    var zipped = [];    
    var len = array1.length;
    for (var i=0; i<len; i++) {
        zipped.push([array1[i], array2[i]]);
    }
    return zipped;
}

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
exports.merge_objects = merge_objects;
exports.zip = zip;

