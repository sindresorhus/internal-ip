# internal-ip [![Build Status](https://travis-ci.org/sindresorhus/internal-ip.svg?branch=master)](https://travis-ci.org/sindresorhus/internal-ip)

> Get your internal IPv4 address


## CLI

```sh
$ npm install --global internal-ip
```

```
$ internal-ip --help

  Example
    $ internal-ip
    192.168.0.123
```


## API

```sh
$ npm install --save internal-ip
```

```js
var internalIp = require('internal-ip');

internalIp();
//=> 192.168.0.123
```


## License

MIT © [Sindre Sorhus](http://sindresorhus.com)
