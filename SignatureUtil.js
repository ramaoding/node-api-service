const crypto = require('crypto');
const urllib = require('url'); 
const locutus = require('locutus');

class SignatureUtil{
    constructor(){
    }

    generateOauthSignature(private_key_str, client_id, iso_time){
        let private_key = "-----BEGIN PRIVATE KEY-----\n"+private_key_str+"\n-----END PRIVATE KEY-----";
        let sign = crypto.createSign('SHA256');
        let dataToSign = client_id + "|" +  iso_time;
        sign.write(dataToSign);
        sign.end();

        let signature_b64 = sign.sign(private_key, 'base64');
        return signature_b64;
    }

    hash(algo,string){
        let hash = crypto.createHash(algo).update(string).digest('hex');
        return hash;
    }

    hashBody(body){
        if(body.length === 0){
            body = '';
        }else{
            
        }
        let text = this.hash('sha256',body).toLowerCase();
        return text;
    }

    ksort(obj){
        var keys = Object.keys(obj).sort()
            , sortedObj = {};
        
        for(var i in keys) {
            sortedObj[keys[i]] = obj[keys[i]];
        }
        
        return sortedObj;
    }

    getRelativeUrl(url){
        let urlparse = urllib.parse(url);
        let path = urlparse.pathname;
        let query = urlparse.query==null?'':urlparse.query;
        if(path.length === 0){
             path = '/';
        }
        if(query){
            let obj = {};
            locutus.php.strings.parse_str(query,obj);
            let sort = this.ksort(obj);
            let params = new URLSearchParams(sort);
            query = '?' + params.toString();
        }
        let formatedUrl = path + query;
        return formatedUrl;
    }

    isArray(item) {
        item = typeof item !== "string"? JSON.stringify(item): item;

        try {
            item = JSON.parse(item);
        } catch (e) {
            return false;
        }

        if (typeof item === "object" && item !== null) {
            return true;
        }

        return false;
    }

    generateServiceSignature(client_secret, method, url, auth_token, iso_time, bodyToHash = {}){
        let hash = this.hash('sha256','');
        if(this.isArray(bodyToHash)){
            let encoderData = JSON.stringify(bodyToHash);
            hash = this.hashBody(encoderData);
        }
        let stringToSign = method + ':' + this.getRelativeUrl(url) + ':' + auth_token + ':' + hash + ':' + iso_time;
        let signature = Buffer.from(crypto.createHmac('sha512',client_secret).update(stringToSign).digest()).toString('base64');
        return signature;
    }

}
module.exports = SignatureUtil;