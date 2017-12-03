# node-php-fpm

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][npm-url]


## Install

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/). Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```sh
$ npm install php-fpm
```

## Examples

### Using with `http`

```js
const http = require('http')
const phpFpm = require('php-fpm')
const serveStatic = require('serve-static')

const php = phpFpm() // Optional: parameters for fastcgi-client
const serve = serveStatic(__dirname)

const server = http.createServer(function (req, res) {
  if (req.url.match(/\.php(\?.*)?$/)) {
    php(req, res)
  } else {
    serve(req, res)
  }
})

server.listen(8080)
```

### Using with `express`

```js
const express = require('express')
const phpFpm = require('php-fpm')

const app = express()

app.use(phpFpm())

app.listen(8080)
```

## API

The available parameters for `php-fpm` are:

```js
phpFpm(
  userOptions = {
    // Parameters for fastcgi-client
    host: '127.0.0.1',
    port: 9000,
    documentRoot: __dirname,
    skipCheckServer: true
  },
  customParams = {
    // Headers for php-fpm (automatically set)
    uri, // REQUEST_URI
    document, // DOCUMENT_URI
    query, // QUERY_STRING
    script // SCRIPT_FILENAME
  }
)
```

Parameters for `fastcgi-client` are available [here](https://github.com/LastLeaf/node-fastcgi-client#api).

## `rewrite` option

There is an implementation of the `rewrite` module to handle routes the traditional nginx/Apache way.

```js
const phpFpm = require('php-fpm')

// Route rewrite for Phalcon framework
const php = phpFpm({
  rewrite: [
    {
      rule: /.*/, // Default rule, can be omitted
      replace: '/index.php?_url=$0'
    }
  ]
})
```

## License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/php-fpm.svg
[downloads-image]: https://img.shields.io/npm/dm/php-fpm.svg
[npm-url]: https://npmjs.org/package/php-fpm
