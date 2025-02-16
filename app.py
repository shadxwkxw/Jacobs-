from flask import Flask, request, jsonify
import torch
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification, pipeline, DistilBertConfig
import os
from flask_cors import CORS
import sqlite3
from datetime import datetime

app = Flask(__name__)
CORS(app)

def init_db():
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT NOT NULL,
            request_type TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

init_db()

MODEL_PATH = "best_model.pth"
MODEL_NAME = "distilbert-base-uncased"
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

tokenizer = DistilBertTokenizer.from_pretrained(MODEL_NAME)

# Модель с загрузкой конфигурации и весов
model = DistilBertForSequenceClassification.from_pretrained(
    MODEL_NAME, 
    config=DistilBertConfig.from_pretrained(".")  # Грузим ваш config.json
)
model.load_state_dict(
    torch.load(MODEL_PATH, map_location=device),  # Загрузка весов
    strict=False  # Игнорируем несовпадения слоев
)
model.to(device)
model.eval()

GENERATOR_MODEL_NAME = 'sberbank-ai/rugpt3large_based_on_gpt2'
generator = pipeline(
    'text-generation',
    model=GENERATOR_MODEL_NAME,
    tokenizer=GENERATOR_MODEL_NAME,
    device=0 if device.type == 'cuda' else -1
)

def predict(text):
    encoding = tokenizer.encode_plus(
        text,
        add_special_tokens=True,
        max_length=128,
        padding='max_length',
        truncation=True,
        return_tensors='pt',
    )

    input_ids = encoding['input_ids'].to(device)
    attention_mask = encoding['attention_mask'].to(device)

    with torch.no_grad():
        outputs = model(input_ids, attention_mask=attention_mask)
        logits = outputs.logits
        prediction = torch.argmax(logits, dim=1).item()

    return prediction

def generate_response(text):
    """Генерация ответа от LLM-модели"""
    try:
        response = generator(text, max_length=40, num_beams=5, temperature=0.3, repetition_penalty=1.2, no_repeat_ngram_size=3)
        return response[0]['generated_text']
    except Exception as e:
        return f"Ошибка генерации ответа: {str(e)}"

@app.route("/api/predict", methods=["POST"])
def api_predict():
    data = request.json
    text = data.get("text", "")

    if not text:
        return jsonify({"error": "No text provided"}), 400

    prediction = predict(text)
    request_type = "Заблокировано" if prediction == 1 else "Принято"

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute("INSERT INTO requests (text, request_type, created_at) VALUES (?, ?, ?)",
                   (text, request_type, datetime.now()))
    conn.commit()
    conn.close()

    if prediction == 1:
        return jsonify({
            "prediction": prediction,
            "message": "Ошибка: Вы пытаетесь отправить конфиденциальную информацию. Пожалуйста, используйте защищенные каналы для передачи персональных данных."
        })
    else:
        response = generate_response(text)
        return jsonify({
            "prediction": prediction,
            "message": response
        })

@app.route("/api/blocks", methods=["GET"])
def get_blocks():
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute("SELECT id, text, request_type, created_at FROM requests")
    rows = cursor.fetchall()
    conn.close()

    blocks = [{
        "id": row[0],
        "text": row[1],
        "rightText2": row[2],
        "createdAt": row[3]
    } for row in rows]

    return jsonify(blocks)

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', use_reloader=False)
