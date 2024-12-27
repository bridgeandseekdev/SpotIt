# If the input file is a color coordinated json object

from sage.all import *
import json
import os
import sys
from itertools import combinations

# Paths to relevant directories
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
CLASSIC_SYMBOLS_FILE = os.path.join(BASE_DIR, "spotit-client", "src", "assets", "cards_theme", f"classic_{sys.argv[1]}.json")
DECKS_DIR = os.path.join(BASE_DIR, "spotit-client", "src", "assets", "decks")

def load_symbols(symbols_file):
    with open(symbols_file, "r", encoding="utf-8") as f:
        symbols_by_color = json.load(f)
    
    # Extract all unique symbols and capitalize them
    all_symbols = set()
    for symbols in symbols_by_color.values():
        all_symbols.update(symbol for symbol in symbols)
    
    return sorted(list(all_symbols))

def generate_spotit_cards(symbols):
    """Generate Spot It! cards based on projective plane design."""
    # Generate the projective plane design
    # symbols per card 8
    sol = designs.projective_plane(int(sys.argv[1]))
    
    # Generate cards using the symbols and incidence matrix
    cards = [
        [symbol for symbol, use_it in zip(symbols, row) if use_it]
        for row in sorted(sol.incidence_matrix().rows())
    ]
    return cards

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

def save_cards_to_json(cards, output_file):
    """Save the cards to a JSON file."""
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(cards, f, indent=4, ensure_ascii=False)

if __name__ == "__main__":
    # Load symbols from classic.json
    symbols = load_symbols(CLASSIC_SYMBOLS_FILE)
    
    # Generate Spot It! cards
    cards = generate_spotit_cards(symbols)
    print(f"Generated {len(cards)} cards")
    
    # Validate the deck before saving
    if validate_spotit_deck(cards):
        print("✅ The Spot It! deck is valid: Every card shares exactly one symbol with every other card.")
        
        # Ensure the decks directory exists
        os.makedirs(DECKS_DIR, exist_ok=True)
        
        # Save the generated cards to a JSON file
        output_file = os.path.join(DECKS_DIR, f"classic_deck_{sys.argv[1]}.json")
        save_cards_to_json(cards, output_file)
        print(f"Spot It! deck has been saved to '{output_file}'.")
    else:
        print("❌ The Spot It! deck is invalid: Some cards do not satisfy the Spot It! rule.")
        print("Operation aborted - no output file was created.")
        sys.exit(1)