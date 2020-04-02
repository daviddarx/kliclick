const browserDetection = () => {
  const browsers = {
    firefox: !!window.InstallTrigger,
    safari: !!window.ApplePaySession || (navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome')),
    opera: window.opr && !!window.opr.addons,
    chrome: !!window.chrome
  };

  return Object.keys(browsers).find(key => browsers[key] === true);
};

export default {
  isSafari: browserDetection() == 'safari',
  isiOS: /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream,
  isAndroid: /(android)/i.test(navigator.userAgent),
};
