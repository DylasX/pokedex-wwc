const pokemon = new Pokedex.Pokedex();

function redirect(url) {
  const hostNameAdapter =
    window.location.hostname === 'dylasx.github.io' ? '/pokedex-wwc' : '';
  window.location.href = hostNameAdapter + url;
}

const searchInput = document.querySelector('#search-input');
searchInput.addEventListener('keyup', async function (event) {
  if (event.key === 'Enter') {
    const {
      target: { value },
    } = event;
    try {
      const poke = await pokemon.getPokemonByName(value.toLowerCase());
      if (poke.id) {
        return (window.location.href = `${
          window.location.hostname === 'dylasx.github.io' ? '/pokedex-wwc' : ''
        }/detail.html?pokemon=${poke.id}`);
      }
      return document
        .querySelector('#toast-warning')
        .classList.toggle('hidden');
    } catch (error) {
      console.error(error);
      document.querySelector('#toast-warning').classList.toggle('hidden');
    }
  }
});
