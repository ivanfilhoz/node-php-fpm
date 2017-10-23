const path = require('path')
const fastCgi = require('fastcgi-client')
const defaultOptions = {
  host: '127.0.0.1',
  port: 9000,
  documentRoot: path.dirname(require.main.filename),
  skipCheckServer: true
}

module.exports = function (param = {}) {
  const options = Object.assign({}, defaultOptions, param)
  const loader = fastCgi(options)
  const fpm = new Promise((resolve, reject) => {
    loader.on('ready', () => resolve(loader))
    loader.on('error', reject)
  })

  return {
    request: async function (param = {}) {
      let params = {
        script: path.join(options.documentRoot, 'index.php'),
        uri: '/',
        method: 'GET',
        contentType: 'text/html'
      }
      if (typeof param === 'string') {
        const script = param.indexOf('/') !== -1
          ? param
          : path.join(options.documentRoot, param)
        params.script = script
        params.uri = script.match(/\/[^/]+$/)[0]
      }

      const headers = Object.assign({
        REQUEST_METHOD: params.method,
        CONTENT_TYPE: params.contentType,
        SCRIPT_FILENAME: params.script,
        SCRIPT_NAME: params.script.split('/').pop(),
        REQUEST_URI: params.uri,
        DOCUMENT_URI: params.script,
        DOCUMENT_ROOT: options.documentRoot,
        HTTP_HOST: params.host,
        SERVER_PROTOCOL: 'HTTP/1.1',
        GATEWAY_INTERFACE: 'CGI/1.1',
        SERVER_SOFTWARE: 'php-fpm for Node',
        REDIRECT_STATUS: 200
      }, params.headers || {})

      const php = await fpm
      return new Promise(function (resolve, reject) {
        php.request(headers, function (err, request) {
          if (err) { reject(err) }
          var output = ''
          var errors = ''

          request.stdout.on('data', function (data) {
            output += data.toString('utf8')
          })

          request.stderr.on('data', function (data) {
            errors += data.toString('utf8')
          })

          request.stdout.on('end', function () {
            output = output.replace(/^[\s\S]*?\r\n\r\n/, '')
            if (errors) { reject(errors) } else { resolve(output) }
          })

          if (params.method in ['POST', 'PUT', 'PATCH']) {
            request.stdin.write(output, 'utf8')
          }
        })
      })
    }
  }
}
