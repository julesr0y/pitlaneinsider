import json
import os
from getDriversStats import getDriversStats

def main():
    outputFileDriversStats = "./python/dataPython/all_drivers_stats.json"
    getDriversStats(outputFileDriversStats)
    print(f"All drivers stats saved to {outputFileDriversStats}")

main()