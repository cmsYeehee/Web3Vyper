// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCCmE8IkF1SR_-FUySymGqaLa2MSp8-0EA",
    authDomain: "vyperwebapp.firebaseapp.com",
    projectId: "vyperwebapp",
    storageBucket: "vyperwebapp.firebasestorage.app",
    messagingSenderId: "713529305807",
    appId: "1:713529305807:web:51975152f640bac24be5ba",
    measurementId: "G-532GMLFPMB"
};

// Contract ABIs - Ensure these match your deployed contracts
const characterABI = [
    {
        "inputs": [
            {"internalType": "string", "name": "name", "type": "string"},
            {"internalType": "uint8", "name": "class_choice", "type": "uint8"}
        ],
        "name": "create_character",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "token_id", "type": "uint256"}],
        "name": "get_character_details",
        "outputs": [
            {"internalType": "string", "name": "", "type": "string"},
            {"internalType": "uint8", "name": "", "type": "uint8"},
            {"internalType": "uint8", "name": "", "type": "uint8"},
            {"internalType": "uint8", "name": "", "type": "uint8"},
            {"internalType": "uint8", "name": "", "type": "uint8"},
            {"internalType": "uint8", "name": "", "type": "uint8"},
            {"internalType": "uint16", "name": "", "type": "uint16"},
            {"internalType": "uint16", "name": "", "type": "uint16"},
            {"internalType": "uint16", "name": "", "type": "uint16"},
            {"internalType": "bool", "name": "", "type": "bool"},
            {"internalType": "address", "name": "", "type": "address"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "token_id", "type": "uint256"}],
        "name": "toggle_battle_availability",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint8", "name": "class_type", "type": "uint8"}],
        "name": "get_character_class_name",
        "outputs": [{"internalType": "string", "name": "", "type": "string"}],
        "stateMutability": "view",
        "type": "function"
    }
];

const itemABI = [
    {
        "inputs": [
            {"internalType": "string", "name": "name", "type": "string"},
            {"internalType": "uint8", "name": "item_type", "type": "uint8"},
            {"internalType": "uint8", "name": "rarity", "type": "uint8"}
        ],
        "name": "create_item",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "token_id", "type": "uint256"}],
        "name": "get_item_details",
        "outputs": [
            {"internalType": "string", "name": "", "type": "string"},
            {"internalType": "uint8", "name": "", "type": "uint8"},
            {"internalType": "uint8", "name": "", "type": "uint8"},
            {"internalType": "uint8", "name": "", "type": "uint8"},
            {"internalType": "uint8", "name": "", "type": "uint8"},
            {"internalType": "uint8", "name": "", "type": "uint8"},
            {"internalType": "address", "name": "", "type": "address"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint8", "name": "item_type", "type": "uint8"}],
        "name": "get_item_type_name",
        "outputs": [{"internalType": "string", "name": "", "type": "string"}],
        "stateMutability": "view",
        "type": "function"
    }
];

const battleGameABI = [
    {
        "inputs": [
            {"internalType": "uint256", "name": "character_id", "type": "uint256"},
            {"internalType": "uint256", "name": "item_id", "type": "uint256"}
        ],
        "name": "equip_item",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "uint256", "name": "character_id1", "type": "uint256"},
            {"internalType": "uint256", "name": "character_id2", "type": "uint256"}
        ],
        "name": "battle",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "character_id", "type": "uint256"}],
        "name": "get_equipped_items",
        "outputs": [
            {"internalType": "uint256", "name": "", "type": "uint256"},
            {"internalType": "uint256", "name": "", "type": "uint256"},
            {"internalType": "uint256", "name": "", "type": "uint256"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "battle_id", "type": "uint256"}],
        "name": "get_battle_record",
        "outputs": [
            {"internalType": "uint256", "name": "", "type": "uint256"},
            {"internalType": "uint256", "name": "", "type": "uint256"},
            {"internalType": "uint256", "name": "", "type": "uint256"},
            {"internalType": "uint256", "name": "", "type": "uint256"}
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

// IMPORTANT: REPLACE THESE WITH YOUR ACTUAL DEPLOYED CONTRACT ADDRESSES
const characterContractAddress = "0x982071a15D38f9Cb368Ff5c128a53C400d941DA9";  // Replace with actual Character Contract address
const itemContractAddress = "0xeC8996756C374a4fd48b5c06fd2775b0b87Be1dB";      // Replace with actual Item Contract address
const battleGameContractAddress = "0x3467fCc493968F00adb251a2FB362f4b723B4dB5";  // Replace with actual Battle Game Contract address

// Global variables
let web3;
let accounts = [];
let characterContract;
let itemContract;
let battleGameContract;
let selectedCharacterId = null;
let selectedOpponentId = null;

// Load Firebase scripts dynamically
document.addEventListener('DOMContentLoaded', function() {
    const firebaseAppScript = document.createElement('script');
    firebaseAppScript.src = 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
    document.head.appendChild(firebaseAppScript);

    const firebaseAnalyticsScript = document.createElement('script');
    firebaseAnalyticsScript.src = 'https://www.gstatic.com/firebasejs/9.6.10/firebase-analytics.js';
    document.head.appendChild(firebaseAnalyticsScript);

    // Initialize Firebase after scripts are loaded
    firebaseAppScript.onload = function() {
        firebaseAnalyticsScript.onload = function() {
            const app = firebase.initializeApp(firebaseConfig);
            const analytics = firebase.analytics();
            
            // Initialize the application
            init();
        };
    };
});

// Initialize the application
async function init() {
    if (window.ethereum) {
        try {
            // Request account access
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            web3 = new Web3(window.ethereum);
            
            // Get connected accounts
            accounts = await web3.eth.getAccounts();
            updateWalletInfo();
            
            // Initialize contracts
            characterContract = new web3.eth.Contract(characterABI, characterContractAddress);
            itemContract = new web3.eth.Contract(itemABI, itemContractAddress);
            battleGameContract = new web3.eth.Contract(battleGameABI, battleGameContractAddress);
            
            // Load characters and items
            await loadCharacters();
            await loadItems();
            await loadBattleHistory();
            
            // Set up event listeners for MetaMask
            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('chainChanged', () => window.location.reload());
            
            console.log("Web3 initialized successfully");
        } catch (error) {
            console.error("Error initializing Web3:", error);
            alert("Failed to connect to the Ethereum network. Please make sure MetaMask is installed and connected.");
        }
    } else {
        console.error("MetaMask not detected");
        alert("Please install MetaMask to use this application");
    }
}

// Update wallet information display
function updateWalletInfo() {
    const walletAddressElem = document.getElementById('wallet-address');
    const connectWalletBtn = document.getElementById('connect-wallet');
    
    if (accounts.length > 0) {
        const shortAddress = `${accounts[0].substring(0, 6)}...${accounts[0].substring(accounts[0].length - 4)}`;
        walletAddressElem.textContent = shortAddress;
        connectWalletBtn.textContent = "Connected";
    } else {
        walletAddressElem.textContent = "Not connected";
        connectWalletBtn.textContent = "Connect Wallet";
    }
}

// Handle accounts changed in MetaMask
function handleAccountsChanged(newAccounts) {
    if (newAccounts.length === 0) {
        alert("Please connect to MetaMask.");
    } else if (newAccounts[0] !== accounts[0]) {
        accounts = newAccounts;
        updateWalletInfo();
        loadCharacters();
        loadItems();
    }
}

// Load characters owned by the current user
async function loadCharacters() {
    const characterListElem = document.getElementById('character-list');
    characterListElem.innerHTML = '<p>Loading characters...</p>';
    
    try {
        // Get character count and load characters
        const characterCount = await characterContract.methods.get_character_count().call();
        let charactersHTML = '';
        
        for (let i = 0; i < characterCount; i++) {
            try {
                const characterId = await characterContract.methods.get_character_at_index(i).call();
                const character = await characterContract.methods.get_character_details(characterId).call();
                const className = await characterContract.methods.get_character_class_name(character[1]).call();
                
                charactersHTML += `
                    <div class="character-card" data-id="${characterId}">
                        <h3>${character[0]}</h3>
                        <div class="character-stats">
                            <p>Class: ${className}</p>
                            <p>Level: ${character[5]}</p>
                            <p>Strength: ${character[2]}</p>
                            <p>Defense: ${character[3]}</p>
                            <p>Speed: ${character[4]}</p>
                            <p>W/L: ${character[7]}/${character[8]}</p>
                            <div class="status-bar xp-bar">
                                <div class="status-fill" style="width: ${(character[6] / (character[5] * 100)) * 100}%"></div>
                            </div>
                            <p>XP: ${character[6]}/${character[5] * 100}</p>
                        </div>
                        <div class="character-actions">
                            <button class="select-character-btn">Select for Battle</button>
                            <button class="toggle-availability-btn">${character[9] ? 'Set Unavailable' : 'Set Available'}</button>
                            <button class="equip-items-btn">Equip Items</button>
                        </div>
                    </div>
                `;
            } catch (error) {
                console.error(`Error loading character at index ${i}:`, error);
            }
        }
        
        if (charactersHTML === '') {
            characterListElem.innerHTML = '<p>No characters found. Create a new character to start!</p>';
        } else {
            characterListElem.innerHTML = charactersHTML;
            
            // Add event listeners to character buttons
            document.querySelectorAll('.select-character-btn').forEach(btn => {
                btn.addEventListener('click', selectCharacterForBattle);
            });
            
            document.querySelectorAll('.toggle-availability-btn').forEach(btn => {
                btn.addEventListener('click', toggleCharacterAvailability);
            });
            
            document.querySelectorAll('.equip-items-btn').forEach(btn => {
                btn.addEventListener('click', openEquipItemsModal);
            });
        }
    } catch (error) {
        console.error("Error loading characters:", error);
        characterListElem.innerHTML = '<p>Error loading characters. Please try again.</p>';
    }
}

// Load items owned by the current user
async function loadItems() {
    const itemListElem = document.getElementById('item-list');
    itemListElem.innerHTML = '<p>Loading items...</p>';
    
    try {
        const itemCount = await itemContract.methods.get_item_count().call();
        let itemsHTML = '';
        
        for (let i = 0; i < itemCount; i++) {
            try {
                const itemId = await itemContract.methods.get_item_at_index(i).call();
                const item = await itemContract.methods.get_item_details(itemId).call();
                const typeName = await itemContract.methods.get_item_type_name(item[1]).call();
                
                itemsHTML += `
                    <div class="item-card" data-id="${itemId}" data-type="${item[1]}">
                        <h3>${item[0]}</h3>
                        <div class="item-stats">
                            <p>Type: ${typeName}</p>
                            <p>Strength: +${item[2]}</p>
                            <p>Defense: +${item[3]}</p>
                            <p>Speed: +${item[4]}</p>
                        </div>
                    </div>
                `;
            } catch (error) {
                console.error(`Error loading item at index ${i}:`, error);
            }
        }
        
        if (itemsHTML === '') {
            itemListElem.innerHTML = '<p>No items found.</p>';
        } else {
            itemListElem.innerHTML = itemsHTML;
        }
    } catch (error) {
        console.error("Error loading items:", error);
        itemListElem.innerHTML = '<p>Error loading items. Please try again.</p>';
    }
}

// Load battle history
async function loadBattleHistory() {
    const battleHistoryElem = document.getElementById('battle-history');
    battleHistoryElem.innerHTML = '<p>Loading battle history...</p>';
    
    try {
        const battleCount = await battleGameContract.methods.get_battle_count().call();
        
        if (battleCount > 0) {
            let battleHistoryHTML = '';
            
            for (let i = 0; i < battleCount; i++) {
                try {
                    const battle = await battleGameContract.methods.get_battle_record(i).call();
                    
                    // Get character names for better display
                    const char1 = await characterContract.methods.get_character_details(battle[0]).call();
                    const char2 = await characterContract.methods.get_character_details(battle[1]).call();
                    const winner = await characterContract.methods.get_character_details(battle[2]).call();
                    
                    const battleDate = new Date(parseInt(battle[3]) * 1000).toLocaleString();
                    
                    battleHistoryHTML += `
                        <div class="battle-card">
                            <h3>Battle #${i + 1}</h3>
                            <p><strong>${char1[0]}</strong> vs <strong>${char2[0]}</strong></p>
                            <p>Winner: <strong>${winner[0]}</strong></p>
                            <p>Date: ${battleDate}</p>
                        </div>
                    `;
                } catch (error) {
                    console.error(`Error loading battle ${i}:`, error);
                }
            }
            
            battleHistoryElem.innerHTML = battleHistoryHTML;
        } else {
            battleHistoryElem.innerHTML = '<p>No battles yet.</p>';
        }
    } catch (error) {
        console.error("Error loading battle history:", error);
        battleHistoryElem.innerHTML = '<p>Error loading battle history. Please try again.</p>';
    }
}

// Select a character for battle
function selectCharacterForBattle(event) {
    const characterCard = event.target.closest('.character-card');
    const characterId = characterCard.dataset.id;
    
    if (selectedCharacterId === characterId) {
        // Deselect
        selectedCharacterId = null;
        document.querySelectorAll('.character-card').forEach(card => {
            card.classList.remove('selected-character');
        });
        document.getElementById('your-character').innerHTML = '<h3>Your Character</h3><p>Select a character from your collection</p>';
    } else {
        // Select
        selectedCharacterId = characterId;
        document.querySelectorAll('.character-card').forEach(card => {
            card.classList.remove('selected-character');
        });
        characterCard.classList.add('selected-character');
        
        // Clone the character card and display it in the battle arena
        const characterInfo = characterCard.querySelector('.character-stats').cloneNode(true);
        document.getElementById('your-character').innerHTML = `<h3>${characterCard.querySelector('h3').textContent}</h3>`;
        document.getElementById('your-character').appendChild(characterInfo);
    }
    
    updateBattleButton();
}

// Select an opponent for battle
async function selectOpponent(event) {
    const characterCard = event.target.closest('.character-card');
    const characterId = characterCard.dataset.id;
    
    if (selectedOpponentId === characterId) {
        // Deselect
        selectedOpponentId = null;
        document.querySelectorAll('.character-card').forEach(card => {
            card.classList.remove('selected-opponent');
        });
        document.getElementById('opponent-character').innerHTML = '<h3>Opponent</h3><p>Select an opponent to battle</p>';
    } else {
        // Select
        selectedOpponentId = characterId;
        document.querySelectorAll('.character-card').forEach(card => {
            card.classList.remove('selected-opponent');
        });
        characterCard.classList.add('selected-opponent');
        
        // Clone the character card and display it in the battle arena
        const characterInfo = characterCard.querySelector('.character-stats').cloneNode(true);
        document.getElementById('opponent-character').innerHTML = `<h3>${characterCard.querySelector('h3').textContent}</h3>`;
        document.getElementById('opponent-character').appendChild(characterInfo);
    }
    
    updateBattleButton();
}

// Update the battle button state
function updateBattleButton() {
    const battleButton = document.getElementById('start-battle');
    battleButton.disabled = !(selectedCharacterId && selectedOpponentId);
}

// Toggle character availability for battle
async function toggleCharacterAvailability(event) {
    const characterCard = event.target.closest('.character-card');
    const characterId = characterCard.dataset.id;
    
    try {
        await characterContract.methods.toggle_battle_availability(characterId).send({ from: accounts[0] });
        
        // Reload characters to reflect the change
        await loadCharacters();
    } catch (error) {
        console.error("Error toggling character availability:", error);
        alert("Failed to toggle character availability. Please try again.");
    }
}

// Create a new character
async function createCharacter(event) {
    event.preventDefault();
    
    const name = document.getElementById('character-name').value;
    const classChoice = document.getElementById('character-class').value;
    
    try {
        await characterContract.methods.create_character(name, classChoice).send({ from: accounts[0] });
        
        alert("Character created successfully!");
        closeModals();
        await loadCharacters();
    } catch (error) {
        console.error("Error creating character:", error);
        alert("Failed to create character. Please try again.");
    }
}

// Open the equip items modal
async function openEquipItemsModal(event) {
    const characterCard = event.target.closest('.character-card');
    const characterId = characterCard.dataset.id;
    
    try {
        // Get character details
        const character = await characterContract.methods.get_character_details(characterId).call();
        const className = await characterContract.methods.get_character_class_name(character[1]).call();
        
        // Get equipped items
        const equipmentResponse = await battleGameContract.methods.get_equipped_items(characterId).call();
        const equippedWeapon = equipmentResponse[0];
        const equippedArmor = equipmentResponse[1];
        const equippedAccessory = equipmentResponse[2];
        
        // Display character info
        document.getElementById('equipment-character-info').innerHTML = `
            <h3>${character[0]} (${className})</h3>
            <div class="character-stats">
                <p>Level: ${character[5]}</p>
                <p>Strength: ${character[2]}</p>
                <p>Defense: ${character[3]}</p>
                <p>Speed: ${character[4]}</p>
            </div>
        `;
        
        // Prepare select boxes for items
        const weaponSelect = document.getElementById('weapon-select');
        const armorSelect = document.getElementById('armor-select');
        const accessorySelect = document.getElementById('accessory-select');
        
        weaponSelect.innerHTML = '<option value="0">None</option>';
        armorSelect.innerHTML = '<option value="0">None</option>';
        accessorySelect.innerHTML = '<option value="0">None</option>';
        
        // Get all items and populate select boxes
        const itemCount = await itemContract.methods.get_item_count().call();
        
        for (let i = 0; i < itemCount; i++) {
            const itemId = await itemContract.methods.get_item_at_index(i).call();
            const item = await itemContract.methods.get_item_details(itemId).call();
            const typeName = await itemContract.methods.get_item_type_name(item[1]).call();
            
            const option = `<option value="${itemId}" ${
                (item[1] === "0" && itemId === equippedWeapon) ||
                (item[1] === "1" && itemId === equippedArmor) ||
                (item[1] === "2" && itemId === equippedAccessory) 
                ? 'selected' : ''
            }>${item[0]} (${typeName})</option>`;
            
            if (item[1] === "0") weaponSelect.innerHTML += option;
            else if (item[1] === "1") armorSelect.innerHTML += option;
            else if (item[1] === "2") accessorySelect.innerHTML += option;
        }
        
        // Set the character ID for equipment
        document.getElementById('equipped-character-id').value = characterId;
        
        // Show the modal
        const modal = document.getElementById('equip-items-modal');
        modal.style.display = 'block';
    } catch (error) {
        console.error("Error opening equip items modal:", error);
        alert("Failed to load equipment information. Please try again.");
    }
}

// Initiate a battle
async function startBattle() {
    if (!selectedCharacterId || !selectedOpponentId) {
        alert("Please select both your character and an opponent.");
        return;
    }
    
    try {
        await battleGameContract.methods.battle(selectedCharacterId, selectedOpponentId).send({ from: accounts[0] });
        
        // Get the latest battle
        const battleCount = await battleGameContract.methods.get_battle_count().call();
        const latestBattleId = battleCount - 1;
        const battle = await battleGameContract.methods.get_battle_record(latestBattleId).call();
        
        // Get character details
        const char1 = await characterContract.methods.get_character_details(battle[0]).call();
        const char2 = await characterContract.methods.get_character_details(battle[1]).call();
        const winner = await characterContract.methods.get_character_details(battle[2]).call();
        
        // Display battle result
        const battleResultContent = document.getElementById('battle-result-content');
        battleResultContent.innerHTML = `
            <div class="battle-result">
                <p><strong>${char1[0]}</strong> vs <strong>${char2[0]}</strong></p>
                <h3>Winner: ${winner[0]}</h3>
                <p>Experience earned:</p>
                <p>${winner[0]}: +50 XP</p>
                <p>${winner[0] === char1[0] ? char2[0] : char1[0]}: +20 XP</p>
            </div>
        `;
        
        // Show the battle result modal
        document.getElementById('battle-result-modal').style.display = 'block';
        
        // Reset selections
        selectedCharacterId = null;
        selectedOpponentId = null;
        document.querySelectorAll('.character-card').forEach(card => {
            card.classList.remove('selected-character', 'selected-opponent');
        });
        document.getElementById('your-character').innerHTML = '<h3>Your Character</h3><p>Select a character from your collection</p>';
        document.getElementById('opponent-character').innerHTML = '<h3>Opponent</h3><p>Select an opponent to battle</p>';
        
        // Reload data
        await loadCharacters();
        await loadBattleHistory();
    } catch (error) {
        console.error("Error initiating battle:", error);
        alert("Failed to initiate battle. Please try again.");
    }
}

// Utility functions for modals and event listeners
function openCreateCharacterModal() {
    const modal = document.getElementById('create-character-modal');
    modal.style.display = 'block';
}

function closeModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    init();
    
    // Connect wallet button
    const connectWalletBtn = document.getElementById('connect-wallet');
    if (connectWalletBtn) {
        connectWalletBtn.addEventListener('click', init);
    }
    
    // Create character button
    const createCharacterBtn = document.getElementById('create-character-btn');
    if (createCharacterBtn) {
        createCharacterBtn.addEventListener('click', openCreateCharacterModal);
    }
    
    // Create character form
    const createCharacterForm = document.getElementById('create-character-form');
    if (createCharacterForm) {
        createCharacterForm.addEventListener('submit', createCharacter);
    }
    
    // Start battle button
    const startBattleBtn = document.getElementById('start-battle');
    if (startBattleBtn) {
        startBattleBtn.addEventListener('click', startBattle);
    }
    
    // Close modal buttons
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', closeModals);
    });
});