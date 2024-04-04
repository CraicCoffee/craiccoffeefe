const isHttps = document.location.protocol === 'https:';

const clearCache = () => {
  // remove all caches
  if (window.caches) {
    caches
      .keys()
      .then((keys) => {
        keys.forEach((key) => {
          caches.delete(key);
        });
      })
      .catch((e) => console.log(e));
  }
};

if ('serviceWorker' in navigator && isHttps) {
  // unregister service worker
  const { serviceWorker } = navigator;
  if (serviceWorker.getRegistrations) {
    serviceWorker.getRegistrations().then((sws) => {
      sws.forEach((sw) => {
        sw.unregister();
      });
    });
  }
  serviceWorker.getRegistration().then((sw) => {
    if (sw) sw.unregister();
  });

  clearCache();
}
//滚动条只在windows上生效，不影响mac
const isWindows = function () {
  const platform = navigator.platform;
  return platform === 'Win32' || platform === 'Win64' || platform === 'Windows';
};
if (isWindows()) {
  window.addEventListener('scroll', function () {
    document.body.toggleAttribute('scroll', true);
    this.timer && clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      document.body.toggleAttribute('scroll');
    }, 500);
  });
}
