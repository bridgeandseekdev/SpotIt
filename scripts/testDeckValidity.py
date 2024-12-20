import json
import os
from itertools import combinations

# Paths to relevant directories
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DECK_FILE = os.path.join(BASE_DIR, "spotit-client", "src", "assets", "decks", "classic_deck_7.json")

def load_deck(deck_file):
    """Load the deck from the JSON file."""
    with open(deck_file, "r", encoding="utf-8") as f:
        return json.load(f)

def validate_spotit_deck(deck):
    """
    Validate the Spot It! deck.
    Each pair of cards must share exactly one common symbol.
    """
    valid = True
    for card1, card2 in combinations(deck, 2):
        # Find the intersection of two cards
        common_symbols = set(card1) & set(card2)
        
        # Check if exactly one symbol matches
        if len(common_symbols) != 1:
            print(f"Invalid pair: {card1} and {card2}, common symbols: {common_symbols}")
            valid = False
    
    return valid

if __name__ == "__main__":
    # Load the generated deck
    deck = load_deck(DECK_FILE)
    print(f"Loaded deck with {len(deck)} cards.")
    
    # Validate the deck
    if validate_spotit_deck(deck):
        print("✅ The Spot It! deck is valid: Every card shares exactly one symbol with every other card.")
    else:
        print("❌ The Spot It! deck is invalid: Some cards do not satisfy the Spot It! rule.")
