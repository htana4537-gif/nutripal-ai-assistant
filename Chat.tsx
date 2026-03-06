import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../context/Store';
import { sendMessageToGemini } from '../services/geminiService';
import { Message, Attachment } from '../types';

export const Chat = () => {
  const { user, messages, addMessage, setLoading, isLoading, t } = useAppStore();
  const [inputText, setInputText] = useState('');
  const [attachment, setAttachment] = useState<Attachment | undefined>(undefined);
  const [isRecording, setIsRecording] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, attachment]);

  const handleSend = async () => {
    if ((!inputText.trim() && !attachment) || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      attachment: attachment,
      timestamp: Date.now()
    };

    addMessage(userMsg);
    setInputText('');
    setAttachment(undefined);
    setLoading(true);

    const responseText = await sendMessageToGemini(messages, inputText, user, attachment);

    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: Date.now()
    };

    addMessage(botMsg);
    setLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = (reader.result as string).split(',')[1];
        setAttachment({
            mimeType: file.type,
            data: base64Data
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const startRecording = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                audioChunksRef.current.push(event.data);
            }
        };

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);
            reader.onloadend = () => {
                const base64Data = (reader.result as string).split(',')[1];
                setAttachment({
                    mimeType: 'audio/mp3',
                    data: base64Data
                });
            };
            stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
    } catch (error) {
        console.error("Error accessing microphone:", error);
        alert("Could not access microphone.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
    }
  };

  return (
    <div className="flex flex-col h-full relative z-10 pb-24 bg-[#F0F4F8]">
      {/* Glass Header */}
      <div className="px-6 py-5 flex justify-between items-center sticky top-0 z-20 border-b"
           style={{
             background: 'rgba(255, 255, 255, 0.65)',
             backdropFilter: 'blur(24px) saturate(180%)',
             border: '1.5px solid rgba(255, 255, 255, 0.9)',
             boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)'
           }}>
        <div>
            <h2 className="text-xl font-bold text-[#1A202C] tracking-tight">{t('coach')}</h2>
            <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-[#4ECDC4] animate-pulse shadow-sm"></span>
                <p className="text-[10px] text-[#4ECDC4] font-semibold uppercase tracking-wider">{t('online_proactive')}</p>
            </div>
        </div>
        <div className="px-4 py-2 rounded-full text-[10px] font-semibold text-[#4ECDC4] border border-[#4ECDC4]/30"
             style={{
               background: 'rgba(78, 205, 196, 0.08)',
               backdropFilter: 'blur(12px)'
             }}>
          Gemini 2.5
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <div className="w-24 h-24 rounded-full flex items-center justify-center mb-5 border animate-float"
                 style={{
                   background: 'linear-gradient(135deg, rgba(78, 205, 196, 0.15), rgba(160, 108, 213, 0.15))',
                   backdropFilter: 'blur(16px)',
                   border: '1.5px solid rgba(255, 255, 255, 0.9)',
                   boxShadow: '0 8px 32px 0 rgba(78, 205, 196, 0.2)'
                 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#4ECDC4]"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
            </div>
            <p className="text-center px-6 font-normal text-sm text-[#1A202C]/60">{t('log_meal_desc')}</p>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[82%] rounded-3xl p-5 transition-all hover:scale-[1.01]`}
                 style={msg.role === 'user' ? {
                   background: 'linear-gradient(135deg, #FF6B6B, #FF8E8E)',
                   color: 'white',
                   border: '1.5px solid rgba(255, 255, 255, 0.3)',
                   boxShadow: '0 8px 32px 0 rgba(255, 107, 107, 0.25)',
                   borderTopRightRadius: '8px'
                 } : {
                   background: 'rgba(255, 255, 255, 0.75)',
                   backdropFilter: 'blur(24px) saturate(180%)',
                   border: '1.5px solid rgba(255, 255, 255, 0.9)',
                   boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
                   color: '#1A202C',
                   borderTopLeftRadius: '8px'
                 }}>
              {msg.attachment && (
                <div className="mb-3">
                    {msg.attachment.mimeType.startsWith('image/') ? (
                        <img src={`data:${msg.attachment.mimeType};base64,${msg.attachment.data}`} alt="Upload" className="w-full h-auto rounded-2xl max-h-60 object-cover border border-white/30 shadow-sm" />
                    ) : (
                         <div className="flex items-center gap-3 p-3 rounded-2xl"
                              style={{
                                background: 'rgba(255, 255, 255, 0.25)',
                                backdropFilter: 'blur(12px)',
                                border: '1px solid rgba(255, 255, 255, 0.4)'
                              }}>
                            <div className="p-2 bg-white/30 rounded-xl backdrop-blur-sm">
                                {msg.attachment.mimeType.startsWith('audio/') ? 
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg> :
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                                }
                            </div>
                            <span className="text-xs font-medium opacity-90">{msg.attachment.mimeType.split('/')[0]} attachment</span>
                         </div>
                    )}
                </div>
              )}
              <p className="whitespace-pre-wrap text-sm leading-relaxed font-normal">{msg.text}</p>
            </div>
          </div>
        ))}
        
        {isLoading && (
           <div className="flex justify-start">
             <div className="rounded-3xl rounded-tl-sm p-5 flex items-center gap-2"
                  style={{
                    background: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    border: '1.5px solid rgba(255, 255, 255, 0.9)',
                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)'
                  }}>
               <div className="w-2 h-2 bg-[#4ECDC4] rounded-full animate-bounce"></div>
               <div className="w-2 h-2 bg-[#4ECDC4] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
               <div className="w-2 h-2 bg-[#4ECDC4] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
             </div>
           </div>
        )}
      </div>

      {/* Floating Glass Input Area */}
      <div className="p-4 relative">
        <div className="p-2 rounded-[2rem] flex items-end gap-2"
             style={{
               background: 'rgba(255, 255, 255, 0.75)',
               backdropFilter: 'blur(24px) saturate(180%)',
               border: '1.5px solid rgba(255, 255, 255, 0.9)',
               boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.12)'
             }}>
            {attachment && (
                <div className="absolute -top-24 left-4 rounded-2xl p-2 shadow-xl animate-fade-in"
                     style={{
                       background: 'rgba(255, 255, 255, 0.85)',
                       backdropFilter: 'blur(24px) saturate(180%)',
                       border: '1.5px solid rgba(78, 205, 196, 0.5)',
                       boxShadow: '0 8px 32px 0 rgba(78, 205, 196, 0.2)'
                     }}>
                    {attachment.mimeType.startsWith('image/') ? (
                        <img src={`data:${attachment.mimeType};base64,${attachment.data}`} alt="Preview" className="h-16 w-auto rounded-xl" />
                    ) : (
                        <div className="h-16 w-24 flex items-center justify-center bg-[#4ECDC4]/10 rounded-xl text-xs text-[#4ECDC4] border border-[#4ECDC4]/30 font-semibold">Attached</div>
                    )}
                    <button onClick={() => setAttachment(undefined)} className="absolute -top-2 -right-2 bg-[#FF6B6B] text-white rounded-full p-1.5 shadow-md hover:bg-[#ff5555] transition"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
                </div>
            )}
            
            <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-3 rounded-full transition-all"
                style={{
                  background: 'rgba(255, 255, 255, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                  color: '#1A202C'
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
            </button>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*,audio/*,application/pdf,text/plain" onChange={handleFileChange} />
            
            <button 
                onClick={isRecording ? stopRecording : startRecording}
                className={`p-3 rounded-full transition-all duration-300`}
                style={isRecording ? {
                  background: 'rgba(255, 107, 107, 0.15)',
                  border: '1.5px solid #FF6B6B',
                  color: '#FF6B6B',
                  boxShadow: '0 0 20px rgba(255, 107, 107, 0.3)'
                } : {
                  background: 'rgba(255, 255, 255, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                  color: '#1A202C'
                }}
            >
                {isRecording ? (
                    <div className="flex gap-0.5 items-end h-5">
                         <div className="w-1 bg-[#FF6B6B] animate-[bounce_0.8s_infinite] h-2"></div>
                         <div className="w-1 bg-[#FF6B6B] animate-[bounce_1.2s_infinite] h-4"></div>
                         <div className="w-1 bg-[#FF6B6B] animate-[bounce_0.5s_infinite] h-3"></div>
                         <div className="w-1 bg-[#FF6B6B] animate-[bounce_1s_infinite] h-5"></div>
                    </div>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
                )}
            </button>

            <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder={isRecording ? t('recording') : t('type_message')}
                className="flex-1 bg-transparent text-[#1A202C] p-3 max-h-32 focus:outline-none resize-none text-sm placeholder-[#1A202C]/40"
                rows={1}
                disabled={isRecording}
            />
            
            <button 
                onClick={handleSend}
                disabled={isLoading || (!inputText && !attachment)}
                className="p-3 text-white rounded-full transition-all transform active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg, #4ECDC4, #2AA198)',
                  boxShadow: '0 4px 20px rgba(78, 205, 196, 0.35)'
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
        </div>
      </div>
    </div>
  );
};