const rollButton = document.getElementById('rollButton');
const rollResult = document.getElementById('rollResult');
const sidesInput = document.getElementById('sidesInput');

rollButton.addEventListener('click', () => {
    const sides = parseInt(sidesInput.value);
    if (isNaN(sides) || sides < 1) {
        alert('Please enter a valid number of sides.');
        return;
    }

    // Add dice roll animation
    rollResult.textContent = "...rolling...";
    rollButton.disabled = true; // Disable button during roll
    sidesInput.disabled = true; // Disable input during roll

    setTimeout(() => {
        const result = Math.floor(Math.random() * sides) + 1;
        rollResult.textContent = result;
        rollButton.disabled = false; // Re-enable button
        sidesInput.disabled = false; // Re-enable input
    }, 1000); // Simulate rolling time (1 second)

    rollButton.style.backgroundColor = '#555';
    setTimeout(() => {
        rollButton.style.backgroundColor = '#007bff';
    }, 200);
});

const stats = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

stats.forEach(stat => {
    const input = document.getElementById(stat);
    const mod = document.getElementById(stat + 'Mod');

    input.addEventListener('input', () => {
        const score = parseInt(input.value);
        const modifier = Math.floor((score - 10) / 2);
        mod.textContent = `(${modifier >= 0 ? '+' : ''}${modifier})`;
    });
});

const calculatorSelect = document.getElementById('calculator-select');
const calculators = document.querySelectorAll('.calculator-container');

calculatorSelect.addEventListener('change', () => {
    const selectedCalculatorId = calculatorSelect.value;
    calculators.forEach(calc => {
        calc.style.display = 'none';
    });

    if (selectedCalculatorId) {
        document.getElementById(selectedCalculatorId).style.display = 'block';

        if (selectedCalculatorId === "map-generator") {
            document.getElementById(selectedCalculatorId).addEventListener('click', function (event) {
                event.stopPropagation();
            });
        }
    }
});

document.getElementById('calculateCR').addEventListener('click', function () {
    const hp = parseInt(document.getElementById('hp').value);
    const ac = parseInt(document.getElementById('ac').value);
    const dpr = parseInt(document.getElementById('dpr').value);
    const attackBonus = parseInt(document.getElementById('attackBonus').value);
    const saveDC = parseInt(document.getElementById('saveDC').value);

    const defensiveCR = calculateDefensiveCR(hp, ac);
    const offensiveCR = calculateOffensiveCR(dpr, attackBonus, saveDC);
    const finalCR = (defensiveCR + offensiveCR) / 2;

    document.getElementById('defensiveTable').textContent = getDefensiveTable();
    document.getElementById('offensiveTable').textContent = getOffensiveTable();
    document.getElementById('finalCR').textContent = finalCR;

    document.getElementById('crTables').style.display = 'block';
});

document.getElementById('generateTreasure').addEventListener('click', function () {
    const partyLevel = parseInt(document.getElementById('partyLevel').value);
    const encounterCR = parseInt(document.getElementById('encounterCR').value);
    const location = document.getElementById('location').value;

    const treasure = generateTreasure(partyLevel, encounterCR, location);

    const treasureList = document.getElementById('treasureList');
    treasureList.innerHTML = '';
    treasure.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        treasureList.appendChild(li);
    });
});

function calculateDefensiveCR(hp, ac) {
    return "Defensive CR Calculated";
}

function calculateOffensiveCR(dpr, attackBonus, saveDC) {
    return "Offensive CR Calculated";
}

function generateTreasure(partyLevel, encounterCR, location) {
    return ["Treasure Item 1", "Treasure Item 2"];
}

function getDefensiveTable() {
    return "Defensive Table Data";
}

function getOffensiveTable() {
    return "Offensive Table Data";
}

// --- Map Generator JavaScript Code ---

let selectedTerrain = 'grassland';
let mapData = [] // Declare mapData as a global variable

// Add event listeners to terrain palette buttons
document.querySelectorAll('#terrainPalette button').forEach(button => {
    button.addEventListener('click', function () {
        selectedTerrain = this.dataset.terrain;

        // Add 'selected' class to the clicked button and remove it from others
        document.querySelectorAll('#terrainPalette button').forEach(btn => {
            btn.classList.remove('selected');
        });
        this.classList.add('selected');
    });
});

document.getElementById('mapCanvas').addEventListener('click', function (event) {
    const canvas = document.getElementById('mapCanvas');
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const mapWidth = parseInt(document.getElementById('mapWidth').value);
    const mapHeight = parseInt(document.getElementById('mapHeight').value);
    const tileSize = canvas.width / mapWidth;
    const gridX = Math.floor(x / tileSize);
    const gridY = Math.floor(y / tileSize);

    // Check if mapData is initialized
    if (!mapData || mapData.length === 0 || mapData[0].length === 0) {
        const initialMapWidth = parseInt(document.getElementById('mapWidth').value);
        const initialMapHeight = parseInt(document.getElementById('mapHeight').value);
        generateMapData(initialMapWidth, initialMapHeight); // Initialize mapData
    }

    updateMapTile(gridX, gridY, selectedTerrain);
});

// --- Add Event Listener for Generate Map Button ---
document.getElementById('generateMap').addEventListener('click', function () {
    const mapWidth = parseInt(document.getElementById('mapWidth').value);
    const mapHeight = parseInt(document.getElementById('mapHeight').value);
    generateMap(mapWidth, mapHeight);
});

function generateMap(mapWidth, mapHeight) {
    const canvas = document.getElementById('mapCanvas');
    const ctx = canvas.getContext('2d');
    const tileSize = canvas.width / mapWidth;

    generateMapData(mapWidth, mapHeight); // Initialize mapData
    drawMap(ctx, mapData, tileSize);
    updateColorKey(); // Update the color key after generating the map
}


function updateMapTile(gridX, gridY, terrainType) {
    const canvas = document.getElementById('mapCanvas');
    const ctx = canvas.getContext('2d');
    const mapWidth = parseInt(document.getElementById('mapWidth').value);
    const mapHeight = parseInt(document.getElementById('mapHeight').value);
    const tileSize = canvas.width / mapWidth;

    if (gridX >= 0 && gridX < mapWidth && gridY >= 0 && gridY < mapHeight) {
        mapData[gridY][gridX] = terrainType; // Update mapData
        drawMap(ctx, mapData, tileSize); // Redraw the entire map.  This is the key change.
    }
}

function generateMapData(mapWidth, mapHeight) {
    mapData = []; // Reset mapData
    for (let i = 0; i < mapHeight; i++) {
        const row = [];
        for (let j = 0; j < mapWidth; j++) {
            row.push('grassland'); // Populate with grassland
        }
        mapData.push(row);
    }
}

function drawMap(ctx, mapData, tileSize) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clear the canvas

    for (let y = 0; y < mapData.length; y++) {
        for (let x = 0; x < mapData[y].length; x++) {
            let color = 'lightgray'; // Default color

            switch (mapData[y][x]) {
                case 'grassland':
                    color = 'green';
                    break;
                case 'forest':
                    color = 'darkgreen';
                    break;
                case 'desert':
                    color = 'yellow';
                    break;
                case 'mountain':
                    color = 'gray';
                    break;
                case 'rock':
                    color = 'darkgray';
                    break;
                case 'water':
                    color = 'blue';
                    break;
            }

            ctx.fillStyle = color;
            ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
            ctx.strokeStyle = '#ccc';
            ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
        }
    }
}

function updateColorKey() {
    const keyItems = document.querySelectorAll('#mapKey .key-item');

    keyItems.forEach(item => {
        const keyColor = item.querySelector('.key-color');
        const terrain = keyColor.dataset.terrain;
        keyColor.style.backgroundColor = getTerrainColor(terrain);
    });
}

function getTerrainColor(terrain) {
    switch (terrain) {
        case 'grassland':
            return 'green';
        case 'forest':
            return 'darkgreen';
        case 'desert':
            return 'yellow';
        case 'mountain':
            return 'gray';
        case 'rock':
            return 'darkgray';
        case 'water':
            return 'blue';
        default:
            return 'lightgray'; // Default color
    }
}
