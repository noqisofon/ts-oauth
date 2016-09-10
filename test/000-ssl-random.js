const crypto = require( 'crypto' );

const tape = require( 'tape' );

const OpenSSL = {
    Random: {
        random_bytes: function (size /* : number */) {
            return crypto.randomBytes( size );
        }
    }
};


tape( 'OpenSSL', t => {
    t.ok( OpenSSL !== undefined );

    t.end();
} );

tape( 'OpenSSL.Random', t => {
    t.ok( OpenSSL.Random !== undefined );

    t.end();
} );

tape( 'OpenSSL.Random.random_bytes', t => {
    let bytes = OpenSSL.Random.random_bytes( 32 );

    console.log( bytes );
    
    t.ok( bytes.length == 32 );

    t.end();
} );
