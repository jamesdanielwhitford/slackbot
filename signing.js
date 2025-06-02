const crypto = require('crypto');

function checkSlackMessageSignature(req, res, next){
    const timestamp = req.headers['x-slack-request-timestamp']; 
    const fiveMinutesAgo = Math.floor(Date.now() / 1000) - (60 * 5);

    if (timestamp < fiveMinutesAgo) {
        return res.sendFail(401, "mismatched timestamp");
    }

    const signing_secret = process.env.SLACK_SIGNING_SECRET; 
   
    const slack_signature = req.headers['x-slack-signature']; 
    const [version, slack_hash] = slack_signature.split('=');

    const sig_basestring = version + ':' + timestamp + ':' + req.rawBody;
    const hmac = crypto.createHmac('sha256', signing_secret); 
    hmac.update(sig_basestring); 
    const our_hash = hmac.digest('hex');    

    if (crypto.timingSafeEqual(Buffer.from(slack_hash), Buffer.from(our_hash))) {
        return next(); 
    }
    else {
        return res.send(401, "Invalid request signature");
    }
}

module.exports = checkSlackMessageSignature; 
