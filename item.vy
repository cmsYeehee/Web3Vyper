# @version ^0.3.10

# Constants for item types
WEAPON: constant(uint8) = 0
ARMOR: constant(uint8) = 1
ACCESSORY: constant(uint8) = 2

# Item struct
struct Item:
    name: String[64]
    item_type: uint8
    strength_bonus: uint8
    defense_bonus: uint8
    speed_bonus: uint8
    rarity: uint8  # 1-5 stars

# Interface for ERC721
interface ERC721Contract:
    def ownerOf(token_id: uint256) -> address: view

# State variables
items: public(HashMap[uint256, Item])
last_token_id: uint256
erc721_contract_address: public(address)
owner: public(address)

# Events
event ItemCreated:
    token_id: indexed(uint256)
    creator: indexed(address)
    name: String[64]
    rarity: uint8

@external
def __init__(erc721_address: address):
    self.erc721_contract_address = erc721_address
    self.last_token_id = 0
    self.owner = msg.sender

@external
def create_item(name: String[64], item_type: uint8) -> uint256:
    assert item_type <= ACCESSORY, "Invalid item type"
    assert msg.sender == self.owner, "Only owner can create items"
    
    # Increment token ID
    self.last_token_id += 1
    token_id: uint256 = self.last_token_id
    
    # Generate rarity (simplified from random)
    rarity: uint8 = 3  # Medium rarity
    strength_bonus: uint8 = 0
    defense_bonus: uint8 = 0
    speed_bonus: uint8 = 0
    
    if item_type == WEAPON:
        strength_bonus = rarity * 2
    elif item_type == ARMOR:
        defense_bonus = rarity * 2
    elif item_type == ACCESSORY:
        speed_bonus = rarity * 2
    
    # Create item
    self.items[token_id] = Item({
        name: name,
        item_type: item_type,
        strength_bonus: strength_bonus,
        defense_bonus: defense_bonus,
        speed_bonus: speed_bonus,
        rarity: rarity
    })
    
    log ItemCreated(token_id, msg.sender, name, rarity)
    
    return token_id

@view
@external
def get_item_type_name(item_type: uint8) -> String[10]:
    if item_type == WEAPON:
        return "Weapon"
    elif item_type == ARMOR:
        return "Armor"
    elif item_type == ACCESSORY:
        return "Accessory"
    else:
        return "Unknown"

@view
@external
def get_rarity_stars(rarity: uint8) -> String[5]:
    if rarity == 1:
        return "*"
    elif rarity == 2:
        return "**"
    elif rarity == 3:
        return "***"
    elif rarity == 4:
        return "****"
    elif rarity == 5:
        return "*****"
    else:
        return ""
