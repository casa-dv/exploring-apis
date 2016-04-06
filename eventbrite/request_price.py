import requests
import json

# local imports to reuse functions
import request_event
import request_token


def get_event_price(id, token):

    ## for me (Tom), this always returns a 403 Not Authorized error -
    # but requesting from the events/search endpoint with ticket_classes
    # expanded is successful
    response = requests.get(
        "https://www.eventbriteapi.com/v3/events/"+str(id)+"/ticket_classes/",
        headers = {
            "Authorization": "Bearer "+token,
        },
        verify = True  # Verify SSL certificate
    )
    return response.json()



if __name__ == "__main__":
    # put API token in a file called request_token.py, on a line like:
    # token = "ABC123"
    # then we can reference it here:
    token = request_token.token

    #event = request_event.get_event(token)
    id = "18935142521"
    price = get_event_price(id, token)
    print( json.dumps(price) )

