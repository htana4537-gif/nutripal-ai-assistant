import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Send, Bot, User, Paperclip, Mic, MicOff, Loader2, Sparkles, X, Image } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  imageData?: string;
  timestamp: number;
}

const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "مرحباً! أنا مساعدك الذكي للتغذية والصحة 🌿\n\nيمكنني مساعدتك في:\n• تحليل الوجبات والسعرات الحرارية\n• إنشاء خطط غذائية مخصصة\n• الإجابة على أسئلتك الغذائية\n• تحليل صور الطعام\n\nكيف يمكنني مساعدتك اليوم؟",
      timestamp: Date.now(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [attachedImage, setAttachedImage] = useState<{ mimeType: string; data: string } | null>(null);
  const [attachedImagePreview, setAttachedImagePreview] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) navigate("/login");
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if ((!inputText.trim() && !attachedImage) || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: inputText,
      imageData: attachedImagePreview || undefined,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentInput = inputText;
    const currentImage = attachedImage;
    setInputText("");
    setAttachedImage(null);
    setAttachedImagePreview(null);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("ai-chat", {
        body: {
          messages: messages.slice(-10).map((m) => ({ role: m.role, text: m.text })),
          userMessage: currentInput,
          imageData: currentImage,
        },
      });

      if (error) throw error;

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: data?.text || "عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      toast({ title: "خطأ", description: "فشل في إرسال الرسالة", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "خطأ", description: "يرجى اختيار صورة فقط", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setAttachedImagePreview(result);
      setAttachedImage({ mimeType: file.type, data: result.split(",")[1] });
    };
    reader.readAsDataURL(file);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        toast({ title: "تسجيل صوتي", description: "تم إيقاف التسجيل. ميزة النص الصوتي قريباً!" });
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      toast({ title: "خطأ", description: "لا يمكن الوصول إلى الميكروفون", variant: "destructive" });
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const formatText = (text: string) => {
    return text.split("\n").map((line, i) => (
      <span key={i}>
        {line}
        {i < text.split("\n").length - 1 && <br />}
      </span>
    ));
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-screen p-6 gap-4">
        {/* Header */}
        <div className="glass-card p-5 flex items-center gap-4 shrink-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary glow-green">
            <Sparkles className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold gradient-text">المساعد الذكي</h1>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
              متصل ويعمل
            </p>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 px-1">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar */}
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                  msg.role === "assistant"
                    ? "bg-gradient-primary glow-green"
                    : "bg-gradient-secondary"
                }`}
              >
                {msg.role === "assistant" ? (
                  <Bot className="h-4 w-4 text-primary-foreground" />
                ) : (
                  <User className="h-4 w-4 text-secondary-foreground" />
                )}
              </div>

              {/* Bubble */}
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "glass bg-primary/20 border-primary/30 text-foreground"
                    : "glass border-border/30 text-foreground"
                }`}
              >
                {msg.imageData && (
                  <img
                    src={msg.imageData}
                    alt="مرفق"
                    className="mb-2 max-w-full rounded-xl max-h-48 object-cover"
                  />
                )}
                <p>{formatText(msg.text)}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {new Date(msg.timestamp).toLocaleTimeString("ar", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-primary">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="glass rounded-2xl px-4 py-3 border-border/30 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">يفكر...</span>
              </div>
            </div>
          )}
        </div>

        {/* Image preview */}
        {attachedImagePreview && (
          <div className="glass-card p-3 flex items-center gap-3 shrink-0">
            <Image className="h-4 w-4 text-primary" />
            <img src={attachedImagePreview} alt="preview" className="h-12 w-12 rounded-lg object-cover" />
            <span className="text-sm text-muted-foreground flex-1">صورة مرفقة</span>
            <button
              onClick={() => { setAttachedImage(null); setAttachedImagePreview(null); }}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Input */}
        <div className="glass-card p-3 flex items-center gap-3 shrink-0">
          <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleFileChange} />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex h-10 w-10 items-center justify-center rounded-xl glass text-muted-foreground hover:text-primary transition-colors"
          >
            <Paperclip className="h-4 w-4" />
          </button>

          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`flex h-10 w-10 items-center justify-center rounded-xl glass transition-colors ${
              isRecording ? "text-destructive animate-pulse" : "text-muted-foreground hover:text-primary"
            }`}
          >
            {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </button>

          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="اكتب رسالتك هنا... أو أرسل صورة طعام"
            className="flex-1 glass border-border/50 bg-muted/20 rounded-xl h-11"
            dir="rtl"
          />

          <Button
            onClick={handleSend}
            disabled={isLoading || (!inputText.trim() && !attachedImage)}
            className="h-11 w-11 p-0 bg-gradient-primary rounded-xl btn-hover-lift glow-green"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AIChat;
