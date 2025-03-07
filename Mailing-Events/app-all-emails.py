# from flask import Flask, jsonify , request
# import requests
# import json
# from access_token import access_token

# app = Flask(__name__)

# @app.route('/')
# def get_emails():
#     # Replace with your own values
#     tenant_id = '889cdbee-d881-42dc-bd06-ad3237c34a53'
#     client_id = '23400dde-f131-4a51-89e1-19ca8b23b9db'
#     client_secret = 'nGf8Q~o8N5oPwgssGIYGvnvLjgYjS.KJqbZywbU-'
#     user_email = 'mohamed.AlOUANI@tek-up.de'
    
#     # Build the request URL
#     url = f'https://graph.microsoft.com/v1.0/users/{user_email}/messages'
    
#     # Get an access token
#     headers = {
#         'Content-Type': 'application/x-www-form-urlencoded'
#     }
#     data = {
#         'grant_type': 'client_credentials',
#         'client_id': client_id,
#         'client_secret': client_secret,
#         'scope': 'https://graph.microsoft.com/.default'
#     }
#     response = requests.post(f'https://login.microsoftonline.com/{tenant_id}/oauth2/v2.0/token', headers=headers, data=data)
#     # access_token = response.json()['access_token']
   
#     # Call the Microsoft Graph API
#     headers = {
#         'Authorization': f'Bearer {access_token}',
#         'Content-Type': 'application/json'
#     }
#     response = requests.get(url, headers=headers)
    
#     # Parse the response and extract the relevant information
#     emails = []
#     print(response.json()['value'])
#     # for message in response.json()['value']:
#     #     email = {
#     #         'id' : message['id'],
#     #         'receivedDateTime' : message['receivedDateTime'],
#     #         'sentDateTime' : message['sentDateTime'],
#     #         'subject': message['subject'],
#     #         'from': message['from']['emailAddress']['name'],
#     #         'to': [recipient['emailAddress']['name'] for recipient in message['toRecipients']],
#     #         'body_preview': message['bodyPreview'],
#     #         'isRead' : message['isRead'],
#     #         'isDraft' : message['isDraft'],
#     #         'body' : message['body']['content'],
            
            
#     #     }
#     #     emails.append(email)
#     emails=response.json()['value']
    
#     # Return the extracted information in a JSON format
#     return jsonify(emails)

