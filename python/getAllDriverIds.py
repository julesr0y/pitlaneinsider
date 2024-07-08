import json
import os

def allIds(output):
    # Get the base directory of the script
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Load the necessary JSON data files
    with open(os.path.join(base_dir, '../../f1db/data/f1db-drivers.json'), 'r', encoding='utf-8') as f:
        current_drivers_detailed_data = json.load(f)

    all_ids = []

    for driver in current_drivers_detailed_data:
        one_driver = {
            (driver['lastName']).lower(): driver['id']
        }

        all_ids.append(one_driver)

    # Save all drivers stats to the output file
    with open(output, 'w', encoding='utf-8') as f:
        json.dump(all_ids, f, ensure_ascii=False, indent=4)