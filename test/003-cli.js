const tape         = require( 'tape' );

const cli = require( '../lib/cli' );

tape( 'oauth', t => {
    t.equal( cli.OUT_OF_BAND, 'oob' );
    t.equal( cli.VERSION, '0.1.0' );

    t.end();
} );
