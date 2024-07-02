import json
import os
from getDriversStats import getDriversStats
from getDriversCurrentSeason import getDriversCurrentSeason
from getDriversAllSeasons import getDriversAllSeasons
from getAllDriverIds import allIds

def main():
    outputFileDriversStats = "./python/dataPython/all_drivers_stats.json"
    getDriversStats(outputFileDriversStats)
    outputFileCurrentSeasonDrivers = "./python/dataPython/current_season_drivers.json"
    # getDriversCurrentSeason(outputFileCurrentSeasonDrivers)
    # print(f"All current season drivers saved to {outputFileDriversStats}")
    outputFileAllSeasonDrivers = "./python/dataPython/all_seasons_drivers.json"
    # getDriversAllSeasons(outputFileAllSeasonDrivers)
    # print(f"All seasons drivers saved to {outputFileAllSeasonDrivers}")
    outputFileAllDriversIds = "./python/dataPython/all_drivers_ids.json"
    # allIds(outputFileAllDriversIds)
    # print(f"All drivers ids saved to {outputFileAllDriversIds}")

main()