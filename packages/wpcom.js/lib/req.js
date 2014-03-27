
/**
 * Module dependencies.
 */

var request = require('request');
var merge = require('extend');
var qs = require('querystring');

var ends = require('./endpoints');
var debug = require('debug')('wp-connect:req');

/**
 * Default options
 */

var default_opts = {
  url: {
    api_rest_v1: "https://public-api.wordpress.com/rest/v1"
  }
};

/**
 * Globals
 */

var api_url = default_opts.url.api_rest_v1;

/**
 * Request constructor
 *
 * @param {WPCONN} wpconn
 * @api public
 */

function Req(wpconn){
  this.wpconn = wpconn;
}

/**
 * Request to WordPress REST API
 * 
 * @param {String} type endpoint type
 * @param {Object} vars to build endpoint
 * @param {Object} opts
 * @param {Function} fn
 * @api private
 */

Req.prototype.exec = function (type, vars, opts, fn){
  debug('type: `%s`', type);

  // token
  var token = opts.token || this.wpconn.tkn;
  // remove token from options
  delete opts.token;

  // headers
  var headers = {};
  if (!token) {
    debug('WARN: token is not defined');
  } else {
    headers.authorization = "Bearer " + token;
  }

  // options object || callback function
  if ('function' == typeof opts) {
    fn = opts;
    opts = {};
  }

   opts = opts || {};

  // request method
  var method = (opts.method || 'get').toUpperCase();
  delete opts.method;
  debug('method: `%s`', method);

  // endpoint config object
  var end = ends(type);

  // build endpoint url
  var endpoint = end.path;

  if (vars) {
    for (var k in vars) {
      var rg = new RegExp("%" + k + "%");
      endpoint = endpoint.replace(rg, vars[k]);
    }
  }
  debug('endpoint: `%s`', endpoint);

  // build query string
  var qrs = {};
  merge(qrs, end.options, opts);
  qrs = qs.stringify(qrs);
  debug('qrs: `%s`', qrs);

  // build endpoint url
  var url = api_url + endpoint + '?' + qrs;
  debug('request to `%s`', url);

  var params = {
    url: url,
    method: method,
    headers: headers
  };

  // pass data from opts object to form params
  if (opts.data) {
    params.form = opts.data;
  }

  request(params, function (err, res, body) {
    if (err) return fn(err);

    var data;
    try {
      data = JSON.parse(body);
    } catch(e) {
      return fn(e);
    }

    // create Error var
    if (data.error) {
      return fn(new Error(data.message));
    }

    // TODO: take a look to this one please
    if ((/SyntaxError/).test(String(data))) {
      return fn(data);
    }

    debug('request successful');
    fn (null, data);
  });
};

/**
 * Expose `Req` module
 */

module.exports = Req;
