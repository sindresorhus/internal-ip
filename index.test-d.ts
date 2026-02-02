import {expectType} from 'tsd';
import {
	internalIpV4,
	internalIpV6,
	internalIpV4Sync,
	internalIpV6Sync,
} from './index.js';

expectType<string | undefined>(await internalIpV4());
expectType<string | undefined>(await internalIpV6());

expectType<string | undefined>(internalIpV4Sync());
expectType<string | undefined>(internalIpV6Sync());
