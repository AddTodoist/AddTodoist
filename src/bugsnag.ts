import dotenv from 'dotenv';
import Bugsnag from '@bugsnag/js';
dotenv.config();
Bugsnag.start(process.env.BUGSNAG_API_KEY || '');

export default Bugsnag;