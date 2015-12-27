var assert = require( 'assert' );
var rollup = require( 'rollup' );
var replace = require( '..' );
var path = require( 'path' );

process.chdir( __dirname );

describe( 'rollup-plugin-replace', function () {
	it( 'replaces strings', function () {
		return rollup.rollup({
			entry: 'samples/basic/main.js',
			plugins: [
				replace({
					ENV: "'production'"
				})
			]
		}).then( function ( bundle ) {
			const generated = bundle.generate();
			const code = generated.code;

			assert.ok( code.indexOf( "'production' !== 'production'" ) !== -1 );
		});
	});

	it( 'allows replacement to be a function', function () {
		return rollup.rollup({
			entry: 'samples/relative/main.js',
			plugins: [
				replace({
					__filename: function ( id ) {
						return '"' + id.slice( path.resolve( __dirname, 'samples/relative' ).length + 1 ) + '"';
					}
				})
			]
		}).then( function ( bundle ) {
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
