import requests

def get_access_token(client_id, client_secret, tenant_id):
    token_url = f"https://login.microsoftonline.com/{tenant_id}/oauth2/v2.0/token"
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    data = {
        "grant_type": "client_credentials",
        "client_id": client_id,
        "client_secret": client_secret,
        "scope": "https://graph.microsoft.com/Calendars.Read https://graph.microsoft.com/Calendars.ReadWrite https://graph.microsoft.com/OnlineMeetings.ReadWrite https://graph.microsoft.com/People.Read.All https://graph.microsoft.com/User.Read https://graph.microsoft.com/User.Read.All"
    }

    response = requests.post(token_url, headers=headers, data=data)
    if response.status_code == 200:
        token_data = response.json()
        access_token = token_data["access_token"]
        return access_token
    else:
        raise Exception("Failed to obtain access token")

# # Usage example
tenant_id = '889cdbee-d881-42dc-bd06-ad3237c34a53'
client_id = '23400dde-f131-4a51-89e1-19ca8b23b9db'
client_secret = 'nGf8Q~o8N5oPwgssGIYGvnvLjgYjS.KJqbZywbU-'

access_token = get_access_token(client_id, client_secret, tenant_id)
print(f"Access Token: {access_token}")
