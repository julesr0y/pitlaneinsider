import json
import os

def getStandings(output_file_drivers, output_file_constructors):
    # Get the base directory of the script
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Load the necessary JSON data files
    with open(os.path.join(base_dir, './data/f1db-seasons-driver-standings.json'), 'r', encoding='utf-8') as f:
        current_season_driver_standings = json.load(f)

    with open(os.path.join(base_dir, './data/f1db-drivers.json'), 'r', encoding='utf-8') as f:
        drivers_data = json.load(f)

    with open(os.path.join(base_dir, './data/f1db-seasons-constructor-standings.json'), 'r', encoding='utf-8') as f:
        current_season_constructor_standings = json.load(f)

    with open(os.path.join(base_dir, './data/f1db-constructors.json'), 'r', encoding='utf-8') as f:
        constructors_data = json.load(f)
        
    driver_standings = []
    for driver in current_season_driver_standings:
        firstName = ""
        lastName = ""
        abbreviation = ""
        for item in drivers_data:
            if item['id'] == driver['driverId']:
                firstName = item['firstName']
                lastName = item['lastName']
                abbreviation = item['abbreviation']
        driver_entry = {
            'year': driver['year'],
            'driverId': driver['driverId'],
            'firstName': firstName,
            'lastName': lastName,
            'abbreviation': abbreviation,
            'position': driver['positionDisplayOrder'],
            'points': driver['points']
        }
        driver_standings.append(driver_entry)

    constructor_standings = []
    for constructor in current_season_constructor_standings:
        constructorName = ""
        for item in constructors_data:
            if item['id'] == constructor['constructorId']:
                constructorName = item['name']
        constructor_entry = {
            'year': constructor['year'],
            'contructorId': constructor['constructorId'],
            'name': constructorName,
            'position': constructor['positionDisplayOrder'],
            'points': constructor['points']
        }
        constructor_standings.append(constructor_entry)

    # Save all standings to the output files
    with open(output_file_drivers, 'w', encoding='utf-8') as f:
        json.dump(driver_standings, f, ensure_ascii=False, indent=4)

    with open(output_file_constructors, 'w', encoding='utf-8') as f:
        json.dump(constructor_standings, f, ensure_ascii=False, indent=4)