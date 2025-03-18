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
    owner: address  # Store owner directly in the Item struct

# State variables
items: public(HashMap[uint256, Item])
item_tokens: public(DynArray[uint256, 1000])  # Track all item tokens
last_token_id: uint256
item_owners: public(HashMap[uint256, address])  # Mapping from item ID to owner

# Events
event ItemCreated:
    token_id: indexed(uint256)
    creator: indexed(address)
    name: String[64]
    item_type: uint8
    rarity: uint8

event ItemTransferred:
    item_id: indexed(uint256)
    from_owner: indexed(address)
    to_owner: indexed(address)

@external
def __init__():
    self.last_token_id = 0

@external
def create_item(name: String[64], item_type: uint8, rarity: uint8 = 3) -> uint256:
    assert item_type <= ACCESSORY, "Invalid item type"
    assert rarity > 0 and rarity <= 5, "Invalid rarity (1-5)"
    assert len(name) > 0, "Name cannot be empty"
    
    # Increment token ID
    self.last_token_id += 1
    token_id: uint256 = self.last_token_id
    
    # Initialize bonuses
    strength_bonus: uint8 = 0
    defense_bonus: uint8 = 0
    speed_bonus: uint8 = 0
    
    # Apply bonuses based on item type and rarity
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
        rarity: rarity,
        owner: msg.sender
    })
    
    # Record ownership and track token
    self.item_owners[token_id] = msg.sender
    self.item_tokens.append(token_id)
    
    log ItemCreated(token_id, msg.sender, name, item_type, rarity)
    
    return token_id

@external
def transfer_item(item_id: uint256, to: address):
    # Check ownership
    assert self.item_owners[item_id] == msg.sender, "Not the item owner"
    
    # Store current owner for event
    current_owner: address = msg.sender
    
    # Update ownership
    self.item_owners[item_id] = to
    
    # Update item struct
    item: Item = self.items[item_id]
    item.owner = to
    self.items[item_id] = item
    
    log ItemTransferred(item_id, current_owner, to)

@view
@external
def get_item_count() -> uint256:
    return len(self.item_tokens)

@view
@external
def get_item_at_index(index: uint256) -> uint256:
    assert index < len(self.item_tokens), "Index out of bounds"
    return self.item_tokens[index]

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

@view
@external
def get_item_details(token_id: uint256) -> (String[64], uint8, uint8, uint8, uint8, uint8, address):
    item: Item = self.items[token_id]
    return (
        item.name, 
        item.item_type, 
        item.strength_bonus, 
        item.defense_bonus, 
        item.speed_bonus, 
        item.rarity, 
        item.owner
    )

@view
@external
def get_item_owner(item_id: uint256) -> address:
    return self.item_owners[item_id]