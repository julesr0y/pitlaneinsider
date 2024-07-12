import json
import os

def getTitledDrivers(output_file):
    # Get the base directory of the script
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Load the necessary JSON data files
    with open(os.path.join(base_dir, './dataPython/all_driver_standings.json'), 'r', encoding='utf-8') as f:
        driver_standings = json.load(f)

    current_season_year = 2024
    table_winners = []
    for driver in driver_standings:
        if driver['position'] == 1 and driver['year'] != current_season_year:
            winner = {
                "year": driver['year'],
                "driverId": driver['driverId'],
                "firstName": driver['firstName'],
                "lastName": driver['lastName'],
                "abbreviation": driver['abbreviation']
            }
            table_winners.append(winner)

    # Save all data to the output file
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(table_winners, f, ensure_ascii=False, indent=4)