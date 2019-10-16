import {expectType} from 'tsd';
import internalIp = require('.');

expectType<string | undefined>(await internalIp.v4());
expectType<string | undefined>(await internalIp.v6());

expectType<string | undefined>(internalIp.v4.sync());
expectType<string | undefined>(internalIp.v6.sync());
