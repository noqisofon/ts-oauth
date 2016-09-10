const tape         = require( 'tape' );

const { Consumer, ConsumerToken } = require( '../lib' );

tape( 'ConsumerToken', t => {
    t.ok( ConsumerToken !== undefined );

    t.end();
} );
