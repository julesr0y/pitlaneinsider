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

    current_season_year = 2024
    teamsData = []

    for team in teamsFile:
        is_current_season_team = False
        for entry in teamsStandingsFile:
            if entry['year'] == current_season_year and entry['constructorId'] == team['id']:
                is_current_season_team = True
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
            'totalRaceLaps': team['totalRaceLaps']
        }
        teamsData.append(teamObject)

    # Save all drivers stats to the output file
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(teamsData, f, ensure_ascii=False, indent=4)