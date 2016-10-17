const one = require( 'one' );

if ( ENV !== 'production' ) {
	console.log( 'running in debug mode...' );
} else {
	console.log( 'running...' );
}

console.log( 'dependency:', one );
