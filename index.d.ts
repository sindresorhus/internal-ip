/**
@returns The IPv6 address of the internet-facing interface, as determined from the default gateway. When the address cannot be determined for any reason, `undefined` will be returned.

@example
```
import {internalIpV6} from 'internal-ip';

console.log(await internalIpV6());
//=> 'fe80::1'
```
*/
export function internalIpV6(): Promise<string | undefined>;

/**
@returns The IPv4 address of the internet-facing interface, as determined from the default gateway. When the address cannot be determined for any reason, `undefined` will be returned.

@example
```
import {internalIpV4} from 'internal-ip';

console.log(await internalIpV4());
//=> '10.0.0.79'
```
*/
export function internalIpV4(): Promise<string | undefined>;

/**
@returns The IPv6 address of the internet-facing interface, as determined from the default gateway. When the address cannot be determined for any reason, `undefined` will be returned.

@example
```
import {internalIpV6Sync} from 'internal-ip';

console.log(internalIpV6Sync());
//=> 'fe80::1'
```
*/
export function internalIpV6Sync(): string | undefined;

/**
@returns The IPv4 address of the internet-facing interface, as determined from the default gateway. When the address cannot be determined for any reason, `undefined` will be returned.

@example
```
import {internalIpV4Sync} from 'internal-ip';

console.log(internalIpV4Sync());
//=> '10.0.0.79'
```
*/
export function internalIpV4Sync(): string | undefined;
