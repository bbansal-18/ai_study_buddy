from flask import Flask
from routes.chatbot import chatbot_bp
from routes.topics import topics_bp
from routes.safety import safety_bp

app = Flask(__name__)

app.register_blueprint(chatbot_bp, url_prefix="/ask")
app.register_blueprint(topics_bp, url_prefix="/topics")
app.register_blueprint(safety_bp, url_prefix="/check-safety")

@app.route('/')
def home():
    return "AI Study Buddy API is live!"

if __name__ == '__main__':
    app.run(debug=True)
