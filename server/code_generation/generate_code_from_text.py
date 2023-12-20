import os
import google.generativeai as palm

palm.configure(api_key=os.getenv("PALM_API_KEY"))

def generate_code_from_text(input_text):
    prompt = f"You are a Senior Software Developer. I want you to give a React code which designs a component according to the given specifications + {input_text}."

    completion = palm.generate_text(
        model="models/text-bison-001",
        prompt=prompt,
        temperature=0,
        max_output_tokens=1000,
    )

    return completion.result