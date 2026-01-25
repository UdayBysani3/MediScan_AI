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

# 2. DEEP LEARNING MODEL SETUP - LAZY LOADING
# Store loaded models in memory cache
LOADED_MODELS = {}

# Model paths (don't load yet - save memory!)
MODEL_PATHS = {
    'diabetic-retinopathy': 'models/diabeticRetinopathy.keras',
    'skin-disease': 'models/skinDisease.keras',
    'brain-tumor': 'models/brainTumor.keras'
}

def get_model(model_id):
    """Load model on-demand to save memory"""
    if model_id not in LOADED_MODELS:
        print(f"🔄 Loading model: {model_id}")
        try:
            LOADED_MODELS[model_id] = tf.keras.models.load_model(MODEL_PATHS[model_id])
            print(f"✅ Model loaded: {model_id}")
        except Exception as e:
            print(f"❌ Error loading {model_id}: {e}")
            return None
    return LOADED_MODELS[model_id]

print("✅ AI server ready - models will load on-demand")

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

    if model_id not in MODEL_PATHS:
        return jsonify({"error": f"Invalid model ID: {model_id}"}), 400

    try:
        # Load model on-demand (lazy loading)
        model = get_model(model_id)
        if model is None:
            return jsonify({"error": "Failed to load AI model"}), 500
        
        image_bytes = file.read()
        processed_image = preprocess_image(image_bytes)

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
    # Get port from environment variable for cloud deployment (Render, Heroku, etc.)
    # port = int(os.environ.get("PORT", 8000))
    # Use 0.0.0.0 to allow external connections, disable debug in production
    # app.run(host="0.0.0.0", port=port, debug=False)