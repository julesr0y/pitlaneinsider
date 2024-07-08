import json
import os

def getHomeData(output_file):
    # Get the base directory of the script
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Load the necessary JSON data files
    with open(os.path.join(base_dir, '../../f1db/data/f1db-races-race-results.json'), 'r', encoding='utf-8') as f:
        all_races_standings = json.load(f)

    with open(os.path.join(base_dir, '../../f1db/data/f1db-races.json'), 'r', encoding='utf-8') as f:
        all_races = json.load(f)

    with open(os.path.join(base_dir, '../../f1db/data/f1db-grands-prix.json'), 'r', encoding='utf-8') as f:
        all_gp = json.load(f)

    with open(os.path.join(base_dir, './dataPython/all_drivers_stats.json'), 'r', encoding='utf-8') as f:
        drivers_data = json.load(f)

    with open(os.path.join(base_dir, './dataPython/all_driver_standings.json'), 'r', encoding='utf-8') as f:
        driver_standings = json.load(f)

    with open(os.path.join(base_dir, './dataPython/all_constructor_standings.json'), 'r', encoding='utf-8') as f:
        constructor_standings = json.load(f)

    # Get last race id
    index = len(all_races_standings) - 1
    race_id = all_races_standings[index]['raceId']

    home_data = []
    lastPodiumLocalisation = []
    gpId = ""
    lastPodium = []
    for event in all_races:
        if event['id'] == race_id:
            gpId = event['grandPrixId']
            for gp in all_gp:
                if gp['id'] == gpId:
                    gpDetails = {
                        'id': gp['id'],
                        'raceId': event['id'],
                        'country': gp['countryId'],
                        'name': gp['shortName']
                    }
                    lastPodiumLocalisation.append(gpDetails)
    for race in all_races_standings:
        if race['raceId'] == race_id and race['positionDisplayOrder'] in [1, 2, 3]:
            abbreviation = ""
            for item in drivers_data:
                if item['id'] == race['driverId']:
                    abbreviation = item['abbreviation']
            driverOnPodium = {
                'position': race['positionDisplayOrder'],
                'driverId': race['driverId'],
                'abbreviation': abbreviation
            }
            lastPodium.append(driverOnPodium)

    current_season_year = 2024
    driver_s = []
    for driver in driver_standings:
        if(driver['year'] == current_season_year):
            driver_s.append(driver)

    driverLeader = driver_s[0]

    constructor_s = []
    for constructor in constructor_standings:
        if(constructor['year'] == current_season_year):
            constructor_s.append(constructor)

    constructorLeader = constructor_s[0]

    elem = {
        'lastPodiumLocalisation': lastPodiumLocalisation,
        'lastPodium': lastPodium,
        'driverStandings': driver_s,
        'constructorStandings': constructor_s,
        'driverLeader': driverLeader,
        'constructorLeader': constructorLeader
    }
    home_data.append(elem)



    # Save all data to the output file
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(home_data, f, ensure_ascii=False, indent=4)