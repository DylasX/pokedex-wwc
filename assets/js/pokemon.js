/* TEMPLATE */
const BASE_IMAGE_URL =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/';
const templateCard = async (name, imageSrc, index) => {
  const colorThief = new ColorThief();
  const loadImage = (src) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.crossOrigin = 'Anonymous';
      img.src = src;
    });

  //TODO: remove img
  const image = await loadImage(imageSrc);
  const color = `rgb(${colorThief.getColor(image).join()})`;

  return `
    <div class="w-[48%] flex flex-col text-center bg-[${color}] dark:bg-[${color}] rounded-lg justify-center shadow-xl dark:shadow-md h-44" onclick="window.location.href = '/detail.html?pokemon=${name}'">
        <img src="${imageSrc}" class="m-auto" width="80" height="70" alt="${name}"  />
        <h2 class="text-slate-100 font-bold capitalize">${name}</h2>
        <h3 class="text-slate-100 font-normal pb-2">ID: ${index}</h3>
    </div>
    `;
};
const pokemonListDiv = document.querySelector('#pokemon-list');
const interval = {
  offset: 0,
  limit: 20,
};
let isFetching = false;
const pokemon = new Pokedex.Pokedex();

const listFetcher = async () => {
  const data = await pokemon.getPokemonsList(interval);
  for await (const [index, element] of data?.results?.entries()) {
    pokemonListDiv.insertAdjacentHTML(
      'beforeend',
      await templateCard(
        element.name,
        BASE_IMAGE_URL + `${index + interval.offset + 1}.png`,
        index + interval.offset + 1
      )
    );
  }
};

window.addEventListener('scroll', async () => {
  if (window.scrollY + window.innerHeight >= document.body.offsetHeight - 100) {
    if (!isFetching) {
      isFetching = true;
      await listFetcher();
      interval.offset += 20;
      isFetching = false;
    }
  }
});

(async function () {
  try {
    //TODO: show loader
    if (!isFetching) {
      isFetching = true;
      await listFetcher();
      interval.offset += 20;
    }
  } catch (error) {
    console.error(error);
  } finally {
    //TODO: hide loader
    isFetching = false;
  }
})();
