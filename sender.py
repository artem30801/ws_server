import requests


session = requests.Session()
session.auth = ('Participant-1', 'pass')

data = {"item": "Laptop", "coordinates": [1.1, 2.2, 3.3], "section": 3, "correct": True}
response = session.post("http://localhost:8000/storage/report/detected", json=data, verify=False)

session.post("http://localhost:8000/storage/report/total/1", params={"count": 3}, verify=False)
session.post("http://localhost:8000/storage/report/total/2", params={"count": 5}, verify=False)
