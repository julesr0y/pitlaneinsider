import json
import os

def getTitledConstructors(output_file):
    # Get the base directory of the script
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Load the necessary JSON data files
    with open(os.path.join(base_dir, './dataPython/all_constructor_standings.json'), 'r', encoding='utf-8') as f:
        constructorStandings = json.load(f)

    current_season_year = 2024
    table_winners = []
    for constructor in constructorStandings:
        if constructor['position'] == 1 and constructor['year'] != current_season_year:
            winner = {
                "year": constructor['year'],
                "constructorId": constructor['constructorId'],
                "name": constructor['name'],
            }
            table_winners.append(winner)

    # Save all data to the output file
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(table_winners, f, ensure_ascii=False, indent=4)