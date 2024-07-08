from getDriversStats import getDriversStats
from getTeamsStats import getTeamsStats
from getActualStandings import getStandings
from getHomeData import getHomeData
from getTitledDrivers import getTitledDrivers
from getCalendar import getCalendar
from getAllRacesQualiAndResults import getAllRacesQualiAndResults

def main():
    outputFileDriversStats = "./python/dataPython/all_drivers_stats.json"
    getDriversStats(outputFileDriversStats)
    print(f"All drivers stats saved to {outputFileDriversStats}")
    outputFileTeamsStats = "./python/dataPython/all_teams_stats.json"
    getTeamsStats(outputFileTeamsStats)
    print(f"All teams stats saved to {outputFileTeamsStats}")
    output_file_drivers = "./python/dataPython/all_driver_standings.json"
    output_file_constructors = "./python/dataPython/all_constructor_standings.json"
    getStandings(output_file_drivers, output_file_constructors)
    print(f"All standings saved to {output_file_drivers, output_file_constructors}")
    output_file_home_data = "./python/dataPython/home_data.json"
    getHomeData(output_file_home_data)
    print(f"All homepage data saved to {output_file_home_data}")
    output_file_titled_drivers = "./python/dataPython/titled_drivers.json"
    getTitledDrivers(output_file_titled_drivers)
    print(f"All titled drivers data saved to {output_file_titled_drivers}")
    output_file_calendar = "./python/dataPython/all_calendar.json"
    getCalendar(output_file_calendar)
    print(f"All calendar data saved to {output_file_calendar}")
    output_file_races_results = "./python/dataPython/all_races_and_quali_results.json"
    getAllRacesQualiAndResults(output_file_races_results)
    print(f"All races and quali data saved to {output_file_races_results}")

main()