const assert = require('assert');
const path = require('path');
const { rollup } = require('rollup');
const replace = require('../dist/rollup-plugin-replace.cjs.js');

process.chdir( __dirname );

describe('rollup-plugin-replace', () => {
	it('replaces strings', async () => {
		const bundle = await rollup({
			input: 'samples/basic/main.js',
			plugins: [
				replace({
					ANSWER: '42'
				})
			]
		});

		const { code } = await bundle.generate({ format: 'es' });
		assert.equal(code.trim(), 'console.log(42);');
	});

	it('allows replacement to be a function', async () => {
		const bundle = await rollup({
			input: 'samples/relative/main.js',
			plugins: [
				replace({
					__filename: id => `'${id.slice(path.resolve(__dirname, 'samples/relative').length + 1)}'`
				})
			]
		});

		const { code } = await bundle.generate({ format: 'cjs' });

		const fn = new Function('module', 'exports', code);
		const module = { exports: {} };
		fn(module, module.exports);

		assert.equal(module.exports.foo, 'dir/foo.js');
		assert.equal(module.exports.bar, 'main.js');
	});

	it( 'matches most specific variables', async () => {
		const bundle = await rollup({
			input: 'samples/longest-first/main.js',
			plugins: [
				replace({
					BUILD: 'beta',
					BUILD_VERSION: '1.0.0'
				})
			]
		})

		const { code } = await bundle.generate({ format: 'es' });

		assert.equal(code.trim(), `console.log('beta version 1.0.0');`);
	});

	// TODO tests for delimiters, sourcemaps, etc
});
