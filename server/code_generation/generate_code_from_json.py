import os
import google.generativeai as palm

palm.configure(api_key=os.getenv("PALM_API_KEY"))

def generate_code_from_json(prompt):
    try:
        completion = palm.generate_text(
            model="models/text-bison-001",
            prompt='Generate a React code for this json' + prompt,
            temperature=0,
            max_output_tokens=1000,
        )
        return completion.result
    except Exception as e:
        return str(e)