# @version ^0.3.10

# Interface definitions for external contracts
interface CharacterContract:
    def characters(token_id: uint256) -> (String[64], uint8, uint8, uint8, uint8, uint8, uint16, uint16, uint16, bool): view
    def update_battle_record(token_id: uint256, is_winner: bool): nonpayable
    def add_experience(token_id: uint256, amount: uint16): nonpayable

interface ItemContract:
    def items(token_id: uint256) -> (String[64], uint8, uint8, uint8, uint8, uint8): view

interface ERC721Contract:
    def ownerOf(token_id: uint256) -> address: view

# Struct for equipped items
struct EquippedItems:
    weapon: uint256
    armor: uint256
    accessory: uint256

# Struct for battle record
struct BattleRecord:
    character1_id: uint256
    character2_id: uint256
    winner_id: uint256
    timestamp: uint256

# State variables
character_contract_address: public(address)
item_contract_address: public(address)
erc721_contract_address: public(address)
character_equipment: public(HashMap[uint256, EquippedItems])
battle_records: public(HashMap[uint256, BattleRecord])
battle_count: public(uint256)

# Events
event ItemEquipped:
    character_id: indexed(uint256)
    item_id: indexed(uint256)
    slot: uint8

event BattleInitiated:
    character1_id: indexed(uint256)
    character2_id: indexed(uint256)
    initiator: indexed(address)

event BattleResult:
    battle_id: indexed(uint256)
    winner_id: indexed(uint256)
    loser_id: indexed(uint256)

@external
def __init__(character_address: address, item_address: address, erc721_address: address):
    self.character_contract_address = character_address
    self.item_contract_address = item_address
    self.erc721_contract_address = erc721_address
    self.battle_count = 0

@external
def equip_item(character_id: uint256, item_id: uint256):
    # Check ownership of character and item
    character_owner: address = ERC721Contract(self.erc721_contract_address).ownerOf(character_id)
    item_owner: address = ERC721Contract(self.erc721_contract_address).ownerOf(item_id)
    
    assert character_owner == msg.sender, "Not character owner"
    assert item_owner == msg.sender, "Not item owner"
    
    # Get item details
    item_name: String[64] = ""
    item_type: uint8 = 0
    strength_bonus: uint8 = 0
    defense_bonus: uint8 = 0
    speed_bonus: uint8 = 0
    rarity: uint8 = 0
    
    item_name, item_type, strength_bonus, defense_bonus, speed_bonus, rarity = ItemContract(self.item_contract_address).items(item_id)
    
    equipped: EquippedItems = self.character_equipment[character_id]
    
    # Equip item to the appropriate slot
    if item_type == 0:  # Weapon
        equipped.weapon = item_id
    elif item_type == 1:  # Armor
        equipped.armor = item_id
    elif item_type == 2:  # Accessory
        equipped.accessory = item_id
    
    self.character_equipment[character_id] = equipped
    
    log ItemEquipped(character_id, item_id, item_type)

@external
def battle(character_id1: uint256, character_id2: uint256):
    # Check ownership of first character
    character1_owner: address = ERC721Contract(self.erc721_contract_address).ownerOf(character_id1)
    assert character1_owner == msg.sender, "Not character1 owner"
    
    # Get character details
    char1_name: String[64] = ""
    char1_class: uint8 = 0
    char1_strength: uint8 = 0
    char1_defense: uint8 = 0
    char1_speed: uint8 = 0
    char1_level: uint8 = 0
    char1_exp: uint16 = 0
    char1_wins: uint16 = 0
    char1_losses: uint16 = 0
    char1_available: bool = False
    
    char1_name, char1_class, char1_strength, char1_defense, char1_speed, char1_level, char1_exp, char1_wins, char1_losses, char1_available = CharacterContract(self.character_contract_address).characters(character_id1)
    
    # Get second character details
    char2_name: String[64] = ""
    char2_class: uint8 = 0
    char2_strength: uint8 = 0
    char2_defense: uint8 = 0
    char2_speed: uint8 = 0
    char2_level: uint8 = 0
    char2_exp: uint16 = 0
    char2_wins: uint16 = 0
    char2_losses: uint16 = 0
    char2_available: bool = False
    
    char2_name, char2_class, char2_strength, char2_defense, char2_speed, char2_level, char2_exp, char2_wins, char2_losses, char2_available = CharacterContract(self.character_contract_address).characters(character_id2)
    
    # Check that both characters are available for battle
    assert char1_available, "Character 1 not available for battle"
    assert char2_available, "Character 2 not available for battle"
    assert character_id1 != character_id2, "Cannot battle yourself"
    
    log BattleInitiated(character_id1, character_id2, msg.sender)
    
    # Calculate total power for each character
    power1: uint256 = self._calculate_total_power(character_id1, char1_strength, char1_defense, char1_speed)
    power2: uint256 = self._calculate_total_power(character_id2, char2_strength, char2_defense, char2_speed)
    
    # Add simple 0-20% randomness (fixed seed for simplicity)
    random_factor1: uint256 = 10  # Simplified random
    random_factor2: uint256 = 10  # Simplified random
    
    power1 = power1 * (100 + random_factor1) / 100
    power2 = power2 * (100 + random_factor2) / 100
    
    # Determine winner
    winner_id: uint256 = 0
    loser_id: uint256 = 0
    
    if power1 >= power2:
        winner_id = character_id1
        loser_id = character_id2
    else:
        winner_id = character_id2
        loser_id = character_id1
    
    # Record battle
    battle_id: uint256 = self.battle_count
    self.battle_count += 1
    
    self.battle_records[battle_id] = BattleRecord({
        character1_id: character_id1,
        character2_id: character_id2,
        winner_id: winner_id,
        timestamp: block.timestamp
    })
    
    # Update character records
    CharacterContract(self.character_contract_address).update_battle_record(winner_id, True)
    CharacterContract(self.character_contract_address).update_battle_record(loser_id, False)
    
    # Award experience
    CharacterContract(self.character_contract_address).add_experience(winner_id, 50)
    CharacterContract(self.character_contract_address).add_experience(loser_id, 20)
    
    log BattleResult(battle_id, winner_id, loser_id)

@view
@internal
def _calculate_total_power(character_id: uint256, strength: uint8, defense: uint8, speed: uint8) -> uint256:
    equipped: EquippedItems = self.character_equipment[character_id]
    
    total_strength: uint256 = convert(strength, uint256)
    total_defense: uint256 = convert(defense, uint256)
    total_speed: uint256 = convert(speed, uint256)
    
    # Add equipment bonuses
    if equipped.weapon != 0:
        weapon_name: String[64] = ""
        weapon_type: uint8 = 0
        weapon_str: uint8 = 0
        weapon_def: uint8 = 0
        weapon_spd: uint8 = 0
        weapon_rarity: uint8 = 0
        
        weapon_name, weapon_type, weapon_str, weapon_def, weapon_spd, weapon_rarity = ItemContract(self.item_contract_address).items(equipped.weapon)
        total_strength += convert(weapon_str, uint256)
    
    if equipped.armor != 0:
        armor_name: String[64] = ""
        armor_type: uint8 = 0
        armor_str: uint8 = 0
        armor_def: uint8 = 0
        armor_spd: uint8 = 0
        armor_rarity: uint8 = 0
        
        armor_name, armor_type, armor_str, armor_def, armor_spd, armor_rarity = ItemContract(self.item_contract_address).items(equipped.armor)
        total_defense += convert(armor_def, uint256)
    
    if equipped.accessory != 0:
        acc_name: String[64] = ""
        acc_type: uint8 = 0
        acc_str: uint8 = 0
        acc_def: uint8 = 0
        acc_spd: uint8 = 0
        acc_rarity: uint8 = 0
        
        acc_name, acc_type, acc_str, acc_def, acc_spd, acc_rarity = ItemContract(self.item_contract_address).items(equipped.accessory)
        total_speed += convert(acc_spd, uint256)
    
    # Calculate power with emphasis on strength
    return total_strength * 2 + total_defense + total_speed

@view
@external
def get_equipped_items(character_id: uint256) -> (uint256, uint256, uint256):
    equipped: EquippedItems = self.character_equipment[character_id]
    return equipped.weapon, equipped.armor, equipped.accessory

@view
@external
def get_battle_record(battle_id: uint256) -> (uint256, uint256, uint256, uint256):
    record: BattleRecord = self.battle_records[battle_id]
    return record.character1_id, record.character2_id, record.winner_id, record.timestamp
