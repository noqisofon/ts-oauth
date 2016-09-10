import { Token } from './token';

export class ConsumerToken extends Token {

    consumer: any;
    params: any;
    response: any;
    
    constructor(consumer, token = '', secret = '') {
        super( token, secret );
        this.consumer = consumer;
        this.params = {};
    }

    public request(http_method, path, ...args) {
        this.response = this.consumer.request( http_method, path, this, {}, args );

        return this.response;
    }

    public signb(request, options = {}) {
        return this.consumer.signb( request, this, options );
    }

    public static from_obj(consumer, obj) : ConsumerToken {
        let token = new ConsumerToken( consumer, obj['oauth_token'], obj['oauth_token_secret'] );

        token.params = obj;

        return token;
    }
}
