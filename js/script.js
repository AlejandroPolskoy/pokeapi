const urlAPI = "https://pokeapi.co/api/v2/pokemon/";
const urlTypes = "https://pokeapi.co/api/v2/type/";
const language = "en";
const generations = {
	"generation-i": "https://pokeapi.co/api/v2/generation/1/",
	"generation-ii": "https://pokeapi.co/api/v2/generation/2/",
	"generation-iii": "https://pokeapi.co/api/v2/generation/3/",
	"generation-iv": "https://pokeapi.co/api/v2/generation/4/",
	"generation-v": "https://pokeapi.co/api/v2/generation/5/",
	"generation-vi": "https://pokeapi.co/api/v2/generation/6/",
	"generation-vii": "https://pokeapi.co/api/v2/generation/7/",
	"generation-viii": "https://pokeapi.co/api/v2/generation/8/"
}

let galeria = document.querySelector(".galeria");
let galery_buttons = document.querySelectorAll(".galery_buttons a");
let loading = `<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>`;

const typesImg = [];
const pokeTypes = [];
const pokemones = [];
let pokesPintar = [];
let totalPokes = 905;
let generationSelected = "generation-i";
let typeSelected = "all";

init();

async function init() {
	//totalPokes = (await call( urlAPI )).count;
	await getAllPokes( totalPokes );
	getPokeTypes(await call(urlTypes));
	//loadPokesV2("https://pokeapi.co/api/v2/pokemon/?offset=0&limit=20");
	getPokesByGen();
}

async function call(url) {
	try {
		const call = await fetch(url);
		const respons = await call.json();

		return respons;
	} catch (e) {
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
	console.log(pokeList);
	// prevButton
	if (pokeList.previous !== null) {
		galery_buttons[0].setAttribute(
			"href",
			`javascript: prevPage("${pokeList.previous}")`
		);
		galery_buttons[0].style.visibility = "visible";
	} else {
		galery_buttons[0].style.visibility = "hidden";
	}
	// nextButton
	galery_buttons[1].href = `javascript: nextPage("${pokeList.next}")`;
	if (galery_buttons[1].style.visibility == "hidden")
		galery_buttons[1].style.visibility;
	// clear galery
	galeria.innerHTML = "";

	// sacar cada pokemon y dibujarlo
	for (const item of pokeList.results) {
		if (typeof item.url == "string") item.url = await call(item.url);
		if (typeof item.url.species.url == "string")
			item.url.species.url = await call(item.url.species.url);

		if (item.url.species.url.generation.name == "generation-i") {
			galeria.appendChild(await loadPoke(item.url));
		} else {
			galery_buttons[1].style = "visibility: hidden";
		}
	}
}

async function loadPokesV2(url) {
	let { offset, limit } = parse(url);
	//prev
	if( resta(offset, limit) >= 0) {
		galery_buttons[0].setAttribute(
			"href",
			`javascript: prevPage("${urlAPI}?offset=${resta(offset, limit)}&limit=${limit}")`
		);
		galery_buttons[0].style.visibility = "visible";
	} else {
		galery_buttons[0].style.visibility = "hidden";
	}
	// next
	galery_buttons[1].href = `javascript: nextPage("${urlAPI}?offset=${suma(offset,limit)}&limit=${limit}")`;
	if (galery_buttons[1].style.visibility == "hidden")
		galery_buttons[1].style.visibility = "visible";
	// clear galery
	galeria.innerHTML = "";

	// control filter
	let max = suma(offset, limit);
	
	for (let i = parseInt(offset) + 1; i <= max; i++) {
		if (typeof pokemones[i] == "undefined") pokemones[i] = await call( urlAPI + i );
		if (typeof pokemones[i].species.url == "string") pokemones[i].species.url = await call( pokemones[i].species.url );
		
		if (pokemones[i].species.url.generation.name == "generation-i") {
			galeria.appendChild(await loadPoke(pokemones[i]));
		} else {
			galery_buttons[1].style = "visibility: hidden";
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

	let div = document.createElement("div");
	div.setAttribute("class", "galery__item");
	
    let html = `     
	<div class="galery__item_face">
		<div class="galery_title"><h3>${data.name}</h3><h4>${formatID(data.id)}</h4></div>
        <img src="${data.sprites.other["official-artwork"].front_default}" />
        <div class="galery_bot">
	`;

	html += `<div class="ability_holder">`;
	for (const item2 of data.abilities) {
		html += `<h4>${item2.ability.name}</h4>`;
	}

	html += `</div><div class="icon_holder">`;
	for (const item of data.types) {
		html += `<div class="icon_type ${item.type.name}"></div>`;
	}

	html += `</div></div></div>
	<div class="galery__item_back">
		<div class="galery_title"><h3>${data.name}</h3><h4>${formatID(data.id)}</h4></div>
		<div>
			<h5>STATS</h5>
			<div>	
	`;
	for (const stat of data.stats) {
		html += `<div class="stats"><label>${stat.stat.name}</label><span>${stat.base_stat}</span></div>`;
	}
	
	for (const ability of data.abilities) {
		if(typeof ability.ability.url == "string") ability.ability.url = await call( ability.ability.url );
		let description;
		for (const desc of ability.ability.url.effect_entries) {
			if(desc.language.name == language) {
				description = desc.short_effect;
				break;
			}
		}
		html += `<p class="ability_description"><span>${ability.ability.url.name}</span> - ${description}</p>`;
	}
	
	html += `
			</div>
		</div>
	</div>
	`;

	div.innerHTML = html;
	return div;
}

async function loadPokesV3( paraPintar ) {
	paraPintar.sort(function(a, b){return a-b});
	galeria.innerHTML = "";
	for (const i of paraPintar) {
		if(typeSelected == "all" ||
		(pokemones[i].types[0].type.name == typeSelected || (pokemones[i].types[1] && pokemones[i].types[1].type.name == typeSelected) )) {
			galeria.appendChild(await loadPoke(pokemones[i]));
		}
	}
}

async function nextPage(url) {
	loadPokesV2(url);
}

async function prevPage(url) {
	loadPokesV2(url);
}

async function getPokeTypes(listTypes) {
	let types = [];
	let divTypes = document.querySelector(".types");

	for (const item of listTypes.results) {
		if(item.name != "unknown" && item.name != "shadow") {
			let type = await call(item.url);
			types[type.name] = type;
			divTypes.innerHTML += `
				<li><a onclick="loadPokes_byType(this, '${type.name}')">${type.name}</a></li>
			`;
		}
	}

	return types;
}

async function loadPokes_byType( element, filterType) {

	if( filterType != typeSelected ) {
		document.querySelector(".--type-selected").classList.toggle("--type-selected");
		element.classList.toggle("--type-selected");
		typeSelected = filterType;

		loadPokesV3( pokesPintar );
	}
}

async function fusion(offset, limit) {
	let max = parseInt(offset) + parseInt(limit);

	for (let i = parseInt(offset) + 1; i <= max; i++) {
		if (typeof pokemones[i] == "undefined") {
			let datosPoke = await call(urlAPI + i);
			pokemones[i] = datosPoke;
		}
	}
}

function parse(query) {
	var vars = query.split("?")[1].split("&");
	var query_string = {};
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split("=");
		var key = decodeURIComponent(pair.shift());
		var value = decodeURIComponent(pair.join("="));
		// If first entry with this name
		if (typeof query_string[key] === "undefined") {
			query_string[key] = value;
			// If second entry with this name
		} else if (typeof query_string[key] === "string") {
			var arr = [query_string[key], value];
			query_string[key] = arr;
			// If third or later entry with this name
		} else {
			query_string[key].push(value);
		}
	}
	return query_string;
}

function suma(a,b) {
	return parseInt(a)+parseInt(b);
}
function resta(a,b) {
	return parseInt(a)-parseInt(b);
}

async function getPokesByGen() {
	galeria.innerHTML = loading;
	pokesPintar = [];
	if( generationSelected != "all") {
		let url = generations[generationSelected] //url
		let array = await call( url );
		
		for (const poke of array.pokemon_species) {
			for (const pokepoke of pokemones) {
				if(typeof pokepoke != "undefined") {
					if( pokepoke.name == poke.name) {
						pokesPintar.push( pokepoke.id );
					}
				}
			}
		}
	} else {
		for(let i=1; i<pokemones.length; i++) {
			pokesPintar.push(pokemones[i].id);
		}
	}
	
	loadPokesV3( pokesPintar );
}

async function getAllPokes( count ) {
	for(let i=1; i<count; i++) {
		pokemones[i] = await call( urlAPI+i )
	}
}

function filterChanged() {

}

function genChanged( element, gen ) {
	if( gen != generationSelected ) {
		document.querySelector(".--selected").classList.toggle("--selected");
		element.classList.toggle("--selected");
		generationSelected = gen;
		getPokesByGen();
	}
}

function formatID ( id ) {
	let text;

	switch( id.toString().length ) {
		case 1: text = "#00"+id; break;
		case 2: text = "#0"+id; break;
		case 3: text = "#"+id; break;
		default: text = "#"+id; break;
	}

	return text;
}

function sortASC( item ) {
	return item.sort(function(a, b){return a-b});
}