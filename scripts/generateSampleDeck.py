from sage.all import *
import json

def generate_spotit_cards():
    # Generate the projective plane design for Spot It!
    sol = designs.projective_plane(3)

    for row in sol.incidence_matrix().rows():
      print(row)
    
    # List of symbols for the cards
    symbols = sorted(
        ["Car", "Bike", "House", "Road", "Traffic", "Tomato", "Banana", "Kannada", "Bengaluru", "Kalaburgi", "Dharwad", "India", "Relatives"],
        key=str.lower
    )
    
    # Generate cards based on the design
    cards = [
        [symbol for symbol, use_it in zip(symbols, row) if use_it]
        for row in sorted(sol.incidence_matrix().rows())
    ]
    
    return cards

def save_cards_to_json(cards, filename="spotit_cards.json"):
    # Save the cards to a JSON file
    with open(filename, "w") as f:
        json.dump(cards, f, indent=4, ensure_ascii=False)

if __name__ == "__main__":
    # Generate the cards
    cards = generate_spotit_cards()
    print(cards)
    
    # Save to JSON
    save_cards_to_json(cards)
    print(f"Spot It! cards have been saved to 'spotit_cards.json'.")
