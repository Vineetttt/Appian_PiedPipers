import json

def load_json_data(filename):
    try:
        with open(filename, "r") as json_file:
            input_data = json.load(json_file)
            return json.dumps(input_data)
    except json.JSONDecodeError:
        return None

def get_prompt(input_data):
    if not input_data:
        return None
    return input_data