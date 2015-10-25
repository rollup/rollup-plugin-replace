var gobble = require( 'gobble' );
var babel = require( 'rollup-plugin-babel' );

module.exports = gobble([
	gobble( 'src' ).transform( 'rollup', {
		entry: 'index.js',
		dest: 'rollup-plugin-replace.cjs.js',
		plugins: [ babel() ],
		format: 'cjs',
		external: [ 'magic-string', 'rollup-pluginutils' ]
	}),

	gobble( 'src' ).transform( 'rollup', {
		entry: 'index.js',
		dest: 'rollup-plugin-replace.es6.js',
		plugins: [ babel() ],
		format: 'es6',
		external: [ 'magic-string', 'rollup-pluginutils' ]
	})
]);
