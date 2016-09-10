import * as URL from 'url';

import { ConsumerToken } from './consumer_token';


function uri_absolute_p(uri) {
    return /^\//.test( uri );
}

export class AccessToken extends ConsumerToken {
    public delete(path, headers = {}) {
        return this.request( 'delete', path, headers );
    }

    public get(path, headers = {}) {
        return this.request( 'get', path, headers );
    }

    public head(path, headers = {}) {
        return this.request( 'head', path, headers );
    }

    public patch(path, body, headers = {}) {
        return this.request( 'patch', path, body, headers );
    }

    public post(path, body, headers = {}) {
        return this.request( 'post', path, body, headers );
    }

    public put(path, body, headers = {}) {
        return this.request( 'put', path, body, headers );
    }

    public request(http_method, path, ...args) {
        let request_uri = URL.parse( path );
        let site_uri    = URL.parse( this.consumer.uri );

        let is_service_uri_different = ( uri_absolute_p( request_uri ) && request_uri.href !== site_uri.href );

        try {
            if ( is_service_uri_different ) {
                this.consumer.set_uri( request_uri );
            }
            this.response = super.request( http_method, path, args );
        } catch ( err ) {
            if ( is_service_uri_different ) {
                this.consumer.set_uri( site_uri );
            }
        }
        return this.response;
    }
}
