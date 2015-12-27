import * as assert from 'assert';
import * as path from 'path';
import { rollup } from 'rollup';
import replace from '..';

process.chdir( __dirname );

describe( 'rollup-plugin-replace', () => {
	it( 'replaces strings', () => {
		return rollup({
			entry: 'samples/basic/main.js',
			plugins: [
				replace({
					ENV: "'production'"
				})
			]
		}).then( bundle => {
			const generated = bundle.generate();
			const code = generated.code;

			assert.ok( code.indexOf( "'production' !== 'production'" ) !== -1 );
		});
	});

	it( 'allows replacement to be a function', () => {
		return rollup({
			entry: 'samples/relative/main.js',
			plugins: [
				replace({
					__filename: id => `'${id.slice( path.resolve( __dirname, 'samples/relative' ).length + 1 )}'`
				})
			]
		}).then( bundle => {
			const generated = bundle.generate({ format: 'cjs' });
			const code = generated.code;

			const fn = new Function( 'module', 'exports', code );
			const module = { exports: {} };
			fn( module, module.exports );

			assert.equal( module.exports.foo, 'dir/foo.js' );
			assert.equal( module.exports.bar, 'main.js' );
		});
	});

	// TODO tests for delimiters, sourcemaps, etc
});
