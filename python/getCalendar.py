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

    with open(os.path.join(base_dir, './dataPython/all_races_and_quali_results.json'), 'r', encoding='utf-8') as f:
        last_gp = json.load(f)

    last_gp_id = int(last_gp[-1]['raceInfo'][0]['raceId'])

    all_events = []
    for event in calendar:
        nextGp = False
        if event['id'] == last_gp_id + 1:
            nextGp = True

        localisationDetails = []
        for gp in all_gp:
            if gp['id'] == "europe":
                gp['countryId'] = gp['id']
            if gp['id'] == event['grandPrixId']:
                details = {
                    'id': gp['id'],
                    'country': gp['countryId'],
                    'name': gp['shortName'],
                    'year': event['year'],
                    'date': event['date'],
                    'raceId': event['id'],
                    'circuitId': event['circuitId'],
                    'isNextGp': nextGp
                }
                localisationDetails.append(details)

        race = []
        if 'freePractice1Date' in event:
            fp1 = {
                'freePractice1Date': event['freePractice1Date'],
                'freePractice1Time': event['freePractice1Time']
            }
            race.append(fp1)
        if 'freePractice2Date' in event:
            fp2 = {
                'freePractice2Date': event['freePractice2Date'],
                'freePractice2Time': event['freePractice2Time']
            }
            race.append(fp2)
        if 'freePractice3Date' in event:
            fp3 = {
                'freePractice3Date': event['freePractice3Date'],
                'freePractice3Time': event['freePractice3Time']
            }
            race.append(fp3)
        if 'sprintQualifyingDate' in event:
            sq = {
                'sprintQualifyingDate': event['sprintQualifyingDate'],
                'sprintQualifyingTime': event['sprintQualifyingTime']
            }
            race.append(sq)
        if 'qualifyingDate' in event:
            q = {
                'qualifyingDate': event['qualifyingDate'],
                'qualifyingTime': event['qualifyingTime']
            }
            race.append(q)
        if 'sprintRaceDate' in event:
            s = {
                'sprintRaceDate': event['sprintRaceDate'],
                'sprintRaceTime': event['sprintRaceTime']
            }
            race.append(s)
        r = {
            'raceDate': event['date'],
            'raceTime': event['time']
        }
        race.append(r)

        raceDetails = {
            'raceDetails': localisationDetails
        }
        dateDetails = {
            'dateDetails': race
        }

        event_details = []
        event_details.append(raceDetails)
        event_details.append(dateDetails)

        all_events.append(event_details)

    # Save all data to the output file
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_events, f, ensure_ascii=False, indent=4)