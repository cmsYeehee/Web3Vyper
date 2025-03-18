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
    },
    {
        "inputs": [],
        "name": "get_character_count",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "index", "type": "uint256"}],
        "name": "get_character_at_index",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "token_id", "type": "uint256"}],
        "name": "get_character_owner",
        "outputs": [{"internalType": "address", "name": "", "type": "address"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "token_id", "type": "uint256"}],
        "name": "update_battle_record",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "uint256", "name": "token_id", "type": "uint256"},
            {"internalType": "uint16", "name": "amount", "type": "uint16"}
        ],
        "name": "add_experience",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

const itemABI = [
    {
        "inputs": [
            {"internalType": "string", "name": "name", "type": "string"},
            {"internalType": "uint8", "name": "item_type", "type": "uint8"}
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
    },
    {
        "inputs": [],
        "name": "last_token_id",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "item_id", "type": "uint256"}],
        "name": "get_item_owner",
        "outputs": [{"internalType": "address", "name": "", "type": "address"}],
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
    },
    {
        "inputs": [],
        "name": "battle_count",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
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

// NPC characters for training
const npcCharacters = {
    "npc-1": {
        name: "Training Dummy",
        classType: 0,
        strength: 5,
        defense: 5,
        speed: 5,
        level: 1,
        experience: 0,
        wins: 0,
        losses: 0,
        isAvailable: true
    },
    "npc-2": {
        name: "Veteran Soldier",
        classType: 1,
        strength: 12,
        defense: 15,
        speed: 8,
        level: 5,
        experience: 0,
        wins: 0,
        losses: 0,
        isAvailable: true
    },
    "npc-3": {
        name: "Arcane Master",
        classType: 3,
        strength: 20,
        defense: 10,
        speed: 15,
        level: 10,
        experience: 0,
        wins: 0,
        losses: 0,
        isAvailable: true
    }
};

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
            try {
                const app = firebase.initializeApp(firebaseConfig);
                const analytics = firebase.analytics();
                console.log("Firebase initialized successfully");
            } catch (error) {
                console.warn("Firebase initialization failed:", error);
                // Continue with the app anyway, as Firebase is not critical
            }
            
            // Initialize the application
            init();
        };
    };

    // Add event listeners for the web app
    setupEventListeners();
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
            
            // Map contract functions to expected names
            fixContractFunctionMappings();
            
            // Load data
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

// Fix contract function mappings to match expected calls
function fixContractFunctionMappings() {
    // Map character functions
    if (!characterContract.methods.get_character_details && characterContract.methods.characters) {
        characterContract.methods.get_character_details = characterContract.methods.characters;
    }
    
    // Map item functions
    if (!itemContract.methods.get_item_details && itemContract.methods.items) {
        itemContract.methods.get_item_details = itemContract.methods.items;
    }
    
    if (!itemContract.methods.get_item_count) {
        itemContract.methods.get_item_count = async function() {
            try {
                const lastId = await itemContract.methods.last_token_id().call();
                return lastId;
            } catch (e) {
                console.warn("Could not get item count:", e);
                return 10; // Fallback
            }
        };
    }
    
    if (!itemContract.methods.get_item_at_index) {
        itemContract.methods.get_item_at_index = async function(index) {
            return parseInt(index) + 1; // Simple index mapping
        };
    }
    
    // Map battle game functions
    if (!battleGameContract.methods.get_battle_count && battleGameContract.methods.battle_count) {
        battleGameContract.methods.get_battle_count = battleGameContract.methods.battle_count;
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

// Show loading indicator
function showLoadingIndicator(elementId, message = "Loading...") {
    const element = document.getElementById(elementId);
    element.innerHTML = `<div class="loading-spinner"></div><p>${message}</p>`;
}

// Show the loading modal
function showLoadingModal(message = "Processing transaction...") {
    const modal = document.getElementById('loading-modal');
    const messageElem = document.getElementById('loading-message');
    messageElem.textContent = message;
    modal.style.display = 'block';
}

// Hide the loading modal
function hideLoadingModal() {
    const modal = document.getElementById('loading-modal');
    modal.style.display = 'none';
}

// Get class icon based on class type
function getClassIcon(classType) {
    const icons = ["⚔️", "🛡️", "🗡️", "🔮", "🏹"];
    return icons[classType] || "👤";
}

// Get item icon based on item type
function getItemIcon(typeId) {
    const icons = {
        "0": "⚔️", // Weapon
        "1": "🛡️", // Armor
        "2": "💍"  // Accessory
    };
    return icons[typeId] || "📦";
}

// Load characters owned by the current user
async function loadCharacters() {
    const characterListElem = document.getElementById('character-list');
    showLoadingIndicator('character-list', "Loading characters...");
    
    try {
        // Get character count
        let characterCount = 0;
        try {
            characterCount = await characterContract.methods.get_character_count().call();
        } catch (e) {
            console.warn("Error getting character count:", e);
            characterCount = 10; // Try the first 10 character IDs as fallback
        }
        
        let charactersHTML = '';
        
        for (let i = 0; i < characterCount; i++) {
            try {
                // Get character ID
                let characterId;
                try {
                    characterId = await characterContract.methods.get_character_at_index(i).call();
                } catch (e) {
                    characterId = i + 1; // Fallback to index + 1
                }
                
                // Get character details
                const character = await characterContract.methods.get_character_details(characterId).call();
                
                // Check if this character belongs to the current user
                const owner = character[10] || await characterContract.methods.get_character_owner(characterId).call();
                if (owner.toLowerCase() !== accounts[0].toLowerCase()) {
                    continue;
                }
                
                const className = await characterContract.methods.get_character_class_name(character[1]).call();
                const classIcon = getClassIcon(character[1]);
                
                // Calculate XP percentage
                const xpRequired = character[5] * 100;
                const xpPercentage = xpRequired > 0 ? (character[6] / xpRequired) * 100 : 0;
                
                charactersHTML += `
                    <div class="character-card ${className.toLowerCase()}" data-id="${characterId}">
                        <h3>${character[0]}</h3>
                        <div class="character-image ${className.toLowerCase()}">${classIcon}</div>
                        <div class="character-stats">
                            <div class="stat-row">
                                <span class="stat-label">Class:</span>
                                <span>${className}</span>
                            </div>
                            <div class="stat-row">
                                <span class="stat-label">Level:</span>
                                <span>${character[5]}</span>
                            </div>
                            <div class="stat-row">
                                <span class="stat-label">STR:</span>
                                <span>${character[2]}</span>
                            </div>
                            <div class="stat-row">
                                <span class="stat-label">DEF:</span>
                                <span>${character[3]}</span>
                            </div>
                            <div class="stat-row">
                                <span class="stat-label">SPD:</span>
                                <span>${character[4]}</span>
                            </div>
                            <div class="stat-row">
                                <span class="stat-label">W/L:</span>
                                <span>${character[7]}/${character[8]}</span>
                            </div>
                            <div class="status-bar xp-bar" title="XP: ${character[6]}/${xpRequired}">
                                <div class="status-fill" style="width: ${xpPercentage}%"></div>
                            </div>
                            <p>XP: ${character[6]}/${xpRequired}</p>
                        </div>
                        <div class="character-actions">
                            <button class="select-character-btn btn-secondary">Select for Battle</button>
                            <button class="toggle-availability-btn ${character[9] ? 'btn-danger' : 'btn-success'}">${character[9] ? 'Set Unavailable' : 'Set Available'}</button>
                            <button class="equip-items-btn btn-secondary">Equip Items</button>
                        </div>
                    </div>
                `;
            } catch (error) {
                console.error(`Error loading character at index ${i}:`, error);
            }
        }
        
        if (charactersHTML === '') {
            characterListElem.innerHTML = '<p class="placeholder-message">No characters found. Create a new character to start!</p>';
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
        characterListElem.innerHTML = '<p class="placeholder-message">Error loading characters. Please try again.</p>';
    }
}

// Load items owned by the current user
async function loadItems() {
    const itemListElem = document.getElementById('item-list');
    showLoadingIndicator('item-list', "Loading items...");
    
    try {
        // Get item count
        let itemCount = 0;
        try {
            itemCount = await itemContract.methods.get_item_count().call();
        } catch (e) {
            try {
                itemCount = await itemContract.methods.last_token_id().call();
            } catch (e2) {
                console.warn("Could not determine item count, attempting alternative approach");
                itemCount = 10; // Fallback: try the first 10 item IDs
            }
        }
        
        let itemsHTML = '';
        
        for (let i = 1; i <= itemCount; i++) {
            try {
                // Try different approaches to get item details
                let item;
                let itemId = i;
                
                try {
                    if (itemContract.methods.get_item_at_index) {
                        itemId = await itemContract.methods.get_item_at_index(i - 1).call();
                    }
                } catch (e) {
                    console.warn(`Could not get item at index ${i-1}, using ID ${itemId} directly`);
                }
                
                try {
                    item = await itemContract.methods.get_item_details(itemId).call();
                } catch (e) {
                    console.warn(`Could not get details for item ${itemId}:`, e);
                    continue;
                }
                
                // Get item owner
                let itemOwner;
                try {
                    itemOwner = await itemContract.methods.get_item_owner(itemId).call();
                } catch (e) {
                    itemOwner = item[6] || "unknown";
                }
                
                // Skip items not owned by current user
                if (itemOwner.toLowerCase() !== accounts[0].toLowerCase()) {
                    continue;
                }
                
                // Get item type name
                let typeName;
                try {
                    typeName = await itemContract.methods.get_item_type_name(item[1]).call();
                } catch (e) {
                    const typeNames = ["Weapon", "Armor", "Accessory"];
                    typeName = typeNames[item[1]] || "Unknown";
                }
                
                const itemIcon = getItemIcon(item[1]);
                const rarity = item[5] || 3;
                const rarityStars = '★'.repeat(parseInt(rarity));
                
                itemsHTML += `
                    <div class="item-card rarity-${rarity}" data-id="${itemId}" data-type="${item[1]}">
                        <h3>${item[0]}</h3>
                        <div class="item-icon type-${item[1]}">${itemIcon}</div>
                        <div class="item-stats">
                            <div class="stat-row">
                                <span class="stat-label">Type:</span>
                                <span>${typeName}</span>
                            </div>
                            <div class="stat-row">
                                <span class="stat-label">Strength:</span>
                                <span>+${item[2]}</span>
                            </div>
                            <div class="stat-row">
                                <span class="stat-label">Defense:</span>
                                <span>+${item[3]}</span>
                            </div>
                            <div class="stat-row">
                                <span class="stat-label">Speed:</span>
                                <span>+${item[4]}</span>
                            </div>
                            <div class="stat-row">
                                <span class="stat-label">Rarity:</span>
                                <span>${rarityStars}</span>
                            </div>
                        </div>
                    </div>
                `;
            } catch (error) {
                console.error(`Error loading item ${i}:`, error);
            }
        }
        
        if (itemsHTML === '') {
            itemListElem.innerHTML = '<p class="placeholder-message">No items found. Create new items to get started!</p>';
        } else {
            itemListElem.innerHTML = itemsHTML;
        }
    } catch (error) {
        console.error("Error loading items:", error);
        itemListElem.innerHTML = '<p class="placeholder-message">Error loading items. Please try again.</p>';
    }
}

// Load battle history
async function loadBattleHistory() {
    const battleHistoryElem = document.getElementById('battle-history');
    showLoadingIndicator('battle-history', "Loading battle history...");
    
    try {
        // Get battle count
        let battleCount = 0;
        try {
            battleCount = await battleGameContract.methods.get_battle_count().call();
        } catch (e) {
            console.warn("Error getting battle count:", e);
            battleCount = 0;
        }
        
        if (parseInt(battleCount) > 0) {
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
                            <div class="battle-participants">
                                <p>${char1[0]} vs ${char2[0]}</p>
                            </div>
                            <div class="battle-result">
                                <p>Winner: <span class="winner">${winner[0]}</span></p>
                                <p>Date: ${battleDate}</p>
                            </div>
                        </div>
                    `;
                } catch (error) {
                    console.error(`Error loading battle ${i}:`, error);
                }
            }
            
            battleHistoryElem.innerHTML = battleHistoryHTML;
        } else {
            battleHistoryElem.innerHTML = '<p class="placeholder-message">No battles yet. Select characters and start battling!</p>';
        }
    } catch (error) {
        console.error("Error loading battle history:", error);
        battleHistoryElem.innerHTML = '<p class="placeholder-message">Error loading battle history. Please try again.</p>';
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
        const characterName = characterCard.querySelector('h3').textContent;
        const characterStats = characterCard.querySelector('.character-stats').cloneNode(true);
        const characterImg = characterCard.querySelector('.character-image').cloneNode(true);
        
        const yourCharElem = document.getElementById('your-character');
        yourCharElem.innerHTML = `<h3>${characterName}</h3>`;
        yourCharElem.appendChild(characterImg);
        yourCharElem.appendChild(characterStats);
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
        const characterName = characterCard.querySelector('h3').textContent;
        const characterStats = characterCard.querySelector('.character-stats').cloneNode(true);
        const characterImg = characterCard.querySelector('.character-image').cloneNode(true);
        
        const opponentElem = document.getElementById('opponent-character');
        opponentElem.innerHTML = `<h3>${characterName}</h3>`;
        opponentElem.appendChild(characterImg);
        opponentElem.appendChild(characterStats);
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
        showLoadingModal("Toggling character availability...");
        
        await characterContract.methods.toggle_battle_availability(characterId).send({ from: accounts[0] });
        
        // Reload characters to reflect the change
        await loadCharacters();
        
        hideLoadingModal();
    } catch (error) {
        console.error("Error toggling character availability:", error);
        hideLoadingModal();
        alert("Failed to toggle character availability. Please try again.");
    }
 }
 
 // Create a new character
 async function createCharacter(event) {
    event.preventDefault();
    
    const name = document.getElementById('character-name').value;
    const classChoice = document.getElementById('character-class').value;
    
    try {
        showLoadingModal("Creating character...");
        
        await characterContract.methods.create_character(name, classChoice).send({ from: accounts[0] });
        
        hideLoadingModal();
        alert("Character created successfully!");
        closeModals();
        await loadCharacters();
    } catch (error) {
        console.error("Error creating character:", error);
        hideLoadingModal();
        alert("Failed to create character. Please try again.");
    }
 }
 
 // Create a new item
 async function createItem(event) {
    event.preventDefault();
    
    const name = document.getElementById('item-name').value;
    const itemType = document.getElementById('item-type').value;
    
    try {
        showLoadingModal("Creating item...");
        
        await itemContract.methods.create_item(name, itemType).send({ from: accounts[0] });
        
        hideLoadingModal();
        alert("Item created successfully!");
        closeModals();
        await loadItems();
    } catch (error) {
        console.error("Error creating item:", error);
        hideLoadingModal();
        alert("Failed to create item. Please try again.");
    }
 }
 
 // Improved openEquipItemsModal function
 async function openEquipItemsModal(event) {
    const characterCard = event.target.closest('.character-card');
    const characterId = characterCard.dataset.id;
    
    try {
        showLoadingModal("Loading equipment data...");
        
        // Get character details
        const character = await characterContract.methods.get_character_details(characterId).call();
        console.log("Character details:", character);
        
        let className = "Unknown";
        try {
            className = await characterContract.methods.get_character_class_name(character[1]).call();
        } catch(e) {
            console.warn("Could not get class name, using default");
            const classNames = ["Warrior", "Paladin", "Rogue", "Mage", "Ranger"];
            className = classNames[character[1]] || "Unknown";
        }
        
        // Get equipped items - handle potential errors
        let equippedWeapon = "0";
        let equippedArmor = "0";
        let equippedAccessory = "0";
        
        try {
            const equipmentResponse = await battleGameContract.methods.get_equipped_items(characterId).call();
            equippedWeapon = equipmentResponse[0];
            equippedArmor = equipmentResponse[1];
            equippedAccessory = equipmentResponse[2];
            console.log("Equipment retrieved:", equipmentResponse);
        } catch(e) {
            console.warn("Could not get equipment, using default empty equipment", e);
        }
        
        // Display character info
        document.getElementById('equipment-character-info').innerHTML = `
            <h3>${character[0]} (${className})</h3>
            <div class="character-stats">
                <div class="stat-row">
                    <span class="stat-label">Level:</span>
                    <span>${character[5]}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Strength:</span>
                    <span>${character[2]}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Defense:</span>
                    <span>${character[3]}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Speed:</span>
                    <span>${character[4]}</span>
                </div>
            </div>
        `;
        
        // Set icons in equipment slots
        document.getElementById('weapon-slot').innerHTML = equippedWeapon !== "0" ? "⚔️" : "";
        document.getElementById('armor-slot').innerHTML = equippedArmor !== "0" ? "🛡️" : "";
        document.getElementById('accessory-slot').innerHTML = equippedAccessory !== "0" ? "💍" : "";
        
        // Prepare select boxes for items
        const weaponSelect = document.getElementById('weapon-select');
        const armorSelect = document.getElementById('armor-select');
        const accessorySelect = document.getElementById('accessory-select');
        
        weaponSelect.innerHTML = '<option value="0">None</option>';
        armorSelect.innerHTML = '<option value="0">None</option>';
        accessorySelect.innerHTML = '<option value="0">None</option>';
        
        // Get items and populate select boxes
        let itemCount = 10; // Default fallback
        try {
            itemCount = await itemContract.methods.last_token_id().call();
        } catch(e) {
            console.warn("Could not get item count, using default", e);
        }
        
        console.log("Processing", itemCount, "items");
        
        for (let i = 1; i <= itemCount; i++) {
            try {
                const itemId = i;
                console.log("Fetching item:", itemId);
                
                let item;
                try {
                    item = await itemContract.methods.get_item_details(itemId).call();
                } catch(e1) {
                    try {
                        item = await itemContract.methods.items(itemId).call();
                    } catch(e2) {
                        console.warn(`Skipping item ${itemId} - could not retrieve details`);
                        continue;
                    }
                }
                
                // Check if item exists and belongs to user
                if (!item || !item[0]) {
                    continue;
                }
                
                // Try to get owner
                let itemOwner = item[6];
                try {
                    if (!itemOwner) {
                        itemOwner = await itemContract.methods.get_item_owner(itemId).call();
                    }
                } catch(e) {
                    console.warn(`Could not verify ownership for item ${itemId}`);
                }
                
                // Skip items not owned by the current user
                if (itemOwner && itemOwner.toLowerCase() !== accounts[0].toLowerCase()) {
                    continue;
                }
                
                // Get type name
                let typeName = "Unknown";
                try {
                    typeName = await itemContract.methods.get_item_type_name(item[1]).call();
                } catch(e) {
                    const typeNames = ["Weapon", "Armor", "Accessory"];
                    typeName = typeNames[item[1]] || "Unknown";
                }
                
                const itemType = parseInt(item[1]);
                const option = `<option value="${itemId}" ${
                    (itemType === 0 && itemId === equippedWeapon) ||
                    (itemType === 1 && itemId === equippedArmor) ||
                    (itemType === 2 && itemId === equippedAccessory) 
                    ? 'selected' : ''
                }>${item[0]} (${typeName})</option>`;
                
                // Add to appropriate select based on type
                if (itemType === 0) weaponSelect.innerHTML += option;      // Weapon
                else if (itemType === 1) armorSelect.innerHTML += option;  // Armor
                else if (itemType === 2) accessorySelect.innerHTML += option; // Accessory
            } catch (error) {
                console.error(`Error loading item ${i} for equipment:`, error);
            }
        }
        
        // Set the character ID for equipment
        document.getElementById('equipped-character-id').value = characterId;
        
        hideLoadingModal();
        
        // Show the modal
        const modal = document.getElementById('equip-items-modal');
        modal.style.display = 'block';
    } catch (error) {
        console.error("Error opening equip items modal:", error);
        hideLoadingModal();
        alert("Failed to load equipment information. Please try again. Error: " + error.message);
    }
 }
 
 // Save equipment choices
 async function saveEquipment() {
    const characterId = document.getElementById('equipped-character-id').value;
    const weaponId = document.getElementById('weapon-select').value;
    const armorId = document.getElementById('armor-select').value;
    const accessoryId = document.getElementById('accessory-select').value;
    
    try {
        showLoadingModal("Saving equipment...");
        document.getElementById('save-equipment').textContent = 'Saving...';
        
        // Equip each item if selected and changed
        if (weaponId !== "0") {
            await battleGameContract.methods.equip_item(characterId, weaponId).send({ from: accounts[0] });
        }
        
        if (armorId !== "0") {
            await battleGameContract.methods.equip_item(characterId, armorId).send({ from: accounts[0] });
        }
        
        if (accessoryId !== "0") {
            await battleGameContract.methods.equip_item(characterId, accessoryId).send({ from: accounts[0] });
        }
        
        hideLoadingModal();
        document.getElementById('save-equipment').textContent = 'Save Equipment';
        alert("Equipment saved successfully!");
        closeModals();
        await loadCharacters();
    } catch (error) {
        console.error("Error saving equipment:", error);
        hideLoadingModal();
        document.getElementById('save-equipment').textContent = 'Save Equipment';
        alert("Failed to save equipment. Please try again.");
    }
 }
 
 // Initiate a battle
 async function startBattle() {
    if (!selectedCharacterId || !selectedOpponentId) {
        alert("Please select both your character and an opponent.");
        return;
    }
    
    try {
        showLoadingModal("Battle in progress...");
        
        // Initiate the battle
        await battleGameContract.methods.battle(selectedCharacterId, selectedOpponentId).send({ from: accounts[0] });
        
        // Get the latest battle
        const battleCount = await battleGameContract.methods.get_battle_count().call();
        const latestBattleId = battleCount - 1;
        const battle = await battleGameContract.methods.get_battle_record(latestBattleId).call();
        
        // Get character details
        const char1 = await characterContract.methods.get_character_details(battle[0]).call();
        const char2 = await characterContract.methods.get_character_details(battle[1]).call();
        const winner = await characterContract.methods.get_character_details(battle[2]).call();
        
        hideLoadingModal();
        
        // Display battle result
        const battleResultContent = document.getElementById('battle-result-content');
        battleResultContent.innerHTML = `
            <div class="battle-result">
                <div class="battle-participants">
                    <p><strong>${char1[0]}</strong> vs <strong>${char2[0]}</strong></p>
                </div>
                <h3>Winner: <span class="winner">${winner[0]}</span></h3>
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
        
        // Update battle button
        updateBattleButton();
        
        // Reload data
        await loadCharacters();
        await loadBattleHistory();
    } catch (error) {
        console.error("Error initiating battle:", error);
        hideLoadingModal();
        alert("Failed to initiate battle. Please try again.");
    }
 }
 
 // Function to train against an NPC
async function trainAgainstNPC(event) {
    if (!selectedCharacterId) {
        alert("Please select your character first before training.");
        return;
    }
    
    const npcId = event.target.dataset.npc;
    const npc = npcCharacters[npcId];
    
    if (!npc) {
        alert("Invalid NPC selected.");
        return;
    }
    
    try {
        showLoadingModal("Training in progress...");
        
        // Get character details
        const character = await characterContract.methods.get_character_details(selectedCharacterId).call();
        
        // Ensure character is available for battle
        if (!character[9]) {
            hideLoadingModal();
            alert("Your character must be set as available for battle before training.");
            return;
        }
        
        // Simulate a battle without blockchain interaction
        const charStrength = parseInt(character[2]);
        const charDefense = parseInt(character[3]);
        const charSpeed = parseInt(character[4]);
        
        // Calculate power for each (simplified version of the on-chain logic)
        const characterPower = charStrength * 2 + charDefense + charSpeed;
        const npcPower = npc.strength * 2 + npc.defense + npc.speed;
        
        // Add randomness (10% variance)
        const characterRandomFactor = 0.9 + Math.random() * 0.2;
        const npcRandomFactor = 0.9 + Math.random() * 0.2;
        
        const finalCharacterPower = characterPower * characterRandomFactor;
        const finalNpcPower = npcPower * npcRandomFactor;
        
        // Determine winner
        const isCharacterWinner = finalCharacterPower >= finalNpcPower;
        
        // Update character's experience
        const experienceGain = isCharacterWinner ? 50 : 20;
        await characterContract.methods.add_experience(selectedCharacterId, experienceGain).send({ from: accounts[0] });
        
        // Check if update_battle_record takes 1 or 2 parameters
        try {
            // Try with one parameter first - assuming it's just the token ID
            await characterContract.methods.update_battle_record(selectedCharacterId).send({ from: accounts[0] });
        } catch (error) {
            console.warn("Failed to update battle record with 1 parameter, checking contract function signature");
            
            // Check if there's another function to update wins/losses separately
            if (characterContract.methods.add_win) {
                if (isCharacterWinner) {
                    await characterContract.methods.add_win(selectedCharacterId).send({ from: accounts[0] });
                } else {
                    await characterContract.methods.add_loss(selectedCharacterId).send({ from: accounts[0] });
                }
            } else {
                console.error("Could not update battle record: ", error);
            }
        }
        
        hideLoadingModal();
        
        // Show training result
        const trainingResultContent = document.getElementById('battle-result-content');
        document.getElementById('battle-result-title').textContent = "Training Result";
        
        trainingResultContent.innerHTML = `
            <div class="battle-result">
                <div class="battle-participants">
                    <p><strong>${character[0]}</strong> vs <strong>${npc.name}</strong></p>
                </div>
                <h3>Result: <span class="winner">${isCharacterWinner ? character[0] : npc.name} wins!</span></h3>
                <p>Your character's power: ${finalCharacterPower.toFixed(2)}</p>
                <p>NPC's power: ${finalNpcPower.toFixed(2)}</p>
                <p>Experience gained: +${experienceGain} XP</p>
            </div>
        `;
        
        document.getElementById('battle-result-modal').style.display = 'block';
        
        // Reload character data
        await loadCharacters();
        
    } catch (error) {
        console.error("Error during NPC training:", error);
        hideLoadingModal();
        alert("Training failed. Please try again. Error: " + error.message);
    }
}
 
 // Open create character modal
 function openCreateCharacterModal() {
    const modal = document.getElementById('create-character-modal');
    modal.style.display = 'block';
 }
 
 // Open create item modal
 function openCreateItemModal() {
    const modal = document.getElementById('create-item-modal');
    modal.style.display = 'block';
 }
 
 // Close all modals
 function closeModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
 }
 
 // Add event listeners for NPC training
 function setupNPCTrainingListeners() {
    document.querySelectorAll('.train-against-npc').forEach(button => {
        button.addEventListener('click', trainAgainstNPC);
    });
 }
 
 // Set up event listeners
 function setupEventListeners() {
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
    
    // Create item button
    const createItemBtn = document.getElementById('create-item-btn');
    if (createItemBtn) {
        createItemBtn.addEventListener('click', openCreateItemModal);
    }
    
    // Create character form
    const createCharacterForm = document.getElementById('create-character-form');
    if (createCharacterForm) {
        createCharacterForm.addEventListener('submit', createCharacter);
    }
    
    // Create item form
    const createItemForm = document.getElementById('create-item-form');
    if (createItemForm) {
        createItemForm.addEventListener('submit', createItem);
    }
    
    // Equipment save button
    const saveEquipmentBtn = document.getElementById('save-equipment');
    if (saveEquipmentBtn) {
        saveEquipmentBtn.addEventListener('click', saveEquipment);
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
    
    // Close battle result button
    const closeBattleResultBtn = document.getElementById('close-battle-result');
    if (closeBattleResultBtn) {
        closeBattleResultBtn.addEventListener('click', closeModals);
    }
    
    // NPC training listeners
    setupNPCTrainingListeners();
    
    // Close on outside click
    window.addEventListener('click', (event) => {
        document.querySelectorAll('.modal').forEach(modal => {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        });
    });
 }