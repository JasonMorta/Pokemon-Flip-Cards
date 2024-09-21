// fetch_pokemon.mjs

// Uncomment the following lines if using Node.js version < 18 and after installing node-fetch
// import fetch from 'node-fetch';

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Derive __dirname since it's not available in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// PokéAPI base URL
const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';

// Output directory path
const OUTPUT_DIR = path.join(__dirname, 'types_data');

// Function to fetch JSON data with error handling
async function fetchJSON(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status} for URL: ${url}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch ${url}: ${error.message}`);
    throw error;
  }
}

// Function to ensure the output directory exists
async function ensureOutputDir(dirPath) {
  try {
    await fs.access(dirPath);
    // Directory exists
  } catch (error) {
    // Directory does not exist, create it
    await fs.mkdir(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}

// Main function to fetch all Pokémon data and categorize by type
async function fetchAndCategorizePokemon() {
  try {
    console.log('Ensuring output directory exists...');
    await ensureOutputDir(OUTPUT_DIR);

    console.log('Fetching the total count of Pokémon...');

    // Step 1: Get the total count of Pokémon
    const initialData = await fetchJSON(`${POKEAPI_BASE_URL}/pokemon?limit=1`);
    const totalCount = initialData.count;
    console.log(`Total Pokémon to fetch: ${totalCount}`);

    // Step 2: Fetch the list of all Pokémon names and URLs
    console.log('Fetching list of all Pokémon...');
    const listData = await fetchJSON(`${POKEAPI_BASE_URL}/pokemon?limit=${totalCount}`);
    const pokemonList = listData.results; // Array of { name, url }

    console.log('Fetching detailed data for each Pokémon...');

    // Object to hold types and their corresponding Pokémon
    const typesData = {};

    // To avoid overwhelming the API, we'll fetch in batches
    const BATCH_SIZE = 20;
    for (let i = 0; i < pokemonList.length; i += BATCH_SIZE) {
      const batch = pokemonList.slice(i, i + BATCH_SIZE);
      console.log(`Fetching batch ${Math.floor(i / BATCH_SIZE) + 1} (${batch.length} Pokémon)...`);

      // Create an array of fetch promises for the current batch
      const batchPromises = batch.map(pokemon => fetchJSON(pokemon.url));

      // Wait for all promises in the current batch to resolve
      const batchData = await Promise.all(batchPromises);

      // Process each Pokémon in the batch
      batchData.forEach(pokemon => {
        // Each Pokémon can have multiple types
        pokemon.types.forEach(typeInfo => {
          const typeName = typeInfo.type.name;

          // Initialize the array for this type if it doesn't exist
          if (!typesData[typeName]) {
            typesData[typeName] = [];
          }

          // Push the complete Pokémon object to the corresponding type array
          typesData[typeName].push(pokemon);
        });
      });

      // Optional: Delay between batches to be polite to the API
      await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay
    }

    console.log(`Fetched and categorized data for ${pokemonList.length} Pokémon.`);

    // Step 3: Write each type's data to a separate JSON file
    console.log(`Writing data to ${OUTPUT_DIR}...`);
    const writePromises = Object.entries(typesData).map(async ([typeName, pokemons]) => {
      const filePath = path.join(OUTPUT_DIR, `${typeName}.json`);
      await fs.writeFile(filePath, JSON.stringify(pokemons, null, 2), 'utf-8');
      console.log(`Written ${pokemons.length} Pokémon to ${typeName}.json`);
    });

    await Promise.all(writePromises);

    console.log('All type-specific JSON files have been successfully created!');
  } catch (error) {
    console.error(`An error occurred: ${error.message}`);
  }
}

// Execute the main function
fetchAndCategorizePokemon();
