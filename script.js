document.addEventListener('DOMContentLoaded', function() {
    // Calculator functionality
    const calculatorSelect = document.getElementById('calculator-select');
    const calculatorContainers = document.querySelectorAll('.calculator-container');

    // Hide all calculator containers on page load
    calculatorContainers.forEach(container => {
        container.style.display = 'none';
    });

    calculatorSelect.addEventListener('change', function() {
        calculatorContainers.forEach(container => {
            container.style.display = 'none';
        });

        const selectedCalculator = document.getElementById(this.value);
        if (selectedCalculator) {
            selectedCalculator.style.display = 'block';
        }
        if (this.value === ""){
            calculatorContainers.forEach(container => {
                container.style.display = 'none';
            });
        }
    });

    // Dice Roller
    const rollButton = document.getElementById('rollButton');
    if (rollButton) {
        rollButton.addEventListener('click', function() {
            const sides = parseInt(document.getElementById('sidesInput').value);
            const result = Math.floor(Math.random() * sides) + 1;
            document.getElementById('rollResult').textContent = `You rolled a ${result}`;
        });
    }

    // Character Stat Calculator
    const statCalculator = document.getElementById('stat-calculator');
    if (statCalculator) {
        const stats = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
        stats.forEach(stat => {
            document.getElementById(stat).addEventListener('input', function() {
                const score = parseInt(this.value);
                const modifier = Math.floor((score - 10) / 2);
                document.getElementById(`${stat}Mod`).textContent = `(${modifier >= 0 ? '+' : ''}${modifier})`;
            });
            //initialize the values.
            const initialScore = parseInt(document.getElementById(stat).value);
            const initialModifier = Math.floor((initialScore - 10) / 2);
            document.getElementById(`${stat}Mod`).textContent = `(${initialModifier >= 0 ? '+' : ''}${initialModifier})`;
        });
    }

    // Challenge Rating (CR) Calculator
    const calculateCRButton = document.getElementById('calculateCR');
    if (calculateCRButton) {
        calculateCRButton.addEventListener('click', function() {
            const hp = parseInt(document.getElementById('hp').value);
            const ac = parseInt(document.getElementById('ac').value);
            const dpr = parseInt(document.getElementById('dpr').value);
            const attackBonus = parseInt(document.getElementById('attackBonus').value);
            const saveDC = parseInt(document.getElementById('saveDC').value);

            // Placeholder logic for CR calculation (replace with actual D&D CR logic)
            const defensiveCR = Math.round(hp / 25) + Math.round((ac - 10) / 2); // Example placeholder
            const offensiveCR = Math.round(dpr / 5) + Math.round((attackBonus - 3) / 2) + Math.round((saveDC - 13) / 2); // Example placeholder
            const finalCR = Math.round((defensiveCR + offensiveCR) / 2);

            document.getElementById('defensiveTable').textContent = defensiveCR;
            document.getElementById('offensiveTable').textContent = offensiveCR;
            document.getElementById('finalCR').textContent = finalCR;
        });
    }

    // Treasure Generator (Placeholder)
    const generateTreasureButton = document.getElementById('generateTreasure');
    if (generateTreasureButton) {
        generateTreasureButton.addEventListener('click', function() {
            const partyLevel = parseInt(document.getElementById('partyLevel').value);
            const encounterCR = parseInt(document.getElementById('encounterCR').value);
            const location = document.getElementById('location').value;

            // Placeholder treasure generation logic
            const treasure = [`${location} treasure: ${partyLevel} gold, ${encounterCR} gems`];
            const treasureList = document.getElementById('treasureList');
            treasureList.innerHTML = ''; // Clear previous results
            treasure.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                treasureList.appendChild(li);
            });
        });
    }

    // Map Generator
    const generateMapButton = document.getElementById('generateMap');
    if (generateMapButton) {
        generateMapButton.addEventListener('click', function() {
            const width = parseInt(document.getElementById('mapWidth').value);
            const height = parseInt(document.getElementById('mapHeight').value);
            const canvas = document.getElementById('mapCanvas');
            const ctx = canvas.getContext('2d');
            canvas.width = width * 20; // Example tile size: 20px
            canvas.height = height * 20;

            // Simple random terrain generation
            for (let x = 0; x < width; x++) {
                for (let y = 0; y < height; y++) {
                    const terrainType = ['grassland', 'forest', 'desert', 'mountain', 'rock', 'water'][Math.floor(Math.random() * 6)];
                    const color = getTerrainColor(terrainType);
                    ctx.fillStyle = color;
                    ctx.fillRect(x * 20, y * 20, 20, 20);
                }
            }
        });
    }

    // Terrain Palette Interaction
    const terrainPalette = document.getElementById('terrainPalette');
    if (terrainPalette) {
        let selectedTerrain = 'grassland'; // Default terrain

        terrainPalette.addEventListener('click', function(event) {
            if (event.target.tagName === 'BUTTON') {
                selectedTerrain = event.target.dataset.terrain;
                console.log(`Selected terrain: ${selectedTerrain}`);
            }
        });

        // Map Canvas Interaction
        const mapCanvas = document.getElementById('mapCanvas');
        if (mapCanvas) {
            mapCanvas.addEventListener('click', function(event) {
                const rect = mapCanvas.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                const tileX = Math.floor(x / 20); // Tile size: 20px
                const tileY = Math.floor(y / 20);
                const ctx = mapCanvas.getContext('2d');
                ctx.fillStyle = getTerrainColor(selectedTerrain);
                ctx.fillRect(tileX * 20, tileY * 20, 20, 20);
            });
        }
    }

    // Helper function to get terrain color
    function getTerrainColor(terrain) {
        switch (terrain) {
            case 'grassland': return 'green';
            case 'forest': return 'darkgreen';
            case 'desert': return 'yellow';
            case 'mountain': return 'gray';
            case 'rock': return 'darkgray';
            case 'water': return 'blue';
            default: return 'white';
        }
    }
});