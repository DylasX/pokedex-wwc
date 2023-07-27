function redirect(url) {
  const hostNameAdapter =
    window.location.hostname === 'dylasx.github.io' ? '/pokedex-wwc' : '';
  window.location.href = hostNameAdapter + url;
}
