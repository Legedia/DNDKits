const rollButton = document.getElementById('rollButton');
const rollResult = document.getElementById('rollResult');
const sidesInput = document.getElementById('sidesInput');
const numDiceInput = document.getElementById('numDiceInput');
const modifierInput = document.getElementById('modifierInput');
const rollHistoryList = document.querySelector('#rollHistory ul');
const advantageInput = document.getElementById('advantageInput');
const diceColorInput = document.getElementById('diceColorInput');

rollButton.addEventListener('click', () => {
    const sides = parseInt(sidesInput.value);
    const numDice = parseInt(numDiceInput.value);
    const modifier = parseInt(modifierInput.value);
    const advantage = advantageInput.value;
    const diceColor = diceColorInput.value;

    if (isNaN(sides) || sides < 1 || isNaN(numDice) || numDice < 1) {
        alert('Please enter valid numbers for sides and dice.');
        return;
    }

    // Add dice roll animation
    rollResult.textContent = "...rolling...";
    rollButton.disabled = true; // Disable button during roll
    sidesInput.disabled = true; // Disable input during roll
    numDiceInput.disabled = true;
    modifierInput.disabled = true;
    advantageInput.disabled = true;
    diceColorInput.disabled = true;


    setTimeout(() => {
        let rolls = [];
        for (let i = 0; i < numDice; i++) {
            rolls.push(Math.floor(Math.random() * sides) + 1);
        }

        let totalResult = rolls.reduce((sum, roll) => sum + roll, 0) + modifier;
        let resultText = `${numDice}d${sides}`;
        if (modifier > 0) {
            resultText += `+${modifier}`;
        } else if (modifier < 0) {
            resultText += `${modifier}`;
        }

        let displayRolls = [...rolls]; //copy rolls array
        if (advantage === 'advantage') {
            let rolls2 = [];
            for (let i = 0; i < numDice; i++) {
                rolls2.push(Math.floor(Math.random() * sides) + 1);
            }
            let totalResult2 = rolls2.reduce((sum, roll) => sum + roll, 0) + modifier;
            if (totalResult2 > totalResult) {
                totalResult = totalResult2;
                displayRolls = [...rolls2];
                resultText += ` (Advantage: ${rolls.join('+')} vs ${rolls2.join('+')})`;
            }
            else {
                resultText += ` (Advantage: ${rolls2.join('+')} vs ${rolls.join('+')})`;
            }
        } else if (advantage === 'disadvantage') {
            let rolls2 = [];
            for (let i = 0; i < numDice; i++) {
                rolls2.push(Math.floor(Math.random() * sides) + 1);
            }
            let totalResult2 = rolls2.reduce((sum, roll) => sum + roll, 0) + modifier;
            if (totalResult2 < totalResult) {
                totalResult = totalResult2;
                displayRolls = [...rolls2];
                resultText += ` (Disadvantage: ${rolls.join('+')} vs ${rolls2.join('+')})`;
            }
            else {
                resultText += ` (Disadvantage: ${rolls2.join('+')} vs ${rolls.join('+')})`;
            }
        }

        let isCritical = false;
        let isFumble = false;
        if (numDice === 1) {
            if (rolls[0] === sides) {
                isCritical = true;
                resultText += " - Critical Hit!";
            } else if (rolls[0] === 1) {
                isFumble = true;
                resultText += " - Critical Miss!";
            }
        }

        resultText += `: <span style="color:${diceColor}">${totalResult}</span>  (${displayRolls.join('+')})`; //show each die

        rollResult.innerHTML = resultText;
        rollButton.disabled = false; // Re-enable button
        sidesInput.disabled = false; // Re-enable input
        numDiceInput.disabled = false;
        modifierInput.disabled = false;
        advantageInput.disabled = false;
        diceColorInput.disabled = false;

        // Add to roll history
        const listItem = document.createElement('li');
        listItem.innerHTML = resultText;
        rollHistoryList.appendChild(listItem);

        //keep only the last 10 rolls
        if (rollHistoryList.children.length > 10) {
            rollHistoryList.removeChild(rollHistoryList.firstChild);
        }

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
    mapData = [] // Reset mapData
    for (let i = 0; i < mapHeight; i++) {
        const row = []
        for (let j = 0; j < mapWidth; j++) {
            row.push('grassland'); // Default terrain
        }
        mapData.push(row);
    }
}

function drawMap(ctx, mapData, tileSize) {
    const mapWidth = mapData[0].length;
    const mapHeight = mapData.length;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clear canvas

    for (let y = 0; y < mapHeight; y++) {
        for (let x = 0; x < mapWidth; x++) {
            let color;
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
