import json
import os

def getDriversStats(output_file):
    # Get the base directory of the script
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Load the necessary JSON data files
    with open(os.path.join(base_dir, './data/f1db-drivers.json'), 'r', encoding='utf-8') as f:
        current_drivers_detailed_data = json.load(f)
        
    with open(os.path.join(base_dir, './data/f1db-races-race-results.json'), 'r', encoding='utf-8') as f:
        all_races_results = json.load(f)
        
    with open(os.path.join(base_dir, './data/f1db-races.json'), 'r', encoding='utf-8') as f:
        all_races = json.load(f)

    with open(os.path.join(base_dir, './data/f1db-seasons-driver-standings.json'), 'r', encoding='utf-8') as f:
        actual_driver_points = json.load(f)

    with open(os.path.join(base_dir, './data/f1db-seasons-entrants-drivers.json'), 'r', encoding='utf-8') as f:
        entrants_drivers = json.load(f)

    # Filter drivers for the current season (2024)
    current_season_year = 2024
    current_season_drivers = [
        entry['driverId'] for entry in entrants_drivers if entry['year'] == current_season_year
    ]
    
    all_drivers_stats = []

    # Iterate through each driver in the detailed data
    for driver_data in current_drivers_detailed_data:
        driver_id = driver_data['id']
        
        # Filter victories for the driver
        victories_localisation_and_year = [
            item for item in all_races_results if item['driverId'] == driver_id and item['positionNumber'] == 1
        ]
        
        # Add race information to the victories
        victories_with_race_info = []
        for victory in victories_localisation_and_year:
            race_info = next((race for race in all_races if race['id'] == victory['raceId']), None)
            if race_info:
                victories_with_race_info.append({
                    'raceId': race_info['id'],
                    'raceName': race_info['officialName']
                })

        # Initialize current season stats
        is_a_current_season_driver = False
        number_of_races_current_season = None
        number_of_wins_current_season = 0
        number_of_podiums_current_season = 0
        number_of_points_current_season = 0
        actual_team = None

        # Check if the driver is in the current season
        if driver_id in current_season_drivers:
            current_season_entry = next(
                (entry for entry in entrants_drivers if entry['driverId'] == driver_id and entry['year'] == current_season_year), 
                None
            )
            if current_season_entry:
                is_a_current_season_driver = True
                number_of_races_current_season = len(current_season_entry['rounds'])
                actual_team = current_season_entry['constructorId']
                # Filter podiums (positions 1, 2, and 3) for the current season (2024)
                for item in all_races_results:
                    if item['driverId'] == driver_id and item['positionNumber'] in [1, 2, 3] and item['year'] == current_season_year:
                        if item['positionNumber'] == 1:
                            number_of_wins_current_season += 1
                        number_of_podiums_current_season += 1

                # Get the driver's points for the current season
                for item in actual_driver_points:
                    if item['driverId'] == driver_id:
                        number_of_points_current_season = item['points']
        else:
            is_a_current_season_driver = False
            number_of_races_current_season = None
            number_of_wins_current_season = None
            number_of_podiums_current_season = None
            number_of_points_current_season = None
            actual_team = None
        
        # Compile all driver stats
        driver_stats = {
            'id': driver_data.get('id', 'Unknown'),
            'firstName': driver_data.get('firstName', 'Unknown'),
            'lastName': driver_data.get('lastName', 'Unknown'),
            'dateOfBirth': driver_data.get('dateOfBirth', 'Unknown'),
            'nationality': driver_data.get('nationalityCountryId', 'Unknown'),
            'permanentNumber': driver_data.get('permanentNumber', 'Unknown'),
            'totalRaceStarts': driver_data.get('totalRaceStarts', 'Unknown'),
            'totalRaceWins': driver_data.get('totalRaceWins', 'Unknown'),
            'totalPodiums': driver_data.get('totalPodiums', 'Unknown'),
            'totalPoints': driver_data.get('totalPoints', 'Unknown'),
            'totalPolePositions': driver_data.get('totalPolePositions', 'Unknown'),
            'totalFastestLaps': driver_data.get('totalFastestLaps', 'Unknown'),
            'totalDriverOfTheDay': driver_data.get('totalDriverOfTheDay', 'Unknown'),
            'bestStartingGridPosition': driver_data.get('bestStartingGridPosition', 'Unknown'),
            'bestRaceResult': driver_data.get('bestRaceResult', 'Unknown'),
            'bestChampionshipPosition': driver_data.get('bestChampionshipPosition', 'Unknown'),
            'currentSeasonDriver': is_a_current_season_driver,
            'numberOfRacesCurrentSeason': number_of_races_current_season,
            'numberOfWinsCurrentSeason': number_of_wins_current_season,
            'numberOfPodiumsCurrentSeason': number_of_podiums_current_season,
            'numberOfPointsCurrentSeason': number_of_points_current_season,
            'actualTeam': actual_team,
            'allVictories': victories_with_race_info if victories_with_race_info else None
        }
        
        all_drivers_stats.append(driver_stats)
    
    # Save all drivers stats to the output file
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_drivers_stats, f, ensure_ascii=False, indent=4)