import json

import requests

# In initialization section:
host = 'http://135.181.81.30:8090'
s = requests.Session()
s.auth = ('Participant-1', 'pass')

# ... (some code)

# When you need to send the info about an object
data = {
    "item": "Laptop",
    "coordinates": [1.1, 2.2, 3.3],
    "section": 1,
    "correct": True
}
r = s.post(host + "/storage/report/detected", json=data, verify=False)
if r.status_code != 200:  # if error
    print(r)

# Update total section count
r = s.post(host + "/storage/report/total/1", params={"count": 1}, verify=False)
#                                        ^                    ^
#                                  section_number       total_count_in_section
if r.status_code != 200:  # if error
    print(r)
