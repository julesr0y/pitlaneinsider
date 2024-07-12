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

    with open(os.path.join(base_dir, '../../f1db/data/f1db-races-fastest-laps.json'), 'r', encoding='utf-8') as f:
        fastests_laps = json.load(f)

    with open(os.path.join(base_dir, '../../f1db/data/f1db-races-pit-stops.json'), 'r', encoding='utf-8') as f:
        pit_stops = json.load(f)

    # Create a dictionary to store the fastest lap for each race
    fastest_laps_by_race = {}
    for lap in fastests_laps:
        race_id = lap['raceId']
        if race_id not in fastest_laps_by_race or lap['timeMillis'] < fastest_laps_by_race[race_id]['timeMillis']:
            fastest_laps_by_race[race_id] = lap

    # Create a dictionary to store the pit stops for each race
    fastest_pit_stops_by_race = {}
    for pit in pit_stops:
        race_id = pit['raceId']
        if pit['timeMillis'] is not None and (race_id not in fastest_pit_stops_by_race or pit['timeMillis'] < fastest_pit_stops_by_race[race_id]['timeMillis']):
            fastest_pit_stops_by_race[race_id] = pit

    allResults = []
    for driverResult in race_results:
        race_id = driverResult['raceId']
        
        # Get driver details
        firstName = ""
        lastName = ""
        abbreviation = ""
        for driver in drivers_data:
            if driver['id'] == driverResult['driverId']:
                firstName = driver['firstName']
                lastName = driver['lastName']
                abbreviation = driver["abbreviation"]
                break

        # Get fastest lap time if the driver has it
        fastestLapTime = None
        if race_id in fastest_laps_by_race and fastest_laps_by_race[race_id]['driverId'] == driverResult['driverId']:
            fastestLapTime = fastest_laps_by_race[race_id]['time']

        fastestPitTime = None
        if race_id in fastest_pit_stops_by_race and fastest_pit_stops_by_race[race_id]['driverId'] == driverResult['driverId']:
            fastestPitTime = fastest_pit_stops_by_race[race_id]['time']

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
            'gap': gap,
            'fastestLapTime': fastestLapTime,
            'fastestPitTime': fastestPitTime
        }
        allResults.append(result)
    
    # Save all standings to the output file
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(allResults, f, ensure_ascii=False, indent=4)