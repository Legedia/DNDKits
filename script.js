// --- General Calculator JavaScript Code ---

const rollButton = document.getElementById('rollButton');
const rollResult = document.getElementById('rollResult');
const sidesInput = document.getElementById('sidesInput');

rollButton.addEventListener('click', () => {
    const sides = parseInt(sidesInput.value);
    if (isNaN(sides) || sides < 1) {
        alert('Please enter a valid number of sides.');
        return;
    }
    const result = Math.floor(Math.random() * sides) + 1;
    rollResult.textContent = `You rolled: ${result}`;
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
let mapData =// Declare mapData as a global variable

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

function getMapDataFromCanvas(mapWidth, mapHeight) {
    //This function is no longer needed
}

function updateMapTile(gridX, gridY, terrainType) {
    const canvas = document.getElementById('mapCanvas');
    const ctx = canvas.getContext('2d');
    const mapWidth = parseInt(document.getElementById('mapWidth').value);
    const mapHeight = parseInt(document.getElementById('mapHeight').value);
    const tileSize = canvas.width / mapWidth;

    if (gridX >= 0 && gridX < mapWidth && gridY >= 0 && gridY < mapHeight) {
        mapData[gridY][gridX] = terrainType; // Update mapData
        drawMap(ctx, mapData, tileSize); // Redraw the entire map
    }
}

function generateMapData(mapWidth, mapHeight) {
    mapData =// Reset mapData
    for (let i = 0; i < mapHeight; i++) {
        const row =
        for (let j = 0; j < mapWidth; j++) {
            row.push('grassland'); // Populate with grassland
        }
        mapData.push(row);
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