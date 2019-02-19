/**
 *
 * Returns the address ipv6 of the internet-facing interface, as determined from the default gateway. When the address cannot be determined for any reason, null will be returned.
 * @returns string of the ip address
 *
 * @example
 * console.log(await internalIp.v6());
 * //=> 'fe80::1'
 *
 */
export function v6(): Promise<string>;
export namespace v6 {
	/**
	 *
	 * Returns the address ipv6 of the internet-facing interface, as determined from the default gateway. When the address cannot be determined for any reason, null will be returned.
	 * @returns string of the ip address
	 *
	 * @example
	 * console.log(await internalIp.v6());
	 * //=> 'fe80::1'
	 *
	 */
	export const sync: () => string;
}

/**
 *
 * Returns the address ipv4 of the internet-facing interface, as determined from the default gateway. When the address cannot be determined for any reason, null will be returned.
 * @returns string of the ip address
 *
 * @example
 * console.log(internalIp.v6.sync())
 * //=> '10.0.0.79'
 *
 */
export function v4(): Promise<string>;
export namespace v4 {
	/**
	 *
	 * Returns the address ipv4 of the internet-facing interface, as determined from the default gateway. When the address cannot be determined for any reason, null will be returned.
	 * @returns string of the ip address
	 *
	 * @example
	 * console.log(internalIp.v4.sync())
	 * //=> '10.0.0.79'
	 *
	 */
	export const sync: () => string;
}
