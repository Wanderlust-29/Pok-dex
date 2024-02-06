let allPokemon = [];
let tableauFin = [];

const searchInput = document.querySelector(".recherche-poke input");
const listPoke = document.querySelector(".list-poke");
const chargement = document.querySelector(".loader");

let types = {
  grass: "#78c850",
  ground: "#E2BF65",
  dragon: "#6F35FC",
  fire: "#F58271",
  electric: "#F58271",
  fairy: "#D685AD",
  poison: "#933DA3",
  bug: "#B3F594",
  water: "#6390F0",
  normal: "#D9D5D8",
  psychic: "#F95587",
  flying: "#A98FF3",
  fighting: "#C25956",
  rock: "#B6A136",
  ghost: "#735797",
  ice: "#96D9D6",
};

// ********************Appel API Pokedex (151 pokemons)************

function fetchPokemonBase() {
  fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
    .then((reponse) => reponse.json())
    .then((allPoke) => {
      // console.log(allPoke);
      allPoke.results.forEach((pokemon) => {
        fetchPokemonComplet(pokemon);
      });
    });
}

// *******************************Creer le tableau AllPokemon avec le l'image, le type et le nom en français******************************

fetchPokemonBase();

function fetchPokemonComplet(pokemon) {
  let objPokemonFull = {};
  let url = pokemon.url;
  let nameP = pokemon.name;

  fetch(url)
    .then((reponse) => reponse.json())
    .then((pokeData) => {
      // console.log(pokeData)

      objPokemonFull.pic = pokeData.sprites.front_default;
      objPokemonFull.type = pokeData.types[0].type.name;
      objPokemonFull.id = pokeData.id;

      // *******************Appel a l'API spiecies pour avoir les noms en français**********************

      fetch(`https://pokeapi.co/api/v2/pokemon-species/${nameP}/`)
        .then((reponse) => reponse.json())
        .then((pokeData) => {
          // console.log(pokeData))

          objPokemonFull.name = pokeData.names[4].name;
          allPokemon.push(objPokemonFull);

          if (allPokemon.length === 151) {
            tableauFin = allPokemon
              .sort((a, b) => {
                return a.id - b.id;
              })
              .slice(0, 21);
            // console.log(tableauFin)

            createFiche(tableauFin);
            chargement.style.display = "none";
          }
        });
    });
}

// *****************Creation fiches Pokedex************************

function createFiche(arr) {
  for (let i = 0; i < arr.length; i++) {
    const fiche = document.createElement("li");
    let couleur = types[arr[i].type];
    fiche.style.background = couleur;
    const nameFiche = document.createElement("h5");
    nameFiche.innerText = arr[i].name;
    const idFiche = document.createElement("p");
    idFiche.innerText = `ID# ${arr[i].id}`;
    const imageFiche = document.createElement("img");
    imageFiche.src = arr[i].pic;

    fiche.appendChild(imageFiche);
    fiche.appendChild(nameFiche);
    fiche.appendChild(idFiche);

    listPoke.appendChild(fiche);
  }
}

// ********************Scroll infini*******************************

window.addEventListener("scroll", () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  // scrollTop = scroll depuis le top
  // scrollHeight = scroll total
  // scrollHeight = hauteur de la fenêtre, partie visible
  console.log(scrollTop, scrollHeight, clientHeight);

  if (clientHeight + scrollTop >= clientHeight - 20) {
    addPoke(6);
  }
});
let index = 21;

function addPoke(nb) {
  if (index > 151) {
    return;
  }
  const arrToAdd = allPokemon.slice(index, index + nb);
  createFiche(arrToAdd);
  index += nb;
}

// **********************Recherche*********************************

searchInput.addEventListener("keyup", recherche);

//******************Activer le boutton de recherche***************
// const formRecherche = document.querySelector('form')
// formRecherche.addEventListener('submit', (e) => {
//     e.preventDefault();
//     recherche();
// })

function recherche() {
  if (index < 151) {
    addPoke(130);
  }

  let filter, allLi, titleValue, allTitles;
  filter = searchInput.value.toUpperCase();
  allLi = document.querySelectorAll("li");
  allTitles = document.querySelectorAll("li > h5");

  for (let i = 0; i < allLi.length; i++) {
    titleValue = allTitles[i].innerText;

    if (titleValue.toUpperCase().indexOf(filter) > -1) {
      allLi[i].style.display = "flex";
    } else {
      allLi[i].style.display = "none";
    }
  }
}

// ********************Animation input*****************************

searchInput.addEventListener("input", (e) => {
  if (e.target.value !== "") {
    e.target.parentNode.classList.add("active-input");
  } else if (e.target.value === "") {
    e.target.parentNode.classList.remove("active-input");
  }
});

// Loader
