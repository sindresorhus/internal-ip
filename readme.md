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

The package returns the address of the internet-facing interface, as determined from the default gateway. When the address cannot be determined for any reason, `undefined` will be returned.

The package relies on operating systems tools. On Linux and Android, the `ip` command must be available, which depending on distribution might not be installed by default. It is usually provided by the `iproute2` package. `internalIpV6Sync()` and `internalIpV4Sync()` are not supported in browsers and just return `undefined`.

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
- [default-gateway](https://github.com/silverwind/default-gateway) - Get your default gateway address

---

<div align="center">
	<b>
		<a href="https://tidelift.com/subscription/pkg/npm-internal-ip?utm_source=npm-internal-ip&utm_medium=referral&utm_campaign=readme">Get professional support for this package with a Tidelift subscription</a>
	</b>
	<br>
	<sub>
		Tidelift helps make open source sustainable for maintainers while giving companies<br>assurances about security, maintenance, and licensing for their dependencies.
	</sub>
</div>
