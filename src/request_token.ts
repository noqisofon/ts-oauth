import { ConsumerToken } from './consumer_token';
import { AccessToken } from './access_token';

export class RequestToken extends ConsumerToken {

    public build_authorize(params = null) {
        if ( this.token === null ) {
            return null;
        }

        let params = Object.assign( this.params || {}, { oauth_token: this.token } );

        return this.build_authorize_url( this.consumer.authorize_url, params );
    }

    public callback_confirmed_p() : boolean {
        return this.params['callback_confirmed'] === true;
    }

    public get_access_token(options = {}, ...args) : AccessToken {
        let response = this.consumer.token_request( this.consumer.http_method,
                                                    ( this.consumer.has_access_token_url
                                                      ? this.consumer.access_token_url
                                                      : this.consumer.access_token_path ),
                                                    this,
                                                    options,
                                                    args );

        return AccessToken.from_obj( this.consumer, response );
    }
}
