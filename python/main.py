from getDriversStats import getDriversStats
from getActualStandings import getStandings
from getHomeData import getHomeData

def main():
    outputFileDriversStats = "./python/dataPython/all_drivers_stats.json"
    getDriversStats(outputFileDriversStats)
    print(f"All drivers stats saved to {outputFileDriversStats}")
    output_file_drivers = "./python/dataPython/all_driver_standings.json"
    output_file_constructors = "./python/dataPython/all_constructor_standings.json"
    getStandings(output_file_drivers, output_file_constructors)
    print(f"All standings saved to {output_file_drivers, output_file_constructors}")
    output_file_home_data = "./python/dataPython/home_data.json"
    getHomeData(output_file_home_data)
    print(f"All homepage data saved to {output_file_home_data}")

main()