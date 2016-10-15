var assert = require( 'assert' );
var rollup = require( 'rollup' );
var replace = require( '..' );

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

	it( 'matches most specific variables', function () {
		return rollup.rollup({
			entry: 'samples/basic/main.js',
			plugins: [
				replace({
					BUILD: "'beta'",
					BUILD_VERSION: "'1.0.0'"
				})
			]
		}).then( function ( bundle ) {
			const generated = bundle.generate();
			const code = generated.code;

			assert.ok( code.indexOf( "'beta' === 'beta'" ) !== -1 );
			assert.ok( code.indexOf( "console.log( 'version:', '1.0.0' )" ) !== -1 );
		});
	});

	// TODO tests for delimiters, sourcemaps, etc
});
