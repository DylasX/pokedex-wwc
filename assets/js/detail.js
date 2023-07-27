const urlParams = new URLSearchParams(window.location.search);
const pokemonToBeSearched = urlParams.get('pokemon');
const BASE_URL_TYPES =
  'https://raw.githubusercontent.com/msikma/pokesprite/master/misc/type-logos/gen8/';
const BASE_URL_IMAGES =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/';

const pokemonDetailDiv = document.querySelector('#pokemon-detail');
const pokemon = new Pokedex.Pokedex();

const templateCard = async (name, imageSrc, index, types, stats) => {
  const colorThief = new ColorThief();
  const loadImage = (src) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.crossOrigin = 'Anonymous';
      img.src = src;
    });

  const image = await loadImage(imageSrc);
  const color = `rgb(${colorThief.getColor(image).join()})`;

  return `
        <div class="image-container">
        <div class="text-center bg-[${color}] dark:bg-[${color}] rounded-lg justify-center shadow-xl dark:shadow-md h-60 relative">
            <h2 class="font-bold text-slate-100 text-3xl pt-4 capitalize">${name}</h2>
            <p class="font-bold text-slate-100 text-md">${index}</p>
            <img src="${imageSrc}" class="m-auto absolute -bottom-7 left-1/4" width="150" height="150" alt="${name}">
        </div>
      </div>
      <div class="description mt-5">
        <div class="type-divs flex flex-row justify-center gap-5">
            ${types
              .map(
                (element) =>
                  `<img src="${BASE_URL_TYPES}${element.type.name}.png" alt="type" width="60" height="60" class="border border-gray-200 rounded-full">`
              )
              .join('')}            
        </div>
        <div class="stats mt-5">
            <ul>
                ${stats
                  .map(
                    (element) =>
                      `
                  <li class="flex flex-col items-center">
                    <div class="flex flex-row mr-auto items-end mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-zinc-800 dark:text-white">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                      </svg>
                      <h3 class="font-light text-md text-zinc-600 dark:text-white capitalize">${
                        element.stat.name
                      }</h3>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-200">
                        <div class="bg-[${color}] h-2.5 rounded-full dark:bg-[${color}]" style="width: ${
                        element.base_stat >= 100 ? 100 : element.base_stat
                      }%"></div>
                    </div>
                  </li>`
                  )
                  .join('')}
            </ul>
        </div>
      </div>
      `;
};

(function () {
  document.querySelector('#status').classList.toggle('hidden');
  pokemon
    .getPokemonByName(pokemonToBeSearched)
    .then(async (response) =>
      pokemonDetailDiv.insertAdjacentHTML(
        'beforeend',
        await templateCard(
          response.name,
          response.sprites.other['official-artwork'].front_default,
          response.id,
          response.types,
          response.stats
        )
      )
    )
    .catch((err) => window.history.back())
    .finally(() => {
      document.querySelector('#status').classList.toggle('hidden');
      document.querySelector('#main-content').classList.toggle('blur-sm');
      document.querySelector('#main-content').classList.toggle('opacity-30');
    });
})();
