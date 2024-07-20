import json
import os

def getAllTracks(output_file):
    # Get the base directory of the script
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Load the necessary JSON data files
    with open(os.path.join(base_dir, '../../f1db/data/f1db-circuits.json'), 'r', encoding='utf-8') as f:
        tracks = json.load(f)

    all_tracks = []
    
    for track in tracks:
        trackObject = {
            'id': track['id'],
            'name': track['name'],
            'fullName': track['fullName'],
            'type': track['type'],
            'placeName': track['placeName'],
            'countryId': track['countryId'],
            'totalRacesHeld': track['totalRacesHeld']
        }
        all_tracks.append(trackObject)

    # Save all data to the output file
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_tracks, f, ensure_ascii=False, indent=4)