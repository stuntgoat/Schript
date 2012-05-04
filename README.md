
**Schript is a Scheme to JavaScript translator.**



Schript is written in JavaScript using Node.js.



EXAMPLES:

    > var input = "(define x 27) (define y 9) (+ x y)";
    > console.log(schript(input));
    var x = 27;       
    var y = 9;
    (x+y)
  

    > var input = "(define (recurse x) (if (= x 0) x (+ x (recurse (- x 1)))))";
    > console.log(schript(input));
    var recurse = function (x) {return function () { if ((x === 0)) { return x; } else { return (x+recurse(x-1)); }}();};

    > var input = "(lambda (x) (* x x))";
    > console.log(schript(input));
    function(x){ return (x*x)};



There are 40 tests, using Mocha and Chai, which are test and assertion libraries, respectively.

***website coming soon!***
[www.schript.org](http://www.schript.org)
