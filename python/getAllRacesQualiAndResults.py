import json
import os

def getAllRacesQualiAndResults(output_file):
    # Get the base directory of the script
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Load the necessary JSON data files
    with open(os.path.join(base_dir, '../../f1db/data/f1db-races-race-results.json'), 'r', encoding='utf-8') as f:
        race_results = json.load(f)

    with open(os.path.join(base_dir, './dataPython/all_drivers_stats.json'), 'r', encoding='utf-8') as f:
        drivers_data = json.load(f)

    with open(os.path.join(base_dir, '../../f1db/data/f1db-seasons-constructor-standings.json'), 'r', encoding='utf-8') as f:
        races_quali = json.load(f)

    with open(os.path.join(base_dir, '../../f1db/data/f1db-constructors.json'), 'r', encoding='utf-8') as f:
        constructors_data = json.load(f)

    allResults = []
    for driverResult in race_results:
        # Get first name and last name
        firstName = ""
        lastName = ""
        abbreviation = ""
        for driver in drivers_data:
            if driver['id'] == driverResult['driverId']:
                firstName = driver['firstName']
                lastName = driver['lastName']
                abbreviation = driver["abbreviation"]

        # Get gap or DNF
        gap = driverResult['gap']
        if driverResult['reasonRetired'] != None:
            gap = "DNF"

        result = {
            'year': driverResult['year'],
            'raceId': driverResult['raceId'],
            'driverId': driverResult['driverId'],
            'firstName': firstName,
            'lastName': lastName,
            'abbreviation': abbreviation,
            'grid': driverResult['gridPositionNumber'],
            'position': driverResult['positionDisplayOrder'],
            'gap': gap
        }
        allResults.append(result)
    

    # Save all standings to the output files
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(allResults, f, ensure_ascii=False, indent=4)