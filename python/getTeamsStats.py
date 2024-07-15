import json
import os
from datetime import datetime

def getTeamsStats(output_file):
    # Get the base directory of the script
    base_dir = os.path.dirname(os.path.abspath(__file__))

    # Load the necessary JSON data files
    with open(os.path.join(base_dir, '../../f1db/data/f1db-constructors.json'), 'r', encoding='utf-8') as f:
        teamsFile = json.load(f)

    with open(os.path.join(base_dir, '../../f1db/data/f1db-seasons-constructor-standings.json'), 'r', encoding='utf-8') as f:
        teamsStandingsFile = json.load(f)

    with open(os.path.join(base_dir, '../../f1db/data/f1db-seasons-entrants-constructors.json'), 'r', encoding='utf-8') as f:
        entrants_constructors = json.load(f)

    with open(os.path.join(base_dir, './dataPython/all_cars.json'), 'r', encoding='utf-8') as f:
        cars = json.load(f)

    current_season_year = 2024
    teamsData = []

    for team in teamsFile:
        is_current_season_team = False
        constructor_entries = [entry for entry in entrants_constructors if entry['constructorId'] == team['id']]
        number_of_seasons = len(set(entry['year'] for entry in constructor_entries))
        for entry in teamsStandingsFile:
            if entry['year'] == current_season_year and entry['constructorId'] == team['id']:
                is_current_season_team = True

        victory_ratio = round((team.get('totalRaceWins', 0) / team['totalRaceStarts']) * 100, 2) if team['totalRaceStarts'] else 0
        podium_ratio = round((team.get('totalPodiums', 0) / team['totalRaceStarts']) * 100, 2) if team['totalRaceStarts'] else 0
        pole_ratio = round((team.get('totalPolePositions', 0) / team['totalRaceStarts']) * 100, 2) if team['totalRaceStarts'] else 0

        carId = None
        carName = None
        if is_current_season_team:
            for car in cars:
                if car['year'] == current_season_year and car['constructorId'] == team['id']:
                    carId = car['id'],
                    carName = car['name']

        teamObject = {
            'constructorId': team['id'],
            'fullName': team['fullName'],
            'name': team['name'],
            'country': team['countryId'],
            'currentSeasonTeam': is_current_season_team,
            'totalRaceStarts': team['totalRaceStarts'],
            'totalRaceWins': team['totalRaceWins'],
            'totalPodiumRaces': team['totalPodiumRaces'],
            'totalChampionshipPoints': team['totalChampionshipPoints'],
            'totalPolePositions': team['totalPolePositions'],
            'totalFastestLaps': team['totalFastestLaps'],
            'totalChampionshipWins': team['totalChampionshipWins'],
            'totalRaceLaps': team['totalRaceLaps'],
            'firstYear': constructor_entries[0]['year'],
            'numberOfSeasons': number_of_seasons,
            'victoryRatio': victory_ratio,
            'podiumRatio': podium_ratio,
            'poleRatio': pole_ratio,
            'currentCarId': carId[0] if carId else None,
            'currentCarName': carName
        }
        teamsData.append(teamObject)

    # Save all drivers stats to the output file
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(teamsData, f, ensure_ascii=False, indent=4)