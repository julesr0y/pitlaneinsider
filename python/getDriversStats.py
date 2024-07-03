import json
import os
from datetime import datetime

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
    current_season_drivers = {entry['driverId'] for entry in entrants_drivers if entry['year'] == current_season_year}
    
    all_drivers_stats = []

    # Preprocess all races for quick lookup by raceId
    races_by_id = {race['id']: race for race in all_races}

    # Preprocess all results by driverId
    results_by_driver = {}
    for result in all_races_results:
        driver_id = result['driverId']
        if driver_id not in results_by_driver:
            results_by_driver[driver_id] = []
        results_by_driver[driver_id].append(result)

    # Iterate through each driver in the detailed data
    for driver_data in current_drivers_detailed_data:
        driver_id = driver_data['id']

        # Calculate age
        birth = datetime.strptime(driver_data['dateOfBirth'], "%Y-%m-%d")
        if driver_data.get('dateOfDeath'):
            death = datetime.strptime(driver_data['dateOfDeath'], "%Y-%m-%d")
            age = death.year - birth.year
        else:
            now = datetime.now()
            age = now.year - birth.year
            if (now.month, now.day) < (birth.month, birth.day):
                age -= 1

        # Filter victories for the driver
        victories_by_year = {}
        if driver_id in results_by_driver:
            for result in results_by_driver[driver_id]:
                if result['positionNumber'] == 1:
                    race_info = races_by_id.get(result['raceId'])
                    if race_info:
                        year = race_info['year']
                        if year not in victories_by_year:
                            victories_by_year[year] = []
                        victories_by_year[year].append(race_info['officialName'])

        # Initialize current season stats
        is_a_current_season_driver = False
        is_a_test_driver = False
        number_of_races_current_season = 0
        number_of_wins_current_season = 0
        number_of_podiums_current_season = 0
        number_of_points_current_season = 0
        actual_team = None

        # Check if the driver is in the current season
        if driver_id in current_season_drivers:
            for entry in entrants_drivers:
                if entry['driverId'] == driver_id and entry['year'] == current_season_year:
                    is_a_current_season_driver = True
                    number_of_races_current_season += len(entry['rounds'])
                    actual_team = entry['constructorId']
                    if entry.get('testDriver', False):
                        is_a_test_driver = True
                    break
            
            # Calculate current season stats
            for result in results_by_driver.get(driver_id, []):
                if result['year'] == current_season_year:
                    if result['positionNumber'] in [1, 2, 3]:
                        number_of_podiums_current_season += 1
                        if result['positionNumber'] == 1:
                            number_of_wins_current_season += 1
            
            for points in actual_driver_points:
                if points['driverId'] == driver_id and points['year'] == current_season_year:
                    number_of_points_current_season = points['points']
                    break

        # Calculation of ratios
        total_race_starts = driver_data.get('totalRaceStarts', 0)
        victory_ratio = round((driver_data.get('totalRaceWins', 0) / total_race_starts) * 100, 2) if total_race_starts else 0
        podium_ratio = round((driver_data.get('totalPodiums', 0) / total_race_starts) * 100, 2) if total_race_starts else 0
        pole_ratio = round((driver_data.get('totalPolePositions', 0) / total_race_starts) * 100, 2) if total_race_starts else 0

        # Group consecutive years for the same team
        teams_of_driver = []
        driver_entries = [entry for entry in entrants_drivers if entry['driverId'] == driver_id]
        driver_entries.sort(key=lambda x: x['year'])

        current_team = None
        start_year = None
        end_year = None
        for entry in driver_entries:
            team = entry['constructorId']
            year = entry['year']
            if current_team is None:
                current_team = team
                start_year = year
                end_year = year
            elif team == current_team and year == end_year + 1:
                end_year = year
            else:
                teams_of_driver.append({'year': f"{start_year}-{end_year}" if start_year != end_year else str(start_year), 'teamId': current_team})
                current_team = team
                start_year = year
                end_year = year
        if current_team is not None:
            teams_of_driver.append({'year': f"{start_year}-{end_year}" if start_year != end_year else str(start_year), 'teamId': current_team})

        number_of_seasons = len(set(entry['year'] for entry in driver_entries))

        # Compile all driver stats
        driver_stats = {
            'id': driver_data.get('id', 'Unknown'),
            'firstName': driver_data.get('firstName', 'Unknown'),
            'lastName': driver_data.get('lastName', 'Unknown'),
            'dateOfBirth': driver_data.get('dateOfBirth', 'Unknown'),
            'dateOfDeath': driver_data.get('dateOfDeath', 'Unknown') if driver_data.get('dateOfDeath') else None,
            'age': age,
            'nationality': driver_data.get('nationalityCountryId', 'Unknown'),
            'permanentNumber': driver_data.get('permanentNumber', 'Unknown'),
            'firstYear': driver_entries[0]['year'] if driver_entries else 'Unknown',
            'numberOfSeasons': number_of_seasons,
            'totalRaceStarts': total_race_starts,
            'totalRaceWins': driver_data.get('totalRaceWins', 'Unknown'),
            'totalPodiums': driver_data.get('totalPodiums', 'Unknown'),
            'totalPoints': driver_data.get('totalPoints', 'Unknown'),
            'totalPolePositions': driver_data.get('totalPolePositions', 'Unknown'),
            'totalFastestLaps': driver_data.get('totalFastestLaps', 'Unknown'),
            'totalDriverOfTheDay': driver_data.get('totalDriverOfTheDay', 'Unknown'),
            'bestStartingGridPosition': driver_data.get('bestStartingGridPosition', 'Unknown'),
            'bestRaceResult': driver_data.get('bestRaceResult', 'Unknown'),
            'bestChampionshipPosition': driver_data.get('bestChampionshipPosition', 'Unknown'),
            'teams': teams_of_driver,
            'currentSeasonDriver': is_a_current_season_driver,
            'testDriver': is_a_test_driver,
            'numberOfRacesCurrentSeason': number_of_races_current_season,
            'numberOfWinsCurrentSeason': number_of_wins_current_season,
            'numberOfPodiumsCurrentSeason': number_of_podiums_current_season,
            'numberOfPointsCurrentSeason': number_of_points_current_season,
            'actualTeam': actual_team,
            'allVictories': victories_by_year if victories_by_year else None,
            'victoryRatio': victory_ratio,
            'podiumRatio': podium_ratio,
            'poleRatio': pole_ratio
        }
        
        all_drivers_stats.append(driver_stats)
    
    # Save all drivers stats to the output file
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_drivers_stats, f, ensure_ascii=False, indent=4)