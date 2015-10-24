var MagicString = require( 'magic-string' );
var createFilter = require( 'rollup-pluginutils' ).createFilter;

function escape ( str ) {
	return str.replace( /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&' );
}

module.exports = function replace ( options ) {
	options = options || {};

	var replacers = options.replace || options;
	var delimiters = ( options.delimiters || [ '', '' ] ).map( escape );
	var pattern = new RegExp( delimiters[0] + '(' + Object.keys( replacers ).join( '|' ) + ')' + delimiters[1], 'g' );

	var filter = createFilter( options.include, options.exclude );

	return {
		transform: function ( code, id ) {
			if ( !filter( id ) ) return null;

			var hasReplacements = false;

			var magicString = new MagicString( code );
			var match;

			while ( match = pattern.exec( code ) ) {
				hasReplacements = true;

				var start = match.index;
				var end = start + match[0].length;
				var replacement = String( replacers[ match[1] ] );

				magicString.overwrite( start, end, replacement );
			}

			if ( !hasReplacements ) return null;

			var result = { code: magicString.toString() };
			if ( options.sourceMap ) result.map = magicString.generateMap({ hires: true });

			return result;
		}
	};
};
