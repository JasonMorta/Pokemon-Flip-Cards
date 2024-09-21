// Import necessary modules
import fs from 'fs/promises';

// Define the base PokeAPI URL
const pokeApiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=10000';

// Function to get details for a specific Pokemon
export async function getPokemonDetails(url) {
  const response = await fetch(url);
  const pokemon = await response.json();

  // Extract all sprite links and sound
  const sprites = pokemon.sprites;
  const allSprites = {
    front_default: sprites.front_default,
    front_shiny: sprites.front_shiny,
    front_female: sprites.front_female,
    front_shiny_female: sprites.front_shiny_female,
    back_default: sprites.back_default,
    back_shiny: sprites.back_shiny,
    back_female: sprites.back_female,
    back_shiny_female: sprites.back_shiny_female,
    official_artwork: sprites.other['official-artwork'].front_default,  // Official artwork
    dream_world: sprites.other.dream_world.front_default,  // Dream World artwork
    home_default: sprites.other.home.front_default,  // Pokémon HOME artwork
    home_shiny: sprites.other.home.front_shiny,       // Shiny version in Pokémon HOME
    showdown: sprites.other.showdown.front_default,  // Showdown artwork GIF
  };

  return {
    name: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
    id: pokemon.id,
    types: pokemon.types.map(typeInfo => typeInfo.type.name),
    height: pokemon.height / 10,  // Convert decimeters to meters
    weight: pokemon.weight / 10,  // Convert hectograms to kilograms
    stats: {
      hp: pokemon.stats[0].base_stat,
      attack: pokemon.stats[1].base_stat,
      defense: pokemon.stats[2].base_stat,
      'special-attack': pokemon.stats[3].base_stat,
      'special-defense': pokemon.stats[4].base_stat,
      speed: pokemon.stats[5].base_stat
    },
    abilities: pokemon.abilities.map(abilityInfo => abilityInfo.ability.name),
    sprites: allSprites,  // Include all available sprite variations
    sound: `https://pokemoncries.com/cries/${pokemon.id}.mp3`
  };
}

// Main function to fetch and save Pokemon data
export async function fetchAndSavePokemonData() {
  try {
    const response = await fetch(pokeApiUrl);
    const allPokemon = await response.json();

    const pokemonDetailsList = [];

    // Fetching details for each Pokémon
    for (const pokemon of allPokemon.results) {
      const pokemonDetails = await getPokemonDetails(pokemon.url);
      pokemonDetailsList.push(pokemonDetails);
    }

    // Write the details to a JSON file
    await fs.writeFile('pokemons.json', JSON.stringify(pokemonDetailsList, null, 2));
    console.log('Pokemon data saved to pokemon_data.json');
  } catch (error) {
    console.error('Error fetching or saving Pokemon data:', error);
  }
}

// Call the main function
//fetchAndSavePokemonData();
