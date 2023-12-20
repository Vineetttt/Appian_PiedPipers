from flask import Flask, jsonify, request
from flask_cors import CORS

from image_to_code.code_generation import generate_code_from_caption
from image_to_code.image_captioning import generate_image_caption

app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})
UPLOAD_FOLDER = 'static/uploads'

@app.route('/api/v1/')
def index():
    return jsonify({'message': 'Welcome to the Image Captioning and Code Generation API'})
    
@app.route('/api/v1/code_generation/from_image', methods=['POST'])
def generate_code_from_image():
    try:
        image_file = request.files['file']
        print(image_file)
        image_path = f"{UPLOAD_FOLDER}/uploaded_image.jpg"
        image_file.save(image_path)
        caption = generate_image_caption(image_path)
        generated_code = generate_code_from_caption(caption)
        return jsonify({"generated_code": generated_code, "image_caption": caption})

    except Exception as e:
        return jsonify({"error":str(e)})


if __name__ == '__main__':
    app.run(debug=True)