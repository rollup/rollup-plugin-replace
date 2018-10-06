import foo from './dir/foo.js';

var bar = __filename;

assert.equal(foo, 'dir/foo.js');
assert.equal(bar, 'main.js');
