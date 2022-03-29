// a file of helper functions for electron.js
// Built to be unit-tested

function eucDistance(a, b) {
  // ensure type of both arrays
  // console.log("input array a: ", a)
  // console.log("input array b: ", b)
  let array1 = a.map(Number);
  let array2 = b.map(Number);
  return (
    array1
      .map((x, i) => Math.abs(x - array2[i]) ** 2) // square the difference
      .reduce((sum, now) => sum + now) ** // sum
    (1 / 2)
  );
}

// export functions for use and unit testing
exports.eucDistance = eucDistance;
