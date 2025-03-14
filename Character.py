# @version ^0.3.10

# Character class constants
WARRIOR: constant(uint8) = 0
PALADIN: constant(uint8) = 1
ROGUE: constant(uint8) = 2
MAGE: constant(uint8) = 3
RANGER: constant(uint8) = 4

# Character struct
struct Character:
    name: String[64]
    class_type: uint8
    strength: uint8
    defense: uint8
    speed: uint8
    level: uint8
    experience: uint16
    wins: uint16
    losses: uint16
    is_available_for_battle: bool

# Interface for ERC721
interface ERC721Contract:
    def ownerOf(token_id: uint256) -> address: view

# State variables
characters: public(HashMap[uint256, Character])
last_token_id: uint256
erc721_contract_address: public(address)

# Events
event CharacterCreated:
    token_id: indexed(uint256)
    owner: indexed(address)
    name: String[64]
    class_type: uint8

event CharacterLeveledUp:
    token_id: indexed(uint256)
    new_level: uint8

event BattleStatusChanged:
    token_id: indexed(uint256)
    is_available: bool

@external
def __init__(erc721_address: address):
    self.erc721_contract_address = erc721_address
    self.last_token_id = 0

@external
def create_character(name: String[64], class_choice: uint8) -> uint256:
    assert class_choice <= RANGER, "Invalid class choice"
    
    # Increment token ID
    self.last_token_id += 1
    token_id: uint256 = self.last_token_id
    
    # Set initial stats based on class
    strength: uint8 = 0
    defense: uint8 = 0
    speed: uint8 = 0
    
    if class_choice == WARRIOR:
        # High strength, medium defense, low speed
        strength = 8  # Simplified from random
        defense = 6
        speed = 4
    elif class_choice == PALADIN:
        # Medium strength, high defense, low speed
        strength = 6
        defense = 8
        speed = 4
    elif class_choice == ROGUE:
        # Medium strength, low defense, high speed
        strength = 6
        defense = 4
        speed = 8
    elif class_choice == MAGE:
        # High strength, very low defense, medium speed
        strength = 8
        defense = 3
        speed = 6
    elif class_choice == RANGER:
        # Medium stats across the board
        strength = 6
        defense = 6
        speed = 6
    
    # Create character
    self.characters[token_id] = Character({
        name: name,
        class_type: class_choice,
        strength: strength,
        defense: defense,
        speed: speed,
        level: 1,
        experience: 0,
        wins: 0,
        losses: 0,
        is_available_for_battle: False
    })
    
    log CharacterCreated(token_id, msg.sender, name, class_choice)
    
    return token_id

@external
def level_up(token_id: uint256):
    char: Character = self.characters[token_id]
    
    # Check if enough experience
    required_xp: uint16 = convert(char.level * 100, uint16)
    assert char.experience >= required_xp, "Not enough experience"
    
    # Update experience and level
    char.experience -= required_xp
    char.level += 1
    
    # Improve stats
    char.strength += 1
    char.defense += 1
    char.speed += 1
    
    # Update character
    self.characters[token_id] = char
    
    log CharacterLeveledUp(token_id, char.level)

@external
def add_experience(token_id: uint256, amount: uint16):
    char: Character = self.characters[token_id]
    char.experience += amount
    self.characters[token_id] = char

@external
def toggle_battle_availability(token_id: uint256):
    char: Character = self.characters[token_id]
    char.is_available_for_battle = not char.is_available_for_battle
    self.characters[token_id] = char
    
    log BattleStatusChanged(token_id, char.is_available_for_battle)

@external
def update_battle_record(token_id: uint256, is_winner: bool):
    char: Character = self.characters[token_id]
    
    if is_winner:
        char.wins += 1
    else:
        char.losses += 1
    
    self.characters[token_id] = char

@view
@external
def get_character_class_name(class_type: uint8) -> String[10]:
    if class_type == WARRIOR:
        return "Warrior"
    elif class_type == PALADIN:
        return "Paladin"
    elif class_type == ROGUE:
        return "Rogue"
    elif class_type == MAGE:
        return "Mage"
    elif class_type == RANGER:
        return "Ranger"
    else:
        return "Unknown"
