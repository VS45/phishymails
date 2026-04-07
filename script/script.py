import sys
import json
import joblib
import numpy as np

# Load the phishing email model and vectorizer
try:
    model_nn = joblib.load('./ann_model.pkl')
    vectorizer = joblib.load('./vectorizer.pkl')
except Exception as e:
    raise Exception("Error loading models: {str(e)}")

# Check if any argument is passed
if len(sys.argv) < 2:
    raise ValueError("No text provided for analysis")

# Load the text from the command line argument
try:
    text_input = sys.argv[1]
    # If the input is a JSON string, parse it
    try:
        data = json.loads(text_input)
        # Handle both direct text and JSON object with 'text' field
        if isinstance(data, dict) and 'text' in data:
            text_input = data['text']
        elif isinstance(data, str):
            text_input = data
    except json.JSONDecodeError:
        # If not JSON, use the raw string as text
        pass
    
    # Ensure text_input is a string
    if not isinstance(text_input, str):
        text_input = str(text_input)
        
except Exception as e:
    raise ValueError(f"Error processing input: {str(e)}")

# Transform the text using the vectorizer
try:
    # Vectorizer expects a list of texts
    text_vectorized = vectorizer.transform([text_input])
    
    # Check if the vectorizer returns a sparse matrix or dense array
    if hasattr(text_vectorized, 'toarray'):
        text_vectorized = text_vectorized.toarray()
    else:
        text_vectorized = np.array(text_vectorized)
        
except Exception as e:
    raise ValueError(f"Error vectorizing text: {str(e)}")

# Make prediction using the neural network model
try:
    # The model might expect different input shapes
    # For binary classification, we get probability or prediction
    if hasattr(model_nn, 'predict_proba'):
        prediction_proba = model_nn.predict_proba(text_vectorized)
        prediction_class = (prediction_proba[:, 1] > 0.5).astype(int)
        confidence = float(prediction_proba[0][1])  # Probability of being phishing
    else:
        prediction_class = model_nn.predict(text_vectorized)
        confidence = None
except Exception as e:
    raise ValueError(f"Error making prediction: {str(e)}")

# Prepare the result
result = {
    'is_phishing': int(prediction_class[0]) if hasattr(prediction_class, '__getitem__') else int(prediction_class),
    'text_analyzed': text_input[:100] + '...' if len(text_input) > 100 else text_input  # Truncate for response
}

# Add confidence if available
if confidence is not None:
    result['confidence'] = confidence

print(json.dumps(result))