from flask import Flask, request , jsonify
import requests
from access_token import access_token
import json
from flask_cors import CORS
# from ms_graph import get_access_token
import datetime
import pytz

app = Flask(__name__)

cors = CORS(app, resources={r"/*": {"origins": "*"}})


@app.route('/create_event', methods=['POST'])
def create_event():
    # Get the JSON data from the request body
    event_data = request.json

    # Microsoft Graph API endpoint to create an event
    graph_api_url = 'https://graph.microsoft.com/v1.0/me/events'

    # Access token for authorization
    # Replace with your actual access token

    # Set the headers for authorization and content type
    headers = {
        'Authorization': 'Bearer ' + access_token,
        'Content-Type': 'application/json'
    }

    # Make a POST request to create the event
    response = requests.post(graph_api_url, headers=headers, json=event_data)

    if response.status_code == 201:
        return 'Event created successfully'
    else:
        return 'Failed to create event'


@app.route('/events/nextweek', methods=['GET'])
def get_events_next_week():
    base_url = "https://graph.microsoft.com/v1.0/me/calendarview"
    at = access_token  # Replace with your actual access token

    # Get the current UTC datetime
    current_datetime = datetime.datetime.now(pytz.utc)

    # Calculate the start and end dates for the next week
    start_date = current_datetime.date()
    end_date = start_date + datetime.timedelta(days=7)

    # Format the start and end dates in the desired format
    start_datetime = start_date.strftime("%Y-%m-%dT00:00:00Z")
    end_datetime = end_date.strftime("%Y-%m-%dT00:00:00Z")

    headers = {
        'Authorization': 'Bearer ' + at
    }

    url =base_url + "?startdatetime=" + start_datetime + "&enddatetime=" + end_datetime
    print(url)
    print(start_datetime)
    print(end_datetime)
    response = requests.get(url, headers=headers)
    events = response.json()['value']
    return jsonify(events)
    #if response.status_code == 200:
    #    events = response.json()['value']
    #    return jsonify(events)
    #else:
    #    return jsonify({'error': 'Failed to retrieve events'})


@app.route('/send_email', methods=['POST'])
def send_email():
    # Get the JSON data from the request body
    email_data = request.json

    # Microsoft Graph API endpoint to send an email
    graph_api_url = 'https://graph.microsoft.com/v1.0/me/sendMail'

    # Access token for authorization
    # at = access_token# Replace with your actual access token

    # Set the headers for authorization and content type
    headers = {
        'Authorization': 'Bearer ' + access_token,
        'Content-Type': 'application/json'
    }

    # Create the request body for sending email
    request_body = {
        'message': {
            'subject': email_data['subject'],
            'body': {
                'contentType': 'HTML',
                'content': email_data['content']
            },
            'toRecipients': email_data['to_recipients']
        },
        'saveToSentItems': 'true'
    }

    # Make a POST request to send the email
    response = requests.post(graph_api_url, headers=headers, json=request_body)

    if response.status_code == 202:
        return 'Email sent successfully'
    else:
        return 'Failed to send email'

@app.route('/endpoint/<email_type>')
def endpoint(email_type):
    # Do something with the parameter value
    return email_type

@app.route('/<email_type>')
def get_emails(email_type):
    # Replace with your own values
    tenant_id = '889cdbee-d881-42dc-bd06-ad3237c34a53'
    client_id = '23400dde-f131-4a51-89e1-19ca8b23b9db'
    client_secret = 'nGf8Q~o8N5oPwgssGIYGvnvLjgYjS.KJqbZywbU-'
    user_email = 'mohamed.AlOUANI@tek-up.de'
    
    # Build the request URL  
    # url = f'https://graph.microsoft.com/v1.0/users/{user_email}/messages'
    # url = f'https://graph.microsoft.com/v1.0/me/mailFolders/Inbox/messages?$top=50'
    
    # EMAIL TYPE :
    # SentItems
    # Inbox
    url = f'https://graph.microsoft.com/v1.0/me/mailFolders/{email_type}/messages'

    # Get an access token
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    data = {
        'grant_type': 'client_credentials',
        'client_id': client_id,
        'client_secret': client_secret,
        'scope': 'https://graph.microsoft.com/.default'
    }
    response = requests.post(f'https://login.microsoftonline.com/{tenant_id}/oauth2/v2.0/token', headers=headers, data=data)
    # access_token = response.json()['access_token']
    # Call the Microsoft Graph API
    # at = get_access_token(client_id, client_secret, tenant_id)
    # print(at)
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }
    response = requests.get(url, headers=headers)
    
    # Parse the response and extract the relevant information
    emails = []
    # print(response.json()['value'])
    # for message in response.json()['value']:
    #     email = {
    #         'id' : message['id'],
    #         'receivedDateTime' : message['receivedDateTime'],
    #         'sentDateTime' : message['sentDateTime'],
    #         'subject': message['subject'],
    #         'from': message['from']['emailAddress']['name'],
    #         'to': [recipient['emailAddress']['name'] for recipient in message['toRecipients']],
    #         'body_preview': message['bodyPreview'],
    #         'isRead' : message['isRead'],
    #         'isDraft' : message['isDraft'],
    #         'body' : message['body']['content'],
            
            
    #     }
    #     emails.append(email)
    emails=response.json()['value']
    
    # Return the extracted information in a JSON format
    return jsonify(emails)


if __name__ == '__main__':
    app.run()
