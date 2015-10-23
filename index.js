var MagicString = require( 'magic-string' );
var minimatch = require( 'minimatch' );

function ensureArray ( thing ) {
	return thing ?
		( Object.prototype.toString.call( thing ) === '[object Array]' ? thing : [ thing ] ) :
		[];
}

function createFilter ( include, exclude ) {
	return function ( id ) {
		var included = !include.length;

		include.forEach( function ( pattern ) {
			if ( pattern.test( id ) ) included = true;
		});

		exclude.forEach( function ( pattern ) {
			if ( pattern.test( id ) ) included = false;
		});

		return included;
	};
}

function escape ( str ) {
	return str.replace( /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&' );
}

module.exports = function replace ( options ) {
	options = options || {};

	var replacers = options.replace || options;
	var delimiters = ( options.delimiters || [ '', '' ] ).map( escape );
	var pattern = new RegExp( delimiters[0] + '(' + Object.keys( replacers ).join( '|' ) + ')' + delimiters[1], 'g' );

	var include = ensureArray( options.include ).map( minimatch.makeRe );
	var exclude = ensureArray( options.exclude ).map( minimatch.makeRe );
	var filter = createFilter( include, exclude );



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
