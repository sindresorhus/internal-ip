# internal-ip [![Build Status](https://travis-ci.org/sindresorhus/internal-ip.svg?branch=master)](https://travis-ci.org/sindresorhus/internal-ip)

> Get your internal IPv4 or IPv6 address


## CLI

```
$ npm install --global internal-ip
```

```
$ internal-ip --help

  Usage
    $ internal-ip

  Options
    -4, --ipv4  Return the IPv4 address (default)
    -6, --ipv6  Return the IPv6 address

  Example
    $ internal-ip
    192.168.0.123
    $ internal-ip -6
    fe80::200:f8ff:fe21:67cf
```


## API

```
$ npm install --save internal-ip
```

```js
var internalIp = require('internal-ip');

internalIp.v4().then(ip => console.log(ip)).catch(err => console.error(err));
//=> '192.168.0.123'

internalIp.v6().then(ip => console.log(ip)).catch(err => console.error(err));
//=> 'fe80::200:f8ff:fe21:67cf'
```

In case no address can be determined, `127.0.0.1` or `::1` will be returned as a replacement. If you think this is in error, please open an [issue](https://github.com/sindresorhus/internal-ip/issues/new).

## Related

See [public-ip](https://github.com/sindresorhus/public-ip) or [ipify](https://github.com/sindresorhus/ipify) to get your external IP address.


## License

MIT © [Sindre Sorhus](http://sindresorhus.com)
