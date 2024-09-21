async function fetchPokemon() {
    const pokemonContainer = document.getElementById('pokemon-container');

    // Define a pastel color map for different Pokémon types
    const typeColors = {
        grass: '#A8D5BA',
        fire: '#F7B299',
        water: '#A4CBEA',
        electric: '#FAE3A4',
        bug: '#C3D6A4',
        normal: '#D3D3D3',
        poison: '#D1A3D1',
        ground: '#E7D3A1',
        fairy: '#F4C2D7',
        fighting: '#D3A4A4',
        psychic: '#F4A7B9',
        rock: '#D3C4A8',
        ghost: '#B6A6C9',
        ice: '#C2E7E7',
        dragon: '#B6A4F9',
        dark: '#A8A2A2',
        steel: '#CACACA',
        flying: '#C0B6D8'
    };

    // Create Pokemon Card and details
    function pokemonCard(pokemon) {
        console.log('pokemon', pokemon)
        // Create card for each Pokémon
        const cardOuter = document.createElement('div');
        cardOuter.classList.add('card-outer');

        const pokemonCard = document.createElement('div');
        pokemonCard.classList.add('pokemon-card');

        // Extract the Pokémon's type and get its color
        const pokemonType = pokemon.types.map(typeInfo => typeInfo);
        const cardColor = typeColors[pokemonType[0]] || '#f9f9f9'; // Default color if type is not in the map

        // Create front of the card
        const cardFront = document.createElement('div');
        cardFront.classList.add('card-front');

        // Apply the type-based background color to the front of the card
        cardFront.style.backgroundColor = cardColor;

        cardFront.innerHTML = `
            <div class="pokemon-number"><p>#${pokemon.id.toString().padStart(3, '0')}</p></div>
            <img src="${pokemon.sprites.official_artwork}" alt="${pokemon.name}">
            <div class="pokemon-name"><h3>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3></div>
        `;

        // Create back of the card (stats and other details)
        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');

        // Apply the same background color to the back of the card
        cardBack.style.backgroundColor = cardColor;

        // Extract additional Pokémon details
        const height = (pokemon.height / 10).toFixed(1); // Convert height to meters
        const weight = (pokemon.weight / 10).toFixed(1); // Convert weight to kilograms
        const abilities = pokemon.abilities.map(ability => ability); // Get list of abilities
        const stats = `
            <p>HP: ${pokemon.stats.hp}</p>
            <p>Attack: ${pokemon.stats.attack}</p>
            <p>Defense: ${pokemon.stats.defense}</p>
            <p>Special-Attack: ${pokemon.stats['special-attack']}</p>
            <p>Special-Defense: ${pokemon.stats['special-defense']}</p>
            <p>Speed: ${pokemon.stats.speed}</p>
        `

        cardBack.innerHTML = `
            <div class="pokemon-details">
                <section>
                    <img src="${pokemon.sprites.showdown}" alt="${pokemon.showdown}">
                    <div class="pokemon-stats">
                        <h4>Stats</h4>
                        ${stats}
                    </div>
                </section>
                <section>
                    <div class="pokemon-stats">
                        <h4>Details</h4>
                        <p>Height: ${height} m</p>
                        <p>Weight: ${weight} kg</p>
                    </div>
                </section>
               <section>
                   <div class="pokemon-stats">
                        <h4>Abilities</h4>
                        <div class="pokemon-type">
                        ${abilities.map(a => `<p>${a.charAt(0).toUpperCase() + a.slice(1)}</p>`).join('')}
                       </div>
                   </div>
               </section>
               <section>
                     <div class="pokemon-stats">
                            <h4>Type</h4>
                            <div class="pokemon-type">
                                ${pokemonType.map(type => `<p>${type.charAt(0).toUpperCase() + type.slice(1)}</p>`).join('')}
                            </div>
                     </div>
            </div>
        `;

        // Append front and back to the card
        pokemonCard.appendChild(cardFront);
        pokemonCard.appendChild(cardBack);
        cardOuter.appendChild(pokemonCard);
        pokemonContainer.appendChild(cardOuter);

        // Add click event to flip the card
        cardOuter.addEventListener('click', () => {
            pokemonCard.classList.add('flip-card'); // Flip on click
        });
        

        // Add mouse leave event to flip the card back to front
        cardOuter.addEventListener('mouseleave', () => {
            pokemonCard.classList.remove('flip-card'); // Flip back on mouse leave
        });
    }

    // React .json file, if no file found fetch from API
    const response = await fetch('./pokemon_data.json');
    const pokemonData = await response.json();
    console.log('pokemonData', pokemonData)

    if (pokemonData.length > 0) {
        for (let i = 0; i < 100; i++) {
            pokemonCard(pokemonData[i])
        }
    } else {
        PokeAPI_Call(response)
    }



    // Fetch only the first 9 Pokémon form API
    async function PokeAPI_Call() {
        for (let i = 1; i <= 9; i++) {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
            const pokemon = await response.json();
            console.log('pokemon', pokemon)
            pokemonCard(pokemon)
        }
    }

}

fetchPokemon();
