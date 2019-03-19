'use strict';

const https = require('https'),
      zlib = require('zlib');
/**
 * Parse response
 */


function parseResponse(res, body, resolve, reject) {
  try {
    if (!/application\/json/.test(res.headers['content-type']) || body.trim() === '') {
      return resolve(body);
    }

    const json = JSON.parse(body);

    if (json.error || json.errors) {
      const err = new Error(json.error || JSON.stringify(json.errors));
      return reject(err);
    }

    return resolve(json);
  } catch (e) {
    e.responseBody = body;
    return reject(e);
  }
}

class Request {
  constructor(hostname, {
    headers = {},
    failOnLimitReached = false,
    agent = null
  } = {}) {
    if (!hostname) throw new Error('The hostname is required to make the call to the server.');
    this.hostname = hostname;
    this.headers = headers;
    this.failOnLimitReached = failOnLimitReached;
    this.agent = agent;
  }

  run(method, path, data) {
    console.log(`Requesting Data from: https://${this.hostname}${path} Using the ${method} method`);
    const dataString = JSON.stringify(data);
    const options = {
      path,
      hostname: this.hostname,
      method: method.toUpperCase(),
      port: 443,
      headers: Object.assign({
        'User-Agent': 'gatsby-source-bigcommerce',
        'Content-Type': 'application/json',
        'Accept-Encoding': 'gzip, deflate'
      }, this.headers)
    };
    if (this.agent) options.agent = this.agent;

    if (data) {
      options.headers['Content-Length'] = Buffer.from(dataString).length;
    }

    console.log('Starting Big Commerce Request');
    return new Promise((resolve, reject) => {
      const req = https.request(options, res => {
        const contentEncoding = res.headers['content-encoding'];
        const shouldUnzip = ['deflate', 'gzip'].indexOf(contentEncoding) !== -1;
        const encoding = shouldUnzip ? 'binary' : 'utf8';
        let body = '';
        res.setEncoding(encoding); // If the API limit has been reached

        if (res.statusCode === 429) {
          const timeToWait = res.headers['x-retry-after'];

          if (this.failOnLimitReached) {
            const err = new Error(`You have reached the rate limit for the BigCommerce API. Please retry in ${timeToWait} seconds.`);
            err.retryAfter = Number(timeToWait);
            return reject(err);
          }

          console.log(`You have reached the rate limit for the BigCommerce API, we will retry again in ${timeToWait} seconds.`);
          return setTimeout(() => {
            console.log('Restarting request call after suggested time');
            this.run(method, path, data).then(resolve).catch(reject);
          }, timeToWait * 1000);
        }

        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          console.log('Request complete');

          if (res.statusCode >= 400 && res.statusCode <= 600) {
            const error = new Error(`Request returned error code: ${res.statusCode} and body: ${body}`);
            error.code = res.statusCode;
            error.responseBody = body;
            return reject(error);
          } // Use GZIP decompression if required


          if (shouldUnzip) {
            const unzip = contentEncoding === 'deflate' ? zlib.deflate : zlib.gunzip;
            return unzip(Buffer.from(body, encoding), (err, data) => {
              if (err) {
                return reject(err);
              }

              return parseResponse(res, data.toString('utf8'), resolve, reject);
            });
          }

          return parseResponse(res, body, resolve, reject);
        });
      });
      req.on('error', e => reject(e));

      if (data) {
        console.log('Sending Data: ' + dataString);
        req.write(dataString);
      }

      req.end();
    });
  }

}

module.exports = Request;