import requests
from bs4 import BeautifulSoup as bs
import sys
import json
import time

cities = sys.argv[1]
cities = json.loads(cities)


def get_weather(cities):
    ret = []
    for cityID, place in cities.items():
        place = place.replace(" ", "-")
        url = "https://www.weather-forecast.com/locations/" + place + "/forecasts/latest"
        r = requests.get(url)
        soup = bs(r.content, "html5lib")
        ret.append(place + " " + soup.findAll("span",
                                              {"class": "phrase"})[0].text)
    return json.dumps(ret)


print(get_weather(cities))
sys.stdout.flush()
