import json
import os

def getCalendar(output_file):
    # Get the base directory of the script
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Load the necessary JSON data files
    with open(os.path.join(base_dir, '../../f1db/data/f1db-races.json'), 'r', encoding='utf-8') as f:
        calendar = json.load(f)

    with open(os.path.join(base_dir, '../../f1db/data/f1db-grands-prix.json'), 'r', encoding='utf-8') as f:
        all_gp = json.load(f)

    all_events = []
    for event in calendar:
        localisationDetails = []
        for gp in all_gp:
            if gp['id'] == event['grandPrixId']:
                details = {
                    'id': gp['id'],
                    'country': gp['countryId'],
                    'name': gp['shortName'],
                    'year': event['year'],
                    'date': event['date'],
                    'raceId': event['id']
                }
                localisationDetails.append(details)

        race = []
        fp1 = {
            'freePractice1Date': event['freePractice1Date'],
            'freePractice1Time': event['freePractice1Time']
        }
        fp2 = {
            'freePractice2Date': event['freePractice2Date'],
            'freePractice2Time': event['freePractice2Time']
        }
        fp3 = {
            'freePractice3Date': event['freePractice3Date'],
            'freePractice3Time': event['freePractice3Time']
        }
        sq = {
            'sprintQualifyingDate': event['sprintQualifyingDate'],
            'sprintQualifyingTime': event['sprintQualifyingTime']
        }
        q = {
            'qualifyingDate': event['qualifyingDate'],
            'qualifyingTime': event['qualifyingTime']
        }
        s = {
            'sprintRaceDate': event['sprintRaceDate'],
            'sprintRaceTime': event['sprintRaceTime']
        }
        r = {
            'raceDate': event['date'],
            'raceTime': event['time']
        }
        race.append(fp1)
        race.append(fp2)
        race.append(fp3)
        race.append(sq)
        race.append(q)
        race.append(s)
        race.append(r)

        raceDetails = {
            'raceDetails': localisationDetails
        }
        dateDetails = {
            'dateDetails': race
        }

        event = []
        event.append(raceDetails)
        event.append(dateDetails)

        all_events.append(event)



    # Save all data to the output file
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_events, f, ensure_ascii=False, indent=4)