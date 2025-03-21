# @version ^0.3.10

# Interface definitions for external contracts
interface CharacterContract:
    def get_character_details(token_id: uint256) -> (String[64], uint8, uint8, uint8, uint8, uint8, uint16, uint16, uint16, bool, address): view
    def update_battle_record(token_id: uint256, is_winner: bool): nonpayable
    def add_experience(token_id: uint256, amount: uint16): nonpayable
    def get_character_owner(token_id: uint256) -> address: view

interface ItemContract:
    def get_item_details(token_id: uint256) -> (String[64], uint8, uint8, uint8, uint8, uint8, address): view
    def get_item_owner(item_id: uint256) -> address: view

# Struct for equipped items
struct EquippedItems:
    weapon_id: uint256
    armor_id: uint256
    accessory_id: uint256

# Struct for battle record
struct BattleRecord:
    character1_id: uint256
    character2_id: uint256
    winner_id: uint256
    timestamp: uint256

# State variables
character_contract_address: public(address)
item_contract_address: public(address)
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

event SystemError:
    code: uint8
    message: String[100]

# Add these new structs after the existing structs
struct ItemListing:
    seller: address
    item_id: uint256
    price: uint256
    active: bool

# Add these new state variables after the existing ones
listings: public(HashMap[uint256, ItemListing])
listing_count: public(uint256)

# Add these new events after the existing events
event ItemListed:
    listing_id: indexed(uint256)
    item_id: indexed(uint256)
    seller: indexed(address)
    price: uint256

event ItemSold:
    listing_id: indexed(uint256)
    item_id: indexed(uint256)
    seller: indexed(address)
    buyer: address
    price: uint256

@external
def __init__(character_address: address, item_address: address):
    self.character_contract_address = character_address
    self.item_contract_address = item_address
    self.battle_count = 0

@external
def equip_item(character_id: uint256, item_id: uint256):
    # Validate contracts and tokens
    assert self.character_contract_address != empty(address), "Character contract not set"
    assert self.item_contract_address != empty(address), "Item contract not set"
    
    # Verify character exists and is owned by msg.sender
    character_owner: address = CharacterContract(self.character_contract_address).get_character_owner(character_id)
    assert character_owner == msg.sender, "Not character owner"
    
    # Get item details
    item_name: String[64] = ""
    item_type: uint8 = 0
    strength_bonus: uint8 = 0
    defense_bonus: uint8 = 0
    speed_bonus: uint8 = 0
    rarity: uint8 = 0
    item_owner: address = empty(address)
    
    item_name, item_type, strength_bonus, defense_bonus, speed_bonus, rarity, item_owner = ItemContract(self.item_contract_address).get_item_details(item_id)
    
    # Verify item ownership
    assert item_owner == msg.sender, "Not item owner"
    
    # Get current equipped items
    equipped: EquippedItems = self.character_equipment[character_id]
    
    # Equip item based on type
    if item_type == 0:  # Weapon
        equipped.weapon_id = item_id
    elif item_type == 1:  # Armor
        equipped.armor_id = item_id
    elif item_type == 2:  # Accessory
        equipped.accessory_id = item_id
    else:
        raise "Invalid item type"
    
    # Update equipped items
    self.character_equipment[character_id] = equipped
    
    # Emit event
    log ItemEquipped(character_id, item_id, item_type)

@external
def battle(character_id1: uint256, character_id2: uint256):
    # Validate contracts
    assert self.character_contract_address != empty(address), "Character contract not set"
    assert self.item_contract_address != empty(address), "Item contract not set"
    
    # Verify first character ownership
    character1_owner: address = CharacterContract(self.character_contract_address).get_character_owner(character_id1)
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
    char1_owner: address = empty(address)
    
    char1_name, char1_class, char1_strength, char1_defense, char1_speed, char1_level, char1_exp, char1_wins, char1_losses, char1_available, char1_owner = CharacterContract(self.character_contract_address).get_character_details(character_id1)
    
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
    char2_owner: address = empty(address)
    
    char2_name, char2_class, char2_strength, char2_defense, char2_speed, char2_level, char2_exp, char2_wins, char2_losses, char2_available, char2_owner = CharacterContract(self.character_contract_address).get_character_details(character_id2)
    
    # Battle availability checks
    assert char1_available, "Character 1 not available for battle"
    assert char2_available, "Character 2 not available for battle"
    assert character_id1 != character_id2, "Cannot battle yourself"
    
    # Emit battle initiation event
    log BattleInitiated(character_id1, character_id2, msg.sender)
    
    # Calculate total power for each character
    power1: uint256 = self._calculate_total_power(character_id1, char1_strength, char1_defense, char1_speed)
    power2: uint256 = self._calculate_total_power(character_id2, char2_strength, char2_defense, char2_speed)
    
    # Add randomness (simplified)
    random_factor1: uint256 = 10  # Can be replaced with more sophisticated randomness
    random_factor2: uint256 = 10
    
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
    
    # Emit battle result event
    log BattleResult(battle_id, winner_id, loser_id)

@view
@internal
def _calculate_total_power(character_id: uint256, strength: uint8, defense: uint8, speed: uint8) -> uint256:
    equipped: EquippedItems = self.character_equipment[character_id]
    
    total_strength: uint256 = convert(strength, uint256)
    total_defense: uint256 = convert(defense, uint256)
    total_speed: uint256 = convert(speed, uint256)
    
    # Add equipment bonuses for weapon
    if equipped.weapon_id != 0:
        weapon_name: String[64] = ""
        weapon_type: uint8 = 0
        weapon_str: uint8 = 0
        weapon_def: uint8 = 0
        weapon_spd: uint8 = 0
        weapon_rarity: uint8 = 0
        weapon_owner: address = empty(address)
        
        weapon_name, weapon_type, weapon_str, weapon_def, weapon_spd, weapon_rarity, weapon_owner = ItemContract(self.item_contract_address).get_item_details(equipped.weapon_id)
        total_strength += convert(weapon_str, uint256)
    
    # Add equipment bonuses for armor
    if equipped.armor_id != 0:
        armor_name: String[64] = ""
        armor_type: uint8 = 0
        armor_str: uint8 = 0
        armor_def: uint8 = 0
        armor_spd: uint8 = 0
        armor_rarity: uint8 = 0
        armor_owner: address = empty(address)
        
        armor_name, armor_type, armor_str, armor_def, armor_spd, armor_rarity, armor_owner = ItemContract(self.item_contract_address).get_item_details(equipped.armor_id)
        total_defense += convert(armor_def, uint256)
    
    # Add equipment bonuses for accessory
    if equipped.accessory_id != 0:
        acc_name: String[64] = ""
        acc_type: uint8 = 0
        acc_str: uint8 = 0
        acc_def: uint8 = 0
        acc_spd: uint8 = 0
        acc_rarity: uint8 = 0
        acc_owner: address = empty(address)
        
        acc_name, acc_type, acc_str, acc_def, acc_spd, acc_rarity, acc_owner = ItemContract(self.item_contract_address).get_item_details(equipped.accessory_id)
        total_speed += convert(acc_spd, uint256)
    
    # Calculate power with emphasis on strength
    return total_strength * 2 + total_defense + total_speed

@view
@external
def get_equipped_items(character_id: uint256) -> (uint256, uint256, uint256):
    equipped: EquippedItems = self.character_equipment[character_id]
    return equipped.weapon_id, equipped.armor_id, equipped.accessory_id

@view
@external
def get_battle_record(battle_id: uint256) -> (uint256, uint256, uint256, uint256):
    record: BattleRecord = self.battle_records[battle_id]
    return record.character1_id, record.character2_id, record.winner_id, record.timestamp

@view
@external
def verify_contracts() -> (address, address):
    return (self.character_contract_address, self.item_contract_address)

@external
@payable
def list_item_for_sale(item_id: uint256, price: uint256):
    """
    @notice List an item for sale
    @param item_id: The ID of the item to list
    @param price: The price in wei (Sepolia ETH)
    """
    assert price > 0, "Price must be greater than 0"
    
    # Verify item ownership
    item_owner: address = ItemContract(self.item_contract_address).get_item_owner(item_id)
    assert item_owner == msg.sender, "Not item owner"
    
    # Create new listing
    listing_id: uint256 = self.listing_count
    self.listing_count += 1
    
    self.listings[listing_id] = ItemListing({
        seller: msg.sender,
        item_id: item_id,
        price: price,
        active: True
    })
    
    log ItemListed(listing_id, item_id, msg.sender, price)

@external
@payable
def buy_item(listing_id: uint256):
    """
    @notice Buy a listed item
    @param listing_id: The ID of the listing to purchase
    """
    listing: ItemListing = self.listings[listing_id]
    assert listing.active, "Listing is not active"
    assert msg.value >= listing.price, "Insufficient payment"
    assert msg.sender != listing.seller, "Cannot buy your own item"
    
    # Transfer payment to seller
    send(listing.seller, listing.price)
    
    # Refund excess payment if any
    if msg.value > listing.price:
        send(msg.sender, msg.value - listing.price)
    
    # Mark listing as inactive
    self.listings[listing_id].active = False
    
    log ItemSold(listing_id, listing.item_id, listing.seller, msg.sender, listing.price)

@view
@external
def get_listing(listing_id: uint256) -> (address, uint256, uint256, bool):
    """
    @notice Get details of a listing
    @param listing_id: The ID of the listing
    @return: Tuple of (seller, item_id, price, active)
    """
    listing: ItemListing = self.listings[listing_id]
    return listing.seller, listing.item_id, listing.price, listing.active