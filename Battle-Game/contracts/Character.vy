# @version ^0.4.0

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
    owner: address  # Store owner directly in the Character struct

# State variables
characters: public(HashMap[uint256, Character])
character_tokens: public(DynArray[uint256, 1000])  # Track all character tokens
last_token_id: uint256
character_owners: public(HashMap[uint256, address])  # Mapping from character ID to owner

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

@deploy
def __init__():
    self.last_token_id = 0

@external
def create_character(name: String[64], class_choice: uint8) -> uint256:
    assert class_choice <= RANGER, "Invalid class choice"
    assert len(name) > 0, "Name cannot be empty"
    
    # Increment token ID
    self.last_token_id += 1
    token_id: uint256 = self.last_token_id
    
    # Set initial stats based on class
    strength: uint8 = 0
    defense: uint8 = 0
    speed: uint8 = 0
    
    if class_choice == WARRIOR:
        # High strength, medium defense, low speed
        strength = 8
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
        is_available_for_battle: False,
        owner: msg.sender
    })
    
    # Record ownership and track token
    self.character_owners[token_id] = msg.sender
    self.character_tokens.append(token_id)
    
    log CharacterCreated(token_id, msg.sender, name, class_choice)
    
    return token_id

@external
def level_up(token_id: uint256):
    # Check ownership
    assert self.character_owners[token_id] == msg.sender, "Not the character owner"
    
    char: Character = self.characters[token_id]
    
    # Check if enough experience
    required_xp: uint16 = convert(char.level * 100, uint16)
    assert char.experience >= required_xp, "Not enough experience"
    
    # Update experience and level
    char.experience -= required_xp
    char.level += 1
    
    # Improve stats with some variance
    char.strength += 1
    char.defense += 1
    char.speed += 1
    
    # Update character
    self.characters[token_id] = char
    
    log CharacterLeveledUp(token_id, char.level)

@external
def add_experience(token_id: uint256, amount: uint16):
    # Validate token exists
    assert self.character_owners[token_id] != empty(address), "Invalid token"
    
    char: Character = self.characters[token_id]
    char.experience += amount
    self.characters[token_id] = char

@external
def toggle_battle_availability(token_id: uint256):
    # Check ownership
    assert self.character_owners[token_id] == msg.sender, "Not the character owner"
    
    char: Character = self.characters[token_id]
    char.is_available_for_battle = not char.is_available_for_battle
    self.characters[token_id] = char
    
    log BattleStatusChanged(token_id, char.is_available_for_battle)

@external
def update_battle_record(token_id: uint256, is_winner: bool):
    # Validate token exists
    assert self.character_owners[token_id] != empty(address), "Invalid token"
    
    char: Character = self.characters[token_id]
    
    if is_winner:
        char.wins += 1
    else:
        char.losses += 1
    
    self.characters[token_id] = char

@view
@external
def get_character_count() -> uint256:
    return len(self.character_tokens)

@view
@external
def get_character_at_index(index: uint256) -> uint256:
    assert index < len(self.character_tokens), "Index out of bounds"
    return self.character_tokens[index]

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

@view
@external
def get_character_details(token_id: uint256) -> (String[64], uint8, uint8, uint8, uint8, uint8, uint16, uint16, uint16, bool, address):
    char: Character = self.characters[token_id]
    return (
        char.name, 
        char.class_type, 
        char.strength, 
        char.defense, 
        char.speed, 
        char.level, 
        char.experience, 
        char.wins, 
        char.losses, 
        char.is_available_for_battle, 
        char.owner
    )

@view
@external
def get_character_owner(token_id: uint256) -> address:
    return self.character_owners[token_id]