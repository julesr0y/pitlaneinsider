import json
import os

def getDriversCurrentSeason(output_file):
    # Get the base directory of the script
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Load the necessary JSON data files
    with open(os.path.join(base_dir, './data/f1db-drivers.json'), 'r', encoding='utf-8') as f:
        currentDriversData = json.load(f)

    with open(os.path.join(base_dir, './data/f1db-seasons-entrants-drivers.json'), 'r', encoding='utf-8') as f:
        currentDrivers = json.load(f)

    all_current_drivers = []

    # Filter drivers for the current season (2024)
    current_season_year = 2024
    current_season_drivers = [
        entry['driverId'] for entry in currentDrivers if entry['year'] == current_season_year and entry['testDriver'] == False
    ]

    for driver_data in currentDriversData:
        driver_id = driver_data['id']

        # Check if the driver is in the current season
        if driver_id in current_season_drivers:
            driver = {
                'driverId': driver_id,
                'firstName': driver_data['firstName'],
                'lastName': driver_data['lastName'],
                'nationality': driver_data['nationalityCountryId'],
                'permanentNumber': driver_data['permanentNumber']
            }
            
            all_current_drivers.append(driver)

    # Save all drivers stats to the output file
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_current_drivers, f, ensure_ascii=False, indent=4)