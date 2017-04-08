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

	it( 'respects word boundaries', function () {
		return rollup.rollup({
			entry: 'samples/basic/main.js',
			plugins: [
				replace({
					ENV: "'production'",
					BUILD: "'beta'"
				})
			]
		}).then( function ( bundle ) {
			const generated = bundle.generate();
			const code = generated.code;

			assert.ok( code.indexOf( "console.log( 'channel:', 'beta' )" ) !== -1 );
			assert.ok( code.indexOf( "...REBUILDING..." ) !== -1 );
		});
	});

	// TODO tests for delimiters, sourcemaps, etc
});
