const urlAPI = "https://pokeapi.co/api/v2/pokemon/";
const urlTypes = "https://pokeapi.co/api/v2/type/";

let galeria = document.querySelector(".galeria");
let galery_buttons = document.querySelectorAll(".galery_buttons a");

const typesImg = [];
const pokeTypes = [];
let generationSelected = "generation-i";

init();

async function init() {
    getPokeTypes(await call(urlTypes))
    loadPokes(await call(urlAPI));
}

async function call(url) {
    try {
        const call = await fetch(url);
        const respons = await call.json();
        
        return respons;
    } catch(e) {
        console.log(e.message);
    }
}

/* @pokeList
{
    count: number
    next: url | null
    previous: url | null
    results: [
        {
        name: string
        url: url
        }
    ]
}*/
async function loadPokes(pokeList) {
    // prevButton
    if(pokeList.previous !== null) {
        galery_buttons[0].setAttribute("href", `javascript: prevPage("${pokeList.previous}")`);
        galery_buttons[0].style.visibility = "visible";
    } else {
        galery_buttons[0].style.visibility = "hidden";
    }
    // nextButton
    galery_buttons[1].href = `javascript: nextPage("${pokeList.next}")`;
    if (galery_buttons[1].style.visibility == "hidden") galery_buttons[1].style.visibility;
    // clear galery
    galeria.innerHTML = "";

    // sacar cada pokemon y dibujarlo
    for (const item of pokeList.results) {
        let poke = await call( item.url );
        let species = await call( poke.species.url );
        
        if (species.generation.name == "generation-i") {
            galeria.appendChild( await loadPoke( poke ) );
        } else {
            galery_buttons[1].style="visibility: hidden";
        }
    }
}

/* @data {
    abilities: [{}...]
    base_experience: number
    forms: [{}]
    game_indices: [{}]
    height: number
    held_items: []
    id: number
    is_default: boolean
    location_area_encounters: url
    moves: [{}]
    name: string
    order: number
    past_types: []
    spacies: {
        name: string
        url: url
    }
    sprites: {
        key: url
    }
    stats: [{}]
    types: [{
        slot: number
        type: {
            name: string
            url: url
        }
    }]
    weight: number
} 

data.species.[fetch url].generation.name - generation-i
*/
async function loadPoke(data) {
    // name - data.name
    // img - data.sprites.other["official-artwork"].front_default
    // abilities - forof data.abilities
    // base exp - data.base_experience
    // types - forof tada.types
    // weight - data.weight
    
    let html = "";
    let div = document.createElement("div");
    div.setAttribute("class", "galery__item");
    html = `     
        <div class="galery_title"><h3>${data.name}</h3><h4>${data.id}</h4></div>
        <img src="${data.sprites.other["official-artwork"].front_default}" />
        <div class="galery_bot">`;

    html += `<div class="ability_holder">`;
    for (const item2 of data.abilities) {
        html += `<h4>${item2.ability.name}</h4>`;
    }

    html += `</div><div class="icon_holder">`;
    for (const item of data.types) {
        html += `<div class="icon_type ${item.type.name}"></div>`;
    }

    div.innerHTML = "</div>" + html;

    return div;
}

async function nextPage(url) {
    if(url) await loadPokes(await call(url));
}

async function prevPage(url) {
    if(url) await loadPokes(await call(url));
}

async function getPokeTypes(listTypes) {
    let types = [];

    for (const item of listTypes.results) {
        let type = await call(item.url);
        types[type.name] = type;
    }

    return types;
}