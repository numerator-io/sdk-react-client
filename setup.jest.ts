// setupTests.js (or setupTests.ts for TypeScript)
process.env.REACT_APP_NUMERATOR_API_KEY = 'your_api_key';
process.env.REACT_APP_NUMERATOR_BASE_URL = 'https://your.base.url';

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Optionally, you can throw the reason to terminate the process
  // throw reason;
});
