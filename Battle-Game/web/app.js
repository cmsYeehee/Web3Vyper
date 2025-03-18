// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCCmE8IkF1SR_-FUySymGqaLa2MSp8-0EA",
    authDomain: "vyperwebapp.firebaseapp.com",
    projectId: "vyperwebapp",
    storageBucket: "vyperwebapp.firebasestorage.app",
    messagingSenderId: "713529305807",
    appId: "1:713529305807:web:51975152f640bac24be5ba",
    measurementId: "G-532GMLFPMB"
  };
  
  // Load Firebase scripts dynamically
  document.addEventListener('DOMContentLoaded', function() {
    // Load Firebase scripts
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
        
        // The rest of your initialization code can go here
        init();
      };
    };
  });

// Contract ABIs - These will need to be updated with your actual contract ABIs
const characterABI = [
    // Example ABI entries - replace with your actual ABI
    "function create_character(string memory name, uint8 class_choice) external returns (uint256)",
    "function characters(uint256 tokenId) external view returns (string, uint8, uint8, uint8, uint8, uint8, uint16, uint16, uint16, bool)",
    "function toggle_battle_availability(uint256 tokenId) external",
    "function get_character_class_name(uint8 class_type) external view returns (string)"
];

const itemABI = [
    "function create_item(string memory name, uint8 item_type) external returns (uint256)",
    "function items(uint256 tokenId) external view returns (string, uint8, uint8, uint8, uint8, uint8)",
    "function get_item_type_name(uint8 item_type) external view returns (string)",
    "function get_rarity_stars(uint8 rarity) external view returns (string)"
];

const battleGameABI = [
    "function equip_item(uint256 character_id, uint256 item_id) external",
    "function battle(uint256 character_id1, uint256 character_id2) external",
    "function get_equipped_items(uint256 character_id) external view returns (uint256, uint256, uint256)",
    "function get_battle_record(uint256 battle_id) external view returns (uint256, uint256, uint256, uint256)",
    "function get_battle_count() external view returns (uint256)"
];

// Contract addresses - Update these with your deployed contract addresses
const characterContractAddress = "YOUR_CHARACTER_CONTRACT_ADDRESS";
const itemContractAddress = "YOUR_ITEM_CONTRACT_ADDRESS";
const battleGameContractAddress = "YOUR_BATTLE_GAME_CONTRACT_ADDRESS";
const erc721ContractAddress = "YOUR_ERC721_CONTRACT_ADDRESS";

// Global variables
let web3;
let accounts = [];
let characterContract;
let itemContract;
let battleGameContract;
let selectedCharacterId = null;
let selectedOpponentId = null;

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
        // This is a simplified example - in a real app, you'd need to query events or use an indexer
        // to find all the character IDs owned by the current user
        // For testing purposes, let's assume we have some character IDs
        const characterIds = [1, 2, 3]; // Replace with actual query
        
        let charactersHTML = '';
        
        for (const id of characterIds) {
            try {
                const character = await characterContract.methods.characters(id).call();
                const className = await characterContract.methods.get_character_class_name(character.class_type).call();
                
                charactersHTML += `
                    <div class="character-card" data-id="${id}">
                        <h3>${character.name}</h3>
                        <div class="character-stats">
                            <p>Class: ${className}</p>
                            <p>Level: ${character.level}</p>
                            <p>Strength: ${character.strength}</p>
                            <p>Defense: ${character.defense}</p>
                            <p>Speed: ${character.speed}</p>
                            <p>W/L: ${character.wins}/${character.losses}</p>
                            <div class="status-bar xp-bar">
                                <div class="status-fill" style="width: ${(character.experience / (character.level * 100)) * 100}%"></div>
                            </div>
                            <p>XP: ${character.experience}/${character.level * 100}</p>
                        </div>
                        <div class="character-actions">
                            <button class="select-character-btn">Select for Battle</button>
                            <button class="toggle-availability-btn">${character.is_available_for_battle ? 'Set Unavailable' : 'Set Available'}</button>
                            <button class="equip-items-btn">Equip Items</button>
                        </div>
                    </div>
                `;
            } catch (error) {
                console.error(`Error loading character ${id}:`, error);
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
        // This is a simplified example - in a real app, you'd need to query events or use an indexer
        // to find all the item IDs owned by the current user
        // For testing purposes, let's assume we have some item IDs
        const itemIds = [1, 2, 3]; // Replace with actual query
        
        let itemsHTML = '';
        
        for (const id of itemIds) {
            try {
                const item = await itemContract.methods.items(id).call();
                const typeName = await itemContract.methods.get_item_type_name(item.item_type).call();
                const rarityStars = await itemContract.methods.get_rarity_stars(item.rarity).call();
                
                itemsHTML += `
                    <div class="item-card rarity-${item.rarity}" data-id="${id}" data-type="${item.item_type}">
                        <h3>${item.name}</h3>
                        <div class="item-stats">
                            <p>Type: ${typeName}</p>
                            <p>Rarity: ${rarityStars}</p>
                            <p>Strength: +${item.strength_bonus}</p>
                            <p>Defense: +${item.defense_bonus}</p>
                            <p>Speed: +${item.speed_bonus}</p>
                        </div>
                    </div>
                `;
            } catch (error) {
                console.error(`Error loading item ${id}:`, error);
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
                    const char1 = await characterContract.methods.characters(battle.character1_id).call();
                    const char2 = await characterContract.methods.characters(battle.character2_id).call();
                    const winner = await characterContract.methods.characters(battle.winner_id).call();
                    
                    const battleDate = new Date(parseInt(battle.timestamp) * 1000).toLocaleString();
                    
                    battleHistoryHTML += `
                        <div class="battle-card">
                            <h3>Battle #${i + 1}</h3>
                            <p><strong>${char1.name}</strong> vs <strong>${char2.name}</strong></p>
                            <p>Winner: <strong>${winner.name}</strong></p>
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

// Open the create character modal
function openCreateCharacterModal() {
    const modal = document.getElementById('create-character-modal');
    modal.style.display = 'block';
}

// Close modals
function closeModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
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
        const character = await characterContract.methods.characters(characterId).call();
        const className = await characterContract.methods.get_character_class_name(character.class_type).call();
        
        // Get equipped items
        const equipmentResponse = await battleGameContract.methods.get_equipped_items(characterId).call();
        const equippedWeapon = equipmentResponse[0];
        const equippedArmor = equipmentResponse[1];
        const equippedAccessory = equipmentResponse[2];
        
        // Display character info
        document.getElementById('equipment-character-info').innerHTML = `
            <h3>${character.name} (${className})</h3>
            <div class="character-stats">
                <p>Level: ${character.level}</p>
                <p>Strength: ${character.strength}</p>
                <p>Defense: ${character.defense}</p>
                <p>Speed: ${character.speed}</p>
            </div>
        `;
        
        // Load all items for the select boxes
        const weaponSelect = document.getElementById('weapon-select');
        const armorSelect = document.getElementById('armor-select');
        const accessorySelect = document.getElementById('accessory-select');
        
        weaponSelect.innerHTML = '<option value="0">None</option>';
        armorSelect.innerHTML = '<option value="0">None</option>';
        accessorySelect.innerHTML = '<option value="0">None</option>';
        
        // Get all items (simplified example)
        const itemCards = document.querySelectorAll('.item-card');
        itemCards.forEach(itemCard => {
            const itemId = itemCard.dataset.id;
            const itemType = itemCard.dataset.type;
            const itemName = itemCard.querySelector('h3').textContent;
            
            if (itemType === "0") { // Weapon
                weaponSelect.innerHTML += `<option value="${itemId}" ${equippedWeapon === itemId ? 'selected' : ''}>${itemName}</option>`;
            } else if (itemType === "1") { // Armor
                armorSelect.innerHTML += `<option value="${itemId}" ${equippedArmor === itemId ? 'selected' : ''}>${itemName}</option>`;
            } else if (itemType === "2") { // Accessory
                accessorySelect.innerHTML += `<option value="${itemId}" ${equippedAccessory === itemId ? 'selected' : ''}>${itemName}</option>`;
            }
        });
        
        // Set the currently equipped items
        document.getElementById('equipped-character-id').value = characterId;
        
        // Show the modal
        const modal = document.getElementById('equip-items-modal');
        modal.style.display = 'block';
    } catch (error) {
        console.error("Error opening equip items modal:", error);
        alert("Failed to load equipment information. Please try again.");
    }
}

// Save equipment changes
async function saveEquipment(event) {
    event.preventDefault();
    
    const characterId = document.getElementById('equipped-character-id').value;
    const weaponId = document.getElementById('weapon-select').value;
    const armorId = document.getElementById('armor-select').value;
    const accessoryId = document.getElementById('accessory-select').value;
    
    try {
        // Get current equipment
        const currentEquipment = await battleGameContract.methods.get_equipped_items(characterId).call();
        const currentWeapon = currentEquipment[0];
        const currentArmor = currentEquipment[1];
        const currentAccessory = currentEquipment[2];
        
        // Equip new items if different from current
        if (weaponId !== "0" && weaponId !== currentWeapon) {
            await battleGameContract.methods.equip_item(characterId, weaponId).send({ from: accounts[0] });
        }
        
        if (armorId !== "0" && armorId !== currentArmor) {
            await battleGameContract.methods.equip_item(characterId, armorId).send({ from: accounts[0] });
        }
        
        if (accessoryId !== "0" && accessoryId !== currentAccessory) {
            await battleGameContract.methods.equip_item(characterId, accessoryId).send({ from: accounts[0] });
        }
        
        alert("Equipment saved successfully!");
        closeModals();
    } catch (error) {
        console.error("Error saving equipment:", error);
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
        await battleGameContract.methods.battle(selectedCharacterId, selectedOpponentId).send({ from: accounts[0] });
        
        // Get the latest battle
        const battleCount = await battleGameContract.methods.get_battle_count().call();
        const latestBattleId = battleCount - 1;
        const battle = await battleGameContract.methods.get_battle_record(latestBattleId).call();
        
        // Get character details
        const char1 = await characterContract.methods.characters(battle.character1_id).call();
        const char2 = await characterContract.methods.characters(battle.character2_id).call();
        const winner = await characterContract.methods.characters(battle.winner_id).call();
        
        // Display battle result
        const battleResultContent = document.getElementById('battle-result-content');
        battleResultContent.innerHTML = `
            <div class="battle-result">
                <p><strong>${char1.name}</strong> vs <strong>${char2.name}</strong></p>
                <h3>Winner: ${winner.name}</h3>
                <p>Experience earned:</p>
                <p>${winner.name}: +50 XP</p>
                <p>${winner.name === char1.name ? char2.name : char1.name}: +20 XP</p>
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

// Load available opponents
async function loadAvailableOpponents() {
    const opponentListElem = document.getElementById('opponent-list');
    if (!opponentListElem) return; // Skip if the element doesn't exist
    
    opponentListElem.innerHTML = '<p>Loading available opponents...</p>';
    
    try {
        // In a real app, you would query for characters that are available for battle
        // For this example, we'll use a simplified approach
        
        // Get all available characters not owned by the current user
        let availableOpponents = [];
        const characterIds = [1, 2, 3, 4, 5]; // Replace with actual query
        
        for (const id of characterIds) {
            try {
                const character = await characterContract.methods.characters(id).call();
                const owner = await characterContract.methods.ownerOf(id).call();
                
                if (character.is_available_for_battle && owner.toLowerCase() !== accounts[0].toLowerCase()) {
                    availableOpponents.push({
                        id: id,
                        character: character
                    });
                }
            } catch (error) {
                console.error(`Error checking character ${id}:`, error);
            }
        }
        
        if (availableOpponents.length === 0) {
            opponentListElem.innerHTML = '<p>No opponents available for battle.</p>';
        } else {
            let opponentsHTML = '';
            
            for (const opponent of availableOpponents) {
                const className = await characterContract.methods.get_character_class_name(opponent.character.class_type).call();
                
                opponentsHTML += `
                    <div class="character-card" data-id="${opponent.id}">
                        <h3>${opponent.character.name}</h3>
                        <div class="character-stats">
                            <p>Class: ${className}</p>
                            <p>Level: ${opponent.character.level}</p>
                            <p>W/L: ${opponent.character.wins}/${opponent.character.losses}</p>
                        </div>
                        <div class="character-actions">
                            <button class="select-opponent-btn">Select as Opponent</button>
                        </div>
                    </div>
                `;
            }
            
            opponentListElem.innerHTML = opponentsHTML;
            
            // Add event listeners
            document.querySelectorAll('.select-opponent-btn').forEach(btn => {
                btn.addEventListener('click', selectOpponent);
            });
        }
    } catch (error) {
        console.error("Error loading opponents:", error);
        opponentListElem.innerHTML = '<p>Error loading opponents. Please try again.</p>';
    }
}

// Level up a character
async function levelUpCharacter(characterId) {
    try {
        await characterContract.methods.level_up(characterId).send({ from: accounts[0] });
        
        alert("Character leveled up successfully!");
        await loadCharacters();
    } catch (error) {
        console.error("Error leveling up character:", error);
        alert("Failed to level up character. Please try again.");
    }
}

// Event listeners
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
    
    // Save equipment button
    const saveEquipmentBtn = document.getElementById('save-equipment');
    if (saveEquipmentBtn) {
        saveEquipmentBtn.addEventListener('click', saveEquipment);
    }
    
    // Start battle button
    const startBattleBtn = document.getElementById('start-battle');
    if (startBattleBtn) {
        startBattleBtn.addEventListener('click', startBattle);
    }
    
    // Close battle result button
    const closeBattleResultBtn = document.getElementById('close-battle-result');
    if (closeBattleResultBtn) {
        closeBattleResultBtn.addEventListener('click', closeModals);
    }
    
    // Close modal buttons
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', closeModals);
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        document.querySelectorAll('.modal').forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Load opponents on demand
    const loadOpponentsBtn = document.getElementById('load-opponents-btn');
    if (loadOpponentsBtn) {
        loadOpponentsBtn.addEventListener('click', loadAvailableOpponents);
    }
});