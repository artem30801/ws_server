import requests
import time
import random

from collections import defaultdict

items = ["Laptop", "Smartphone", "Mousepad", "LG TV", "Fridge"]
counts = defaultdict(lambda: 0)

session = requests.Session()
session.auth = ('Participant-1', 'pass')

session.post("http://localhost:8000/storage/report/total/clear", verify=False)

while True:
    section = random.randint(1, 6)
    correct = random.choice((True, False))

    data = {"item": random.choice(items),
            "coordinates": [round(random.uniform(0, 5), 3),
                            round(random.uniform(0, 8), 3),
                            round(random.uniform(0, 1.5), 3)
                            ],
            "section": section,
            "correct": correct,
            }

    response = session.post("http://localhost:8000/storage/report/detected", json=data, verify=False)
    print(response)

    if correct:
        counts[section] += 1
        data = {"count": counts[section]}
        response = session.post(f"http://localhost:8000/storage/report/total/{section}", params=data, verify=False)
        print(response)

    time.sleep(1)