Schript is a Scheme to JavaScript translator. Schript is written in JavaScript using Node.js.


EXAMPLES:

    > var input = "(define x 27) (define y 9) (+ x y)";
    > console.log(schript(input));
    var x = 27;       
    var y = 9;
    (x+y)
  

    > var input = "(define (recurs x) (if (= x 0) x (+ x (recurs (- x 1)))))";
    > console.log(schript(input));
    var recurse = function (x) {return function () { if ((x === 0)) { return x; } else { return (x+recurse(x-1)); }}();};


There are 29 tests, using Mocha and Chai test and assertion libraries, respectively.
