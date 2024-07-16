from collections import defaultdict

# Données d'entrée
data = [
            {
                "year": "2014-2015",
                "teamId": "toro-rosso",
                "teamName": "Toro Rosso"
            },
            {
                "year": "2016",
                "teamId": "red-bull",
                "teamName": "Red Bull"
            },
            {
                "year": "2016",
                "teamId": "toro-rosso",
                "teamName": "Toro Rosso"
            },
            {
                "year": "2017-2024",
                "teamId": "red-bull",
                "teamName": "Red Bull"
            }
        ]

def sortDriverTeamsCareer(data):
    # Regrouper les années par équipe
    result = defaultdict(list)
    for item in data:
        team_id = item["teamId"]
        years = item["year"].split("-")
        if len(years) == 1:
            result[team_id].append((int(years[0]), int(years[0])))
        else:
            start_year = int(years[0])
            end_year = int(years[1])
            result[team_id].append((start_year, end_year))

    # Formater les années en chaînes de caractères
    output = []
    for team_id, periods in result.items():
        periods.sort()
        current_start = None
        current_end = None
        for start_year, end_year in periods:
            if current_start is None:
                current_start = start_year
                current_end = end_year
            elif start_year == current_end + 1:
                current_end = end_year
            else:
                if current_start == current_end:
                    output.append({
                        "teamId": team_id,
                        "teamName": next(item["teamName"] for item in data if item["teamId"] == team_id),
                        "year": str(current_start)
                    })
                else:
                    output.append({
                        "teamId": team_id,
                        "teamName": next(item["teamName"] for item in data if item["teamId"] == team_id),
                        "year": f"{current_start}-{current_end}"
                    })
                current_start = start_year
                current_end = end_year

        if current_start is not None:
            if current_start == current_end:
                output.append({
                    "teamId": team_id,
                    "teamName": next(item["teamName"] for item in data if item["teamId"] == team_id),
                    "year": str(current_start)
                })
            else:
                output.append({
                    "teamId": team_id,
                    "teamName": next(item["teamName"] for item in data if item["teamId"] == team_id),
                    "year": f"{current_start}-{current_end}"
                })

    # Trier par année chronologique
    output.sort(key=lambda x: (int(x["year"].split("-")[0]), int(x["year"].split("-")[-1])))
