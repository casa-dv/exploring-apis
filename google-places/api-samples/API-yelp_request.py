import oauth2
from yelp.client import Client
from yelp.oauth1_authenticator import Oauth1Authenticator

class Oauth1Authenticator(object):​
    def __init__(
        self,
        consumer_key,
        consumer_secret,
        token,
        token_secret
    ):
        self.consumer = oauth2.Consumer(consumer_key, consumer_secret)
        self.token = oauth2.Token(token, token_secret)
​
    def sign_request(self, url, url_params={}):
        oauth_request = oauth2.Request(
            method="GET",
            url=url,
            parameters=url_params
        )
        oauth_request.update(
            {
                "oauth_nonce": oauth2.generate_nonce(),
                "oauth_timestamp": oauth2.generate_timestamp(),
                "oauth_token": self.token.key,
                "oauth_consumer_key": self.consumer.key
            }
        )
        oauth_request.sign_request(
            oauth2.SignatureMethod_HMAC_SHA1(),
            self.consumer,
            self.token
        )
        return oauth_request.to_url()
​
def get_yelp_businesses_nearby(lat,lon,term,radius):
    auth = Oauth1Authenticator(
        consumer_key="fW0PMrTIaH_gQ1RbgZVk-g",
        consumer_secret="uPtL5lPYvkbg2hL_DXugUen6mbU",
        token="OYLNFrR_Kw4F43Qau34IyQdCTmCmvwlb",
        token_secret="5nN_zzdNxuOgC4Nu_3eVXVrCeL8"
    )
    client = Client(auth)
    params = {
        "term":term, # "food"
        "radius_filter":radius, # "300"
    }    ​
    response = client.search_by_coordinates(51.511732,-0.123270, **params)

def parse_yelp_response(response):
    businesses = []
    for business in response.businesses:
        b = {
            "name":business.name,
            "lat":business.location.coordinate.latitude,
            "lng":business.location.coordinate.longitude,
            "rating":business.rating,
            "address":business.location.address
        }
        businesses.append(b)
    return businesses
