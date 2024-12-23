import requests

url = 'http://localhost:8080/moodle/webservice/rest/server.php?moodlewsrestformat=json'
    
    # The parameters for the request
params = {
    'wstoken': "4adcb6a4ab1961ca5d8356a9dcf93e07",
    'wsfunction': 'core_webservice_get_site_info',
}

try:
    # Send the GET request
    response = requests.get(url, params=params)
    
    # Raise an exception if the request was unsuccessful
    response.raise_for_status()
    
    # Try to parse the response JSON
    try:
        data = response.json()
        # Check if the token is valid and has the necessary permissions
        if 'exception' in data:
            print(f"Error: {data['message']}")
        else:
            print("Token is valid and has the necessary permissions.")
            print(data)
    except requests.exceptions.JSONDecodeError:
        # If the response is not JSON, print the raw content
        print("Response is not in JSON format. Raw content:")
        print(response.content)

except requests.exceptions.RequestException as e:
    # If there is a requests exception, print it
    print(f"An error occurred: {e}")
