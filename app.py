from flask import Flask, request, jsonify
from flask_cors import CORS
import pyttsx3
import json
import re
import threading

app = Flask(__name__)
CORS(app, resources={
    r"/ask": {
        "origins": ["http://localhost:5173"],
        "methods": ["POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Initialize TTS
engine = pyttsx3.init()
engine.setProperty('rate', 150)

# Load and process responses
with open('responses.json') as f:
    RESPONSES = json.load(f)

def resolve_aliases():
    """Resolve all nested aliases with debugging"""
    resolved = RESPONSES.copy()
    for key in list(resolved.keys()):  # Iterate copy to modify original
        while isinstance(resolved[key], str) and resolved[key].startswith('{{') and resolved[key].endswith('}}'):
            ref_key = resolved[key][2:-2].strip()
            if ref_key not in resolved:
                print(f"⚠️ Missing alias target: {ref_key}")
                resolved[key] = RESPONSES["fallback"]
                break
            resolved[key] = resolved[ref_key]
    return resolved

RESPONSES = resolve_aliases()

PATTERNS = {
    'computer vision': ['cv', 'vision', 'image', 'medical', 'yolo', 'detection'],
    'llm experience': ['nlp', 'prompt', 'gpt', 'claude', 'rag', 'langchain'],
    'fullstack projects': ['streamlit', 'flask', 'pyspark', 'etl']
}

def analyze_question(question):
    question = question.lower().strip()
    clean_question = re.sub(r'[^\w\s-]', '', question)
    clean_question = clean_question.replace('-', ' ')
    words = set(clean_question.split())
    return words

def find_best_match(question_words):
    best_score = 0
    best_key = None
    
    for key in RESPONSES:
        if key == 'fallback':
            continue
            
        # Score calculation
        key_words = analyze_question(key)
        score = len(question_words & key_words) * 2
        
        # Pattern matches
        for pattern_key, patterns in PATTERNS.items():
            if any(p in question_words for p in patterns):
                score += 3 * len(patterns)
        
        # Full phrase bonus
        if key in ' '.join(question_words):
            score += 5
            
        # Debug print
        print(f"🔍 {key}: {score}")
            
        if score > best_score:
            best_score = score
            best_key = key
            
    return best_key if best_score >= 2 else None

@app.route('/ask', methods=['POST', 'OPTIONS'])
def handle_question():
    if request.method == 'OPTIONS':
        return '', 200
        
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data received"}), 400
            
        question = data.get('question', '')
        print(f"📥 Received question: {question}")
        
        if not question:
            return jsonify({"response": RESPONSES["fallback"]}), 400
            
        question_words = analyze_question(question)
        print(f"🔎 Analyzing words: {question_words}")
        
        best_key = find_best_match(question_words) or 'fallback'
        print(f"🎯 Best match: {best_key}")
        
        return jsonify({
            "response": RESPONSES[best_key],
            "matched_key": best_key,
            "words": list(question_words)
        })
        
    except Exception as e:
        print(f"🔥 Error: {str(e)}")
        return jsonify({
            "error": "Internal server error",
            "message": str(e)
        }), 500

@app.route('/debug/responses')
def debug_responses():
    return jsonify(RESPONSES)

@app.route('/debug/patterns')
def debug_patterns():
    return jsonify(PATTERNS)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)