import json
import re

# Load the JSON data from a file
with open('updated_menu.json') as f:
    menu_data = json.load(f)

# Define a function to convert a string to camelCase
def to_camel_case(s):
    s = re.sub(r'[\W_]+', ' ', s).title().replace(' ', '')
    return s[0].lower() + s[1:]

# Convert the keys to camelCase and remove spaces and weird characters
new_menu_data = {}
for key, value in menu_data.items():
    new_key = to_camel_case(key)
    new_menu_data[new_key] = {}
    for inner_key, inner_value in value.items():
        new_inner_key = to_camel_case(inner_key)
        new_menu_data[new_key][new_inner_key[0].lower() + new_inner_key[1:]] = inner_value

# Save the updated JSON data to a file
with open('updated_menu.json', 'w') as f:
    json.dump(new_menu_data, f, indent=4)
