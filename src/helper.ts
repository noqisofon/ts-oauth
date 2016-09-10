import crypt from 'crypt';
import { Buffer } from 'buffer';

class Base64 {
    static encode64(text : string) {
        let buffer = Buffer.from( text );

        return buffer.toString( 'base64' );
    }
}

const OpenSSL = {
    Random: {
        random_bytes: function (size : number) {
            return crypto.randomBytes( size );
        }
    }
};

function is_a_p(that, type) {
    if ( type === undefined ) {
        return false;
    }
    if ( that === null || that === undefined ) {
        return false;
    }
    return that.constructor === type;
}


function create_object(params) {
    let ret = {};

    for ( let key in params ) {
        ret[key] = params[key];
    }

    return ret;
}

export class Helper {
    escape(value : string) : string {
        return encodeURIComponent( text ).
            replace( /\!/g, '%21' ).
            replace( /\*/g, '%2A' ).
            replace( /\'/g, '%27' ).
            replace( /\(/g, '%28' ).
            replace( /\)/g, '%29' );
    }

    generate_key(size : number = 32) : string {
        return Base64.encode64( OpenSSL.Random.random_bytes( size ) ).replace( /\W/, '' );
    }

    generate_timestamp() : string {
        // Ruby の Time#to_i は経過秒数を返すため。
        return ( Date.now() / 1000 ).toString();
    }

    normalize(params) : string {
        let params_keys = Object.keys( params );

        let sorted_params = params_keys.sort().map( key => {
            let values = params[key];
            
            if ( is_a_p( values, Array ) ) {
                // make sure the array has an element so we don't lose the key
                if ( values.length == 0 ) {
                    values.push( null );
                }
                // multiple values were provided for a single key
                return values.sort.map( v => [ this.escape( key ), this.escape( v ) ].join( '=' ) );

            } else if ( is_a_p( values, Map ) || is_a_p( values, Object ) ) {
                return this.normalize_nested_query( values, key );
            } else {
                return [ this.escape( key ), this.escape( v ) ].join( '=' );
            }
        } );

        return sorted_params.join( '&' );
    }

    normalize_nested_query(value, prefix = null) : string {
        if ( is_a_p( value, Array ) ) {
            return value.map( v => normalize_nested_query( v, `${prefix}[]` ) ).sort();
        } else if ( is_a_p( value, Object ) ) {
            let keys = Object.keys( value );

            return keys.map( k => {
                let v = value[k];

                return normalize_nested_query( v, prefix ? `${prefix}[${k}]` : k );
            } ).sort();
        }

        return [ this.escape( prefix ), this.escape( value ) ].join( '=' );
    }

    parse_header(header) {
        // decompose
        let params = header.slice( 6, header.length ).split( /[,=&]/ );

        // odd number of arguments - must be a malformed header
        if ( params.length %2 != 0 ) {
            throw new Problem( 'Invalid authrorization header' );
        }

        params = params.map( v => {
            // strip and unescape
            let val = this.unescape( v.trim() );
            // strip quotes
            return val.replace( /^\"(.*)\"$/, '\1' );
        } );
        return create_object( params );
    }

    stringify_keys(obj) {
        let new_h = {};

        Object.keys( obj ).forEach( key => {
            new_h[key.toString()] = obj[key];
        } );

        return new_h;
    }

    decode(text) {
        return decodeURIComponent( text ).
            replace( /%21/g, '!' ).
            replace( /%2A/g, '*' ).
            replace( /%27/g, "'" ).
            replace( /%28/g, '(' ).
            replace( /%29/g, ')' );
    }
}
