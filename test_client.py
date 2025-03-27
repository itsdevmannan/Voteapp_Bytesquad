from enum import Enum
import requests


class Party(Enum):
    BJP = "BJP"
    AAP = "AAP"
    CONGRESS = "CONGRESS"
    JUICE_WRLD = "JUICE WRLD"


response = requests.post(
    "http://127.0.0.1:8080/vote",
    json={"party": Party.AAP.name},
    headers={"voter_id": "239882"},
)

print(f"Status code: {response.status_code}")
print(f"Response: {response.json()}")