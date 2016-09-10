import { Helper } from './helper';

export class Token implements Helper {
    token : any;
    secret : any;

    constructor(token: any, secret : any) {
        this.token = token;
        this.secret = secret;
    }

    public to_query() : string {
        return `oauth_token=${this.escape( this.token )}&oauth_token_secret=${this.escape( this.secret )}`
    }
}
