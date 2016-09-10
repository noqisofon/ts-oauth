const buffer_1 = require( 'buffer' );
const crypto = require( 'crypto' );

const tape = require( 'tape' );

const OpenSSL = {
    Random: {
        random_bytes: function (size /* : number */) {
            return crypto.randomBytes( size );
        }
    }
};

const Base64 = (function () {

    function Base64() {
    }

    Base64.encode64 = function (text) {
        let buffer;

        if ( buffer_1.Buffer.isBuffer( text ) ) {
            buffer = text;
        } else {
            buffer = buffer_1.Buffer.from(text);
        }
        return buffer.toString('base64');
    };

    return Base64;
}() );

tape( 'Base64', t => {
    t.ok( Base64 !== undefined );

    t.end();
} );

tape( 'Base64.encode64', t => {
    {
        let actual = Base64.encode64( 'Hello, World!' );

        t.ok( actual.length > 0 );
        t.equal( actual, 'SGVsbG8sIFdvcmxkIQ==' );
    }

    {
        let actual = Base64.encode64( OpenSSL.Random.random_bytes( 32 ) );

        t.ok( actual.length > 0 );
    }

    {
        let actual = Base64.encode64( OpenSSL.Random.random_bytes( 32 ) ).replace( /\W+/g, '' );

        t.ok( actual.length > 0 );
        t.notOk( /\W+/g.test( actual ) );
    }

    t.end();
} );
