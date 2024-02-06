import axios from 'axios';
import applyCaseMiddleware from 'axios-case-converter';

/**
 * Apply case middleware to convert camelCase to snake_case when receiving response, 
 * and vice versa when sending request.
 * @see https://www.npmjs.com/package/axios-case-converter
 */
export default applyCaseMiddleware(axios.create());
