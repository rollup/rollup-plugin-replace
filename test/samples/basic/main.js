if ( ENV !== 'production' ) {
	console.log( 'running in debug mode...' );
} else {
	console.log( 'running...' );
}

if ( BUILD === 'beta' ) {
	console.log( 'authorized testers build...' )
}

console.log( 'version:', BUILD_VERSION )
