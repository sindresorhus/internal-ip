import {expectType} from 'tsd';
import internalIp = require('.');

expectType<string>(await internalIp.v4());
expectType<string>(await internalIp.v6());

expectType<string>(internalIp.v4.sync());
expectType<string>(internalIp.v6.sync());
