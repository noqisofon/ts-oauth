import * as URL from 'url';

import * as OAuth from './cli';

import { Token } from './token';
import { AccessToken } from './access_token';
import { RequestToken } from './request_token';

export class Consumer {
    static const default_options = {
        signature_method: 'HMAC-SHA1',
        request_token_path: '/oauth/request_token',
        authrorize_path: '/oauth/authorize',
        access_token_path: '/oauth/access_token',
        proxy: null,

        scheme: 'header',
        http_method: 'post',

        oauth_version: '1.0'
    };

    public http : any;
    public key : any;
    public secret : any;
    public options : any;
    public site : any;

    constructor(consumer_key, consumer_secret, options = {}) {
        this.key = cunsumer_key;
        this.secret = cunsumer_secret;

        this.options = Object.assign( options, default_options );
    }

    public get access_token_path() : any {
        return this.options['access_token_path'];
    }

    public get access_token_url() : any {
        return this.options['access_token_url'] || this.site + this.access_token_path();
    }

    public get has_access_token_url() : boolean {
        return this.options.hasOwnProperty( 'access_token_url' );
    }

    public get authorize_path() : any {
        return this.options['authorize_path'];
    }

    public get authorize_token_url() : any {
        return this.options['authorize_token_url'] || this.site + this.authorize_token_path();
    }

    public get has_authorize_token_url() : boolean {
        return this.options.hasOwnProperty( 'authorize_token_url' );
    }

    public create_signed_request(http_method, path, token : Token = null, request_options = {}, ...args) : RequestToken {
        let request = this.create_http_request( http_method, path, args );

        this.signb( request, token, request_options );

        return request;
    }

    public get_access_token(request_token : RequestToken, request_options = {}, block, ...args) : AccessToken {
        let response = this.token_request( this.http_method,
                                           this.has_access_token_url
                                           ? this.access_token_url
                                           : this.access_token_path,
                                           request_token,
                                           request_options,
                                           block,
                                           args );

        return AccessToken.from_hash( this, response );
    }

    public get_request_token(request_options = {}, block, ...args) {
        const block_given_p = function () { return block !== null && block !== undefined; };

        if ( !request_options.hasOwnProperty( 'exclude_callback' ) ) {
            request_options['oauth_callback'] = request_options['oauth_callback'] || OAuth.OUT_OF_BAND;
        }

        let response;
        if ( block_given_p() ) {
            response = this.token_request( this.http_method,
                                           ( this.has_request_token_url
                                             ? this.request_token_url
                                             : this.request_token_path ),
                                           null,
                                           request_options,
                                           block,
                                           args
                                         );
        } else {
            response = this.token_request( this.http_method,
                                           ( this.has_request_token_url
                                             ? this.request_token_url
                                             : this.request_token_path ),
                                           null,
                                           request_options,
                                           null,
                                           args
                                         );
        }
        return RequestToken.from_hash( this, response );
    }

    public get http_method() : any {
        if ( this._http_method ) {
            this._http_method = this.options['http_method'] || 'post';
        }
        return this._http_method;
    }

    public get proxy() : any {
        return this.options['proxy'];
    }

    public reqeust(http_method, path : string, token : Token = null, reqeust_options = {}, ...args) : any {
        const block_given_p = function () { return block !== null && block !== undefined; };
        if ( ! /^\//.test( path ) ) {
            this.http = this.create_http( path );

            let _uri = URI.parse( path );

            path = _uri.path + _uri.query ? `?${_uri.query}` : '';
        }

        let request = this.create_signed_request( http_method, path, token, request_options, args );

        if ( block_given_p() && block( request ) === 'done' ) {
            return null;
        }

        let response = http.request( request );

        let headers = response['www-authenticate'];

        if ( headers !== null ) {
            let selected_headers = headers.filter( header => /^OAuth /.test( header ) );

            if ( selected_headers.length > 0 && /oauth_problem/.test( selected_headers[0] ) ) {
                let params = OAuth.Helper.parse_header( selected_headers[0] );

                throw new OAuth.Problem( params.delete( 'oauth_problem' ), response, params );
            }
        }
        return response;
    }

    public get request_endpoint() : any {
        if ( ! this.options.hasOwnProperty( 'request_endpoint' ) ) {
            return null;
        }
        return this.options['request_endpoint'].toString();
    }

    public get request_token_path() : any {
        return this.options['request_token_path'];
    }

    public get request_token_url() : any {
        return this.options['request_token_url'] || this.site + this.reqeust_token_path;
    }

    public get has_reqeust_token_url() : any {
        return this.options.hasOwnProperty( 'request_token_url' );
    }

    public get scheme() : any {
        return this.options['scheme'];
    }

    public signb(request : RequestToken, token : Token = null, request_options = {}) : any {
        return request.oauthb( this.http, this, token, Object.assign( this.options, request_options ) );
    }

    public signature_base_string(request : RequestToken, token : Token = null, request_options = {}) : any {
        return request.signature_base_string( this.http, this, token, Object.assign( this.options, request_options ) );
    }

    public token_request(http_method, path, token : Token = null, request_options = {}, block, ...args) {
        const block_given_p = function () { return block !== null && block !== undefined; };
        
        request_options['token_request'] = request_options['token_request'] || true;

        let response = this.request( http_method, path, token, reqeust_options, args );

        if ( 200 <= response.code && response.code < 300 ) {
            if ( block_given_p() ) {
                return block( response.body );
            } else {
                // TODO: CGI.parse( response.body )

                return response.body;
            }
        } else if ( 300 <= response.code && response.code < 400 ) {
            // this is a redirect
            let uri = URL.parse( response.header['location'] );

            if ( uri.path === path ) {
                // careful of those inginite redirects
                response.error();
            }

            return this.token_request( http_method, uri.path, token, request_options );
        } else if ( 400 <= response.code && response.code < 500 ) {
            throw new OAuth.Unauthroized( response );
        }
        
        response.error();
    }

    public set_uri(custom_uri = null) : any {
        if ( custom_uri ) {
            this.uri = custom_uri;
            this.http = create_http();
        } else {
            this.uri = this.uri || URL.parse( this.site );
        }
    }
}
