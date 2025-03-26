import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Send, Loader2 } from 'lucide-react';

function App() {
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<Array<{ text: string; sender: 'user' | 'bot' }>>([]);
  const [status, setStatus] = useState('Ready');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const recognition = useRef<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognition.current = new (window as any).webkitSpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      recognition.current.lang = 'en-US';

      recognition.current.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleNewMessage(transcript, 'user');
        await processMessage(transcript);
      };

      recognition.current.onerror = (event: any) => {
        setStatus(`Error: ${event.error}`);
        setIsListening(false);
      };
    }
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleNewMessage = (text: string, sender: 'user' | 'bot') => {
    setMessages(prev => [...prev, { text, sender }]);
  };

  const processMessage = async (text: string) => {
    try {
      setStatus('Processing...');
      
      try {
        const response = await fetch('https://ebaf-106-219-84-183.ngrok-free.app/ask', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Origin': window.location.origin,
          },
          mode: 'cors',
          credentials: 'omit',
          body: JSON.stringify({ 
            question: text 
          })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        handleNewMessage(data.response, 'bot');

        setTimeout(() => {
          if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(data.response);
            utterance.rate = 1;
            utterance.pitch = 1;
            window.speechSynthesis.speak(utterance);
          }
        }, 100);
      } catch (error) {
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
          handleNewMessage("Cannot connect to the server. Please check your internet connection and try again.", 'bot');
        } else {
          handleNewMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`, 'bot');
        }
        console.error('API Error:', error);
      }
    } finally {
      setStatus('Ready');
      setIsListening(false);
    }
  };

  const toggleListening = async () => {
    if (!isListening) {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setIsListening(true);
        setStatus('Listening...');
        recognition.current.start();
      } catch (err) {
        setStatus("Microphone access denied. Please enable permissions.");
      }
    } else {
      setIsListening(false);
      recognition.current.stop();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-black text-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-purple-950/50 rounded-2xl shadow-xl backdrop-blur-sm border border-purple-800/30 p-6">
          {/* Centered Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent inline-block">
              AI Interview Bot
            </h1>
            <div className="text-sm text-purple-300 mt-2">
              {status === 'Listening...' ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {status}
                </span>
              ) : (
                status
              )}
            </div>
          </div>

          {/* Chat Container */}
          <div 
            ref={chatContainerRef}
            className="h-[500px] overflow-y-auto mb-6 space-y-4 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-transparent"
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.sender === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-purple-800/40 border border-purple-700/50'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="flex justify-center">
            <button
              onClick={toggleListening}
              className={`
                p-4 rounded-full transition-all duration-300 
                ${isListening 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-purple-600 hover:bg-purple-700'
                }
                shadow-lg hover:shadow-purple-500/20
                flex items-center justify-center
              `}
            >
              {isListening ? (
                <MicOff className="w-6 h-6" />
              ) : (
                <Mic className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;