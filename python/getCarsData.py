import json
import os

def getCarsData(output_file):
    # Get the base directory of the script
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Load the necessary JSON data files
    with open(os.path.join(base_dir, './dataPython/all_cars.json'), 'r', encoding='utf-8') as f:
        cars = json.load(f)

    with open(os.path.join(base_dir, '../../f1db/data/f1db-seasons-entrants-constructors.json'), 'r', encoding='utf-8') as f:
        engineIds = json.load(f)

    all_cars = []
    for car in cars:
        engineManufacturerId = None
        for engine in engineIds:
            
            if engine['constructorId'] == car['constructorId'] and engine['year'] == car['year']:
                engineManufacturerId = engine["engineManufacturerId"]

        carObject = {
            "id": car['id'],
            "name": car['name'],
            "constructorId": car['constructorId'],
            "engineManufacturerId": engineManufacturerId,
            "year": int(car['year'])
        }
        all_cars.append(carObject)

    # Save all car data to the output files
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_cars, f, ensure_ascii=False, indent=4)