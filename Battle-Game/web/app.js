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

// Contract ABIs - Updated to match Vyper 0.4.0 contracts
const characterABI = [
    {
        "inputs": [{"internalType": "string", "name": "name", "type": "string"}, 
                  {"internalType": "uint8", "name": "class_choice", "type": "uint8"}],
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
    }
];

// IMPORTANT: REPLACE THESE WITH YOUR ACTUAL DEPLOYED CONTRACT ADDRESSES
// TODO: Update these addresses after deploying contracts on Sepolia
const characterContractAddress = "0x0000000000000000000000000000000000000000";  // Replace with actual Character Contract address
const itemContractAddress = "0x0000000000000000000000000000000000000000";      // Replace with actual Item Contract address
const battleGameContractAddress = "0x0000000000000000000000000000000000000000";  // Replace with actual Battle Game Contract address

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

// The rest of the functions (loadItems, loadBattleHistory, etc.) 
// would need similar updates to use get_character_details() and get_item_details()

// [Rest of the previous app.js code remains the same, 
// with method calls updated to use the new contract method names]

// ... (rest of the code continues as before)