import foo from './dir/foo.js';

var bar = __filename;

// To work around windows issues
assert.equal(foo.slice(0, 3), 'dir');
assert.equal(foo.slice(-6), 'foo.js');
assert.equal(foo.length, 10);
assert.equal(bar, 'main.js');
