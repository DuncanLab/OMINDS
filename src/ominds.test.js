const helpers = require('../public/helpers')
const main = require('../public/ominds')
 
// make sure that eucDistance works
test('Euclydian Distance base case - matched with Scipy', () => {
    expect(helpers.eucDistance([2], [2])).toBe(0);
  });

test('Euclydian Distance 3 items - matched with Scipy', () => {
  expect(helpers.eucDistance([1, 0, 0], [0, 1, 0])).toBe(1.4142135623730951);
});

test('Euclydian Distance 3 items v2 - matched with Scipy', () => {
  expect(helpers.eucDistance([1, 1, 0], [0, 1, 0])).toBe(1.0);
});

// test the core ominds scripts
// test('Euclydian Distance 3 items v2 - matched with Scipy', () => {
//   expect(main.ominds()).toBe(1.0);
// });
