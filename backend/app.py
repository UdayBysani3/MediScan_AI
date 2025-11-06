import os
import io
import numpy as np
import tensorflow as tf
from PIL import Image
from flask import Flask, request, jsonify
from flask_cors import CORS

# 1. INITIAL SETUP
app = Flask(__name__)
CORS(app) # Allow requests from your Node.js server

# 2. DEEP LEARNING MODEL SETUP
try:
    MODELS = {
        'diabetic-retinopathy': tf.keras.models.load_model('models/diabeticRetinopathy.keras'),
        'skin-disease': tf.keras.models.load_model('models/skinDisease.keras'),
        'brain-tumor': tf.keras.models.load_model('models/brainTumor.keras')
    }
    print("✅ All AI models loaded successfully.")
except Exception as e:
    print(f"❌ Error loading models: {e}")
    MODELS = {}

CLASS_NAMES = {
    'diabetic-retinopathy': ['Diabetic Retinopathy', 'Normal'],
    'skin-disease': ["actinic_keratosis", "atopic_dermatitis", "benign_keratosis", "candidiasis_ringworm_tinea", "dermatofibroma", "melanocytic_nevus", "melanoma", "squamous_cell_carcinoma", "vascular_lesion"],
    'brain-tumor': ['glioma', 'meningioma', 'No-Tumor', 'pituitary_adenoma']
}

def preprocess_image(image_bytes, target_size=(224, 224)):
    img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    img = img.resize(target_size)
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

# 3. THE ONLY API ENDPOINT
@app.route("/analyze-image", methods=["POST"])
def analyze_image():
    if 'imageFile' not in request.files or 'modelId' not in request.form:
        return jsonify({"error": "Missing 'imageFile' or 'modelId'"}), 400

    file = request.files['imageFile']
    model_id = request.form['modelId']

    if model_id not in MODELS:
        return jsonify({"error": f"Invalid model ID: {model_id}"}), 400

    try:
        image_bytes = file.read()
        processed_image = preprocess_image(image_bytes)
        model = MODELS[model_id]

        prediction_scores = model.predict(processed_image)
        confidence = float(np.max(prediction_scores[0]))
        predicted_class_index = np.argmax(prediction_scores[0])
        predicted_class_name = CLASS_NAMES[model_id][predicted_class_index]

        result = {
            "prediction": predicted_class_name,
            "confidence": confidence,
            "details": f"AI analysis suggests signs consistent with {predicted_class_name}."
        }
        return jsonify(result)

    except Exception as e:
        print(f"ERROR during analysis: {e}")
        return jsonify({"error": "Internal server error during analysis"}), 500

# 4. RUN THE AI SERVER
if __name__ == "__main__":
    # Run on a different port, e.g., 8000
    app.run(port=8000, debug=True)