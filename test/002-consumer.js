const tape         = require( 'tape' );

const { Consumer } = require( '../' );

tape( 'Consumer', t => {
    t.ok( Consumer !== undefined );

    t.end();
} );
