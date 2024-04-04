export const isDevOrTest =
  REACT_APP_ENV === 'dev' || window.location.hostname.endsWith('insightmontest.com');

if (isDevOrTest) {
  console.info('Currently in development or test environment');
}
