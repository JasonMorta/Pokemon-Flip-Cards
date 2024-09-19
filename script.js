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

    // Fetch only the first 5 Pokémon
    for (let i = 1; i <= 5; i++) {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
        const pokemon = await response.json();

        // Create card for each Pokémon
        const cardOuter = document.createElement('div');
        cardOuter.classList.add('card-outer');

        const pokemonCard = document.createElement('div');
        pokemonCard.classList.add('pokemon-card');

        // Extract the Pokémon's type and get its color
        const pokemonType = pokemon.types[0].type.name;
        const cardColor = typeColors[pokemonType] || '#f9f9f9'; // Default color if type is not in the map

        // Create front of the card
        const cardFront = document.createElement('div');
        cardFront.classList.add('card-front');

        // Apply the type-based background color to the front of the card
        cardFront.style.backgroundColor = cardColor;

        cardFront.innerHTML = `
            <div class="pokemon-number">#${pokemon.id.toString().padStart(3, '0')}</div>
            <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}">
            <div class="pokemon-name">${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</div>
        `;

        // Create back of the card (stats and other details)
        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');

        // Apply the same background color to the back of the card
        cardBack.style.backgroundColor = cardColor;

        // Extract additional Pokémon details
        const height = (pokemon.height / 10).toFixed(1); // Convert height to meters
        const weight = (pokemon.weight / 10).toFixed(1); // Convert weight to kilograms
        const abilities = pokemon.abilities.map(ability => ability.ability.name).join(', '); // Get list of abilities
        const stats = pokemon.stats.map(stat => `<p>${stat.stat.name}: ${stat.base_stat}</p>`).join('');

        cardBack.innerHTML = `
            <div class="pokemon-details">
                <section>
                    <h4>Stats</h4>
                    ${stats}
                </section>
                <section>
                    <h4>Details</h4>
                    <p>Height: ${height} m</p>
                    <p>Weight: ${weight} kg</p>
                </section>
               <section>
                    <h4>Abilities</h4>
                    <p>${abilities}</p>
               </section>
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
        // cardOuter.addEventListener('mouseleave', () => {
        //     pokemonCard.classList.remove('flip-card'); // Flip back on mouse leave
        // });
    }
}

fetchPokemon();
