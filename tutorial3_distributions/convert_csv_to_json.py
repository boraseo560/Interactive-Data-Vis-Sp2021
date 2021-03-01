import json
import csv

with open("D:/Interactive-Data-Vis-Sp2021/tutorial3_distributions/healthcare-dataset-stroke-data.csv", "r", encoding="UTF-8") as data:
    haha = csv.DictReader(data)
    haha_list = list(haha)
with open("D:/Interactive-Data-Vis-Sp2021/tutorial3_distributions/healthcare-dataset-stroke-data.json", "w", encoding="UTF-8") as output:
    json.dump(haha_list, output, indent=4)
