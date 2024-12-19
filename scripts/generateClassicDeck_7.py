from sage.all import *
import json
import os

# Paths to relevant directories
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
CLASSIC_SYMBOLS_FILE = os.path.join(BASE_DIR, "spotIt-client", "public", "cards_theme", "classic.json")
DECKS_DIR = os.path.join(BASE_DIR, "spotIt-client", "public", "decks")

def load_symbols(symbols_file):
    """Load symbols from classic.json."""
    with open(symbols_file, "r", encoding="utf-8") as f:
        symbols = json.load(f)
    return sorted(symbols, key=str.lower)

def generate_spotit_cards(symbols):
    """Generate Spot It! cards based on projective plane design."""
    # Generate the projective plane design
    # symbols per card 8
    sol = designs.projective_plane(7)
    
    # Generate cards using the symbols and incidence matrix
    cards = [
        [symbol for symbol, use_it in zip(symbols, row) if use_it]
        for row in sorted(sol.incidence_matrix().rows())
    ]
    return cards

def save_cards_to_json(cards, output_file):
    """Save the cards to a JSON file."""
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(cards, f, indent=4, ensure_ascii=False)

if __name__ == "__main__":
    # Load symbols from classic.json
    symbols = load_symbols(CLASSIC_SYMBOLS_FILE)
    
    # Generate Spot It! cards
    cards = generate_spotit_cards(symbols)
    print("Generated cards:", cards)
    
    # Ensure the decks directory exists
    os.makedirs(DECKS_DIR, exist_ok=True)
    
    # Save the generated cards to a JSON file
    output_file = os.path.join(DECKS_DIR, "classic_deck.json")
    save_cards_to_json(cards, output_file)
    print(f"Spot It! deck has been saved to '{output_file}'.")
