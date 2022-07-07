import Bugsnag from '@bugsnag/js';

Bugsnag.start(process.env.BUGSNAG_API_KEY || '');

export default Bugsnag;