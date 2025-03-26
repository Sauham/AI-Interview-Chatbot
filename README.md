# AI Interview Voice Chatbot

A voice-based AI interview chatbot built using **React (Vite) + Flask** that answers behavioral questions using predefined responses and OpenAI's APIs. The bot supports **speech-to-text** conversion, **text processing**, and **text-to-speech** output.

---

## 🚀 Features
- **Voice Input & Output** 🎤🔊
- **Speech Recognition** using Web Speech API
- **Flask Backend API** for response generation
- **Predefined Behavioral Responses** from `responses.json`
- **CORS Handling for Frontend-Backend Communication**
- **Styled with Tailwind CSS** ✨
- **Fast Deployment via Ngrok & Vercel**

---

## 🌐 Live Deployment
You can check out the deployed versions here:
- **Frontend (Netlify):** [AI Interview Chatbot](https://incandescent-sunshine-a91e70.netlify.app/)
- **Backend (Railway):** [Flask API](https://ai-interview-chatbot-production.up.railway.app/)

---

## 📂 Project Structure
```
AI-Interview-Chatbot/
│── backend/
│   ├── app.py          # Flask API handling questions & responses
│   ├── responses.json  # Predefined chatbot responses
│   ├── requirements.txt  # Backend dependencies
│── frontend/
│   ├── src/
│   │   ├── App.tsx     # React app with voice & chat UI
│   │   ├── main.tsx    # React main entry point
│   │   ├── index.css   # Tailwind CSS styles
│   ├── index.html      # Root HTML file
│── package.json        # Frontend dependencies
│── README.md           # Project documentation
```

---

## 🛠️ Setup & Installation

### **1️⃣ Clone the Repository**
```bash
git clone https://github.com/Sauham/AI-Interview-Chatbot.git
cd AI-Interview-Chatbot
```

### **2️⃣ Backend Setup** (Flask)
```bash
cd backend
pip install -r requirements.txt
python app.py
```
Your backend will run on `http://127.0.0.1:5000`.

### **3️⃣ Frontend Setup** (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
Your frontend will run on `http://localhost:5173`.

---

## 🌍 Deploying with Ngrok (For External Access)
1. **Install Ngrok** ([Download here](https://ngrok.com/download))
2. Start Ngrok:
   ```bash
   ngrok http 5000
   ```
3. Use the generated **public URL** in `App.tsx` for API calls.

---

## 🚀 Usage
1. **Start the Backend & Frontend**
2. Click the 🎤 **Mic Button** to start speaking.
3. The bot will **transcribe, analyze, and respond** to your question.
4. **Speech output** will be played using Text-to-Speech.

---

## 🤖 API Endpoints
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | `/ask` | Accepts a JSON request `{ "question": "your question" }` and returns a response |
| GET | `/debug/responses` | Returns all predefined responses |
| GET | `/debug/patterns` | Returns all keyword matching patterns |

---

## 🛑 Troubleshooting
**"Failed to fetch" error?**
- Make sure **Flask backend is running** before launching the frontend.
- Use `127.0.0.1:5000` instead of `localhost` in API calls.

**Ngrok not recognized?**
- Install it and add to **system PATH** (`setx PATH "%PATH%;C:\ngrok"`).

---

## 🎯 Future Enhancements
- Integrate **OpenAI GPT API** for dynamic responses 🤖
- Add **database storage** for user conversations 📂
- Improve **speech-to-text accuracy** 🎙️

---

## 👨‍💻 Author
**Sauham Vyas**
- 🔗 [GitHub](https://github.com/Sauham)
- 📧 Contact: [Email](mailto:your.email@example.com)

---

## ⭐ Contribute
Pull requests are welcome! Fork the repo, create a feature branch, and submit a PR.

```bash
git checkout -b feature-branch
git push origin feature-branch
```

---

## 📜 License
MIT License © 2025 Sauham Vyas

