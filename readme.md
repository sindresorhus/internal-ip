# internal-ip

> Get your internal IP address

## Install

```sh
npm install internal-ip
```

## Usage

```js
import {internalIpV6, internalIpV4} from 'internal-ip';

console.log(await internalIpV6());
//=> 'fe80::1'

console.log(await internalIpV4());
//=> '10.0.0.79'
```

## API

The async functions use a UDP connection to determine the address of the internet-facing interface (no packets are sent). When that fails (for example, when offline), it falls back to scanning `os.networkInterfaces()`. The sync functions always use `os.networkInterfaces()`. If multiple non-internal interfaces are present and the internet-facing interface cannot be determined, `undefined` will be returned to avoid selecting the wrong interface.

`internalIpV6Sync()` and `internalIpV4Sync()` are not supported in browsers and just return `undefined`.

### internalIpV6()

Returns the internal IPv6 address asynchronously.

### internalIpV4()

Returns the internal IPv4 address asynchronously.

### internalIpV6Sync()

Returns the internal IPv6 address synchronously.

### internalIpV4Sync()

Returns the internal IPv4 address synchronously.

## Related

- [internal-ip-cli](https://github.com/sindresorhus/internal-ip-cli) - CLI for this package
- [public-ip](https://github.com/sindresorhus/public-ip) - Get your public IP address
