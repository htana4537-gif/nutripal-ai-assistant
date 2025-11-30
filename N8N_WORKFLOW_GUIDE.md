# Building an Intelligent Nutrition Assistant with n8n, Telegram, and Supabase

This guide will walk you through creating a comprehensive n8n workflow that powers an intelligent nutrition assistant integrated with Telegram and a Supabase database.

## 🚀 Quick Start - Import Ready Workflow

We've created a complete, ready-to-import n8n workflow JSON file that you can use immediately!

### How to Import:

1. **Download the workflow file**: `n8n-nutrition-workflow.json` (in the project root)

2. **Open your n8n instance** and go to the Workflows page

3. **Click "Import from File"** button (top right)

4. **Select** the `n8n-nutrition-workflow.json` file

5. **Configure credentials** (see below)

### Required Credentials Setup:

After importing, you need to configure these credentials in n8n:

#### 1. Telegram Bot API
- **Name**: `Telegram Bot API`
- **Token**: Your Telegram Bot Token from [@BotFather](https://t.me/botfather)
- How to get: Message @BotFather → `/newbot` → Follow instructions

#### 2. Supabase API
- **Name**: `Supabase API`
- **Host**: Your Supabase URL (format: `https://your-project.supabase.co`)
- **Service Role Key**: Your Supabase service role key (found in project settings)

#### 3. Supabase Auth Header
- **Name**: `Supabase Auth Header`
- **Header Name**: `Authorization`
- **Header Value**: `Bearer YOUR_SUPABASE_ANON_KEY`

### Environment Variables:

Make sure to set this environment variable in n8n:
```
SUPABASE_URL=https://your-project.supabase.co
```

### ✅ What's Included:

The imported workflow includes:
- ✅ Telegram message trigger
- ✅ User management (new user creation)
- ✅ Conversation tracking
- ✅ Message routing (text/image/voice)
- ✅ AI processing via Lovable AI Edge Functions
- ✅ Response saving to database
- ✅ Daily check-in cron job

### 📡 Edge Functions:

The workflow calls these Edge Functions (already created in your Lovable project):
- `process-nutrition-text` - Handles text-based nutrition questions
- `analyze-food-image` - Analyzes food photos for calorie counting
- `process-voice` - Processes voice messages
- `generate-meal-plan` - Creates personalized meal plans
- `daily-checkin` - Sends daily motivational messages

These functions are deployed automatically and use **Lovable AI** (no API keys needed)!

---

## نظرة عامة
هذا الدليل يشرح كيفية بناء workflow في n8n ليكون بمثابة مساعد ذكي للتغذية متكامل مع Telegram والذي يتكامل مع قاعدة البيانات الخاصة بك.

## المتطلبات الأساسية

### 1. حساب n8n
- قم بإنشاء حساب على [n8n.io](https://n8n.io)
- أو قم بتثبيت n8n محلياً

### 2. API Keys المطلوبة
- **Telegram Bot Token**: احصل عليه من [@BotFather](https://t.me/botfather)
- **Lovable AI API Key**: متوفر تلقائياً في قاعدة البيانات (LOVABLE_API_KEY)
- **Supabase Keys**: 
  - URL: موجود في settings الخاص بك
  - Service Role Key: للوصول الكامل للقاعدة

### 3. إعدادات Telegram Bot
قم بإنشاء بوت جديد عبر @BotFather:
```
/newbot
اسم البوت: مساعد التغذية الذكي
username: nutrition_ai_bot (اختر اسم فريد)
```

احفظ الـ Token الذي سيرسله لك BotFather.

## هيكل الـ Workflow

### Node 1: Telegram Trigger
**الغرض**: استقبال الرسائل من Telegram

**الإعدادات**:
- Node Type: `Telegram Trigger`
- Updates: `message`, `photo`, `voice`, `document`
- Bot Token: [أدخل الـ Token من BotFather]

**Output**: سيحتوي على:
- `message.text` - النص
- `message.photo` - الصور
- `message.voice` - الملفات الصوتية
- `message.from.id` - Telegram ID للمستخدم
- `message.from.first_name` - اسم المستخدم

---

### Node 2: Check User Exists in Database
**الغرض**: التحقق من وجود المستخدم في قاعدة البيانات

**الإعدادات**:
- Node Type: `Supabase`
- Operation: `Select`
- Table: `clients`
- Filter: `telegram_id` equals `{{ $json["message"]["from"]["id"] }}`

**الخطوة التالية**:
- IF User Found → اذهب إلى Node 4
- IF User NOT Found → اذهب إلى Node 3

---

### Node 3: Create New User
**الغرض**: إنشاء سجل جديد للمستخدم

**الإعدادات**:
- Node Type: `Supabase`
- Operation: `Insert`
- Table: `clients`
- Data:
```json
{
  "telegram_id": "{{ $json['message']['from']['id'] }}",
  "full_name": "{{ $json['message']['from']['first_name'] }} {{ $json['message']['from']['last_name'] }}",
  "status": "active"
}
```

**رسالة ترحيب**:
```javascript
أهلاً بك في مساعد التغذية الذكي! 👋

أنا هنا لمساعدتك في تحقيق أهدافك الصحية. يمكنني:

✅ حساب السعرات الحرارية من الصور والنصوص
✅ إنشاء خطط غذائية مخصصة
✅ تصميم جداول تمارين رياضية
✅ متابعة تقدمك اليومي
✅ تقديم نصائح تغذوية مهنية

لنبدأ! أخبرني عن نفسك:
- كم عمرك؟
- ما هو وزنك الحالي؟
- ما هو وزنك المستهدف؟
- ما هو مستوى نشاطك؟ (خامل، خفيف، متوسط، نشط، نشط جداً)
```

---

### Node 4: Create/Update Conversation
**الغرض**: تسجيل المحادثة

**الإعدادات**:
- Node Type: `Supabase`
- Operation: `Upsert` (Insert or Update)
- Table: `conversations`
- Data:
```json
{
  "client_id": "{{ $node['Check User Exists in Database'].json['id'] }}",
  "platform": "telegram",
  "last_message_at": "{{ $now }}"
}
```

---

### Node 5: Save Message to Database
**الغرض**: حفظ الرسالة في قاعدة البيانات

**الإعدادات**:
- Node Type: `Supabase`
- Operation: `Insert`
- Table: `messages`

**الكود**:
```javascript
// تحديد نوع الرسالة
let messageType = 'text';
let content = '';
let metadata = {};

if ($json.message.text) {
  messageType = 'text';
  content = $json.message.text;
} else if ($json.message.photo) {
  messageType = 'image';
  content = 'صورة';
  metadata = { file_id: $json.message.photo[0].file_id };
} else if ($json.message.voice) {
  messageType = 'voice';
  content = 'رسالة صوتية';
  metadata = { file_id: $json.message.voice.file_id };
}

return {
  conversation_id: $node['Create/Update Conversation'].json.id,
  sender_type: 'client',
  message_type: messageType,
  content: content,
  metadata: metadata
};
```

---

### Node 6: Process Message Type (Switch)
**الغرض**: توجيه الرسالة حسب نوعها

**الإعدادات**:
- Node Type: `Switch`
- Mode: `Rules`

**القواعد**:
1. IF `message.text` exists → Route to Text Processing
2. IF `message.photo` exists → Route to Image Processing  
3. IF `message.voice` exists → Route to Voice Processing

---

### Node 7: Text Message Processing
**الغرض**: معالجة الرسائل النصية

#### 7a. Get Conversation History
```javascript
// Node Type: Supabase
// Operation: Select
// Table: messages
// Filter: conversation_id = {{ current_conversation_id }}
// Order: created_at DESC
// Limit: 10
```

#### 7b. Call Lovable AI
**الإعدادات**:
- Node Type: `HTTP Request`
- Method: `POST`
- URL: `https://ai.gateway.lovable.dev/v1/chat/completions`
- Headers:
  - `Authorization`: `Bearer {{ $env.LOVABLE_API_KEY }}`
  - `Content-Type`: `application/json`

**Body**:
```json
{
  "model": "google/gemini-2.5-flash",
  "messages": [
    {
      "role": "system",
      "content": "أنت خبير تغذية ومدرب شخصي محترف تتحدث العربية. مهامك:\n\n1. تحليل الطعام وحساب السعرات الحرارية\n2. إنشاء خطط غذائية مخصصة\n3. تصميم جداول تمارين\n4. تقديم نصائح صحية\n5. متابعة التقدم اليومي\n6. تحفيز العملاء\n\nكن ودوداً ومحفزاً وقدم معلومات دقيقة علمياً."
    },
    {
      "role": "user",
      "content": "{{ $json.message.text }}\n\nمعلومات العميل:\nالاسم: {{ $node['Check User Exists in Database'].json.full_name }}\nالوزن: {{ $node['Check User Exists in Database'].json.weight }} كجم\nالوزن المستهدف: {{ $node['Check User Exists in Database'].json.target_weight }} كجم\nالعمر: {{ $node['Check User Exists in Database'].json.age }} سنة"
    }
  ],
  "temperature": 0.7,
  "max_tokens": 1000
}
```

---

### Node 8: Image Processing (Calorie Counter)
**الغرض**: تحليل صور الطعام وحساب السعرات

#### 8a. Get Image from Telegram
```javascript
// Node Type: HTTP Request
// Method: GET
// URL: https://api.telegram.org/bot{{ $env.TELEGRAM_BOT_TOKEN }}/getFile?file_id={{ $json.message.photo[0].file_id }}

// ثم احصل على الملف:
// URL: https://api.telegram.org/file/bot{{ $env.TELEGRAM_BOT_TOKEN }}/{{ file_path }}
```

#### 8b. Analyze Image with AI
**Body**:
```json
{
  "model": "google/gemini-2.5-pro",
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "حلل هذه الصورة وقدم:\n1. قائمة الأطعمة المرئية\n2. تقدير السعرات الحرارية لكل عنصر\n3. إجمالي السعرات\n4. البروتين، الكربوهيدرات، الدهون\n5. نصيحة سريعة عن هذه الوجبة"
        },
        {
          "type": "image_url",
          "image_url": {
            "url": "data:image/jpeg;base64,{{ $binary.data.toString('base64') }}"
          }
        }
      ]
    }
  ]
}
```

---

### Node 9: Voice Processing (Transcription)
**الغرض**: تحويل الرسائل الصوتية إلى نص

#### 9a. Get Voice File
```javascript
// مثل Node 8a لكن مع voice.file_id
```

#### 9b. Transcribe with OpenAI Whisper
**الإعدادات**:
- Node Type: `HTTP Request`
- Method: `POST`
- URL: `https://api.openai.com/v1/audio/transcriptions`
- Headers:
  - `Authorization`: `Bearer {{ $env.OPENAI_API_KEY }}`
- Body Type: `multipart/form-data`
- Fields:
  - `file`: {{ $binary.data }}
  - `model`: `whisper-1`
  - `language`: `ar`

#### 9c. Process Transcribed Text
أرسل النص إلى Node 7b للمعالجة

---

### Node 10: Save AI Response
**الغرض**: حفظ رد المساعد في قاعدة البيانات

**الإعدادات**:
- Node Type: `Supabase`
- Operation: `Insert`
- Table: `messages`
- Data:
```json
{
  "conversation_id": "{{ $node['Create/Update Conversation'].json.id }}",
  "sender_type": "ai",
  "message_type": "text",
  "content": "{{ $json.choices[0].message.content }}"
}
```

---

### Node 11: Send Response to Telegram
**الغرض**: إرسال الرد للمستخدم

**الإعدادات**:
- Node Type: `Telegram`
- Operation: `Send Message`
- Chat ID: `{{ $json.message.chat.id }}`
- Text: `{{ $node['Call Lovable AI'].json.choices[0].message.content }}`
- Parse Mode: `Markdown`

---

### Node 12: Daily Check-in Trigger (Cron)
**الغرض**: التواصل التلقائي اليومي

**الإعدادات**:
- Node Type: `Cron`
- Expression: `0 9 * * *` (كل يوم الساعة 9 صباحاً)

#### 12a. Get Active Clients
```javascript
// Node Type: Supabase
// Table: clients
// Filter: status = 'active'
```

#### 12b. Loop Through Clients
```javascript
// Node Type: Loop Over Items
```

#### 12c. Generate Daily Message
```javascript
// استخدم Lovable AI لإنشاء رسائل متنوعة يومياً:

const messages = [
  "صباح الخير! 🌅 كيف كان نومك؟ هل أنت مستعد ليوم صحي جديد؟",
  "مرحباً! 💪 لا تنسى شرب الماء اليوم. هدفك: 8 أكواب!",
  "🍎 ماذا ستتناول على الإفطار اليوم؟ شاركني صورة!",
  "⚡ حان وقت التمرين! هل أنت جاهز؟",
  "📊 كيف تشعر اليوم؟ شارك تقدمك معي!"
];

// اختر رسالة عشوائية أو استخدم AI لإنشاء رسالة شخصية
```

---

### Node 13: Extract and Save Client Info
**الغرض**: استخراج معلومات العميل من المحادثة

**الإعدادات**:
- Node Type: `Code`
- Language: `JavaScript`

**الكود**:
```javascript
// استخراج البيانات من المحادثة
const text = $json.message.text.toLowerCase();
const clientId = $node['Check User Exists in Database'].json.id;

let updates = {};

// استخراج الوزن
const weightMatch = text.match(/وزني (\d+)|(\d+) كيلو|(\d+) kg/i);
if (weightMatch) {
  updates.weight = parseInt(weightMatch[1] || weightMatch[2] || weightMatch[3]);
}

// استخراج العمر
const ageMatch = text.match(/عمري (\d+)|(\d+) سنة/i);
if (ageMatch) {
  updates.age = parseInt(ageMatch[1] || ageMatch[2]);
}

// استخراج مستوى النشاط
if (text.includes('خامل') || text.includes('sedentary')) {
  updates.activity_level = 'sedentary';
} else if (text.includes('خفيف') || text.includes('light')) {
  updates.activity_level = 'light';
} else if (text.includes('متوسط') || text.includes('moderate')) {
  updates.activity_level = 'moderate';
} else if (text.includes('نشط جدا') || text.includes('very active')) {
  updates.activity_level = 'very_active';
} else if (text.includes('نشط') || text.includes('active')) {
  updates.activity_level = 'active';
}

// حساب السعرات اليومية إذا توفرت البيانات الكافية
if (updates.weight && updates.age && updates.activity_level) {
  const client = $node['Check User Exists in Database'].json;
  const bmr = 10 * updates.weight + 6.25 * client.height - 5 * updates.age + 5; // للرجال
  
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };
  
  updates.daily_calorie_goal = Math.round(bmr * multipliers[updates.activity_level]);
}

// تحديث قاعدة البيانات
if (Object.keys(updates).length > 0) {
  return {
    client_id: clientId,
    updates: updates
  };
}

return null;
```

#### 13a. Update Client Database
```javascript
// Node Type: Supabase
// Operation: Update
// Table: clients
// Filter: id = {{ $json.client_id }}
// Data: {{ $json.updates }}
```

---

### Node 14: Create Meal Plan
**الغرض**: إنشاء خطة غذائية

**متى يُستخدم**: عندما يطلب المستخدم خطة غذائية

**الإعدادات**:
```javascript
// استخدم Lovable AI لإنشاء خطة غذائية:

{
  "model": "google/gemini-2.5-flash",
  "messages": [{
    "role": "system",
    "content": "أنت خبير تغذية. أنشئ خطة غذائية مفصلة بصيغة JSON."
  }, {
    "role": "user",
    "content": "أنشئ خطة غذائية لهذا اليوم:\nالسعرات المستهدفة: {{ $node['Check User Exists in Database'].json.daily_calorie_goal }}\nالتفضيلات: {{ $node['Check User Exists in Database'].json.dietary_preferences }}\nالحساسية: {{ $node['Check User Exists in Database'].json.allergies }}"
  }],
  "tools": [{
    "type": "function",
    "function": {
      "name": "create_meal_plan",
      "parameters": {
        "type": "object",
        "properties": {
          "meals": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "meal_type": { "type": "string", "enum": ["breakfast", "lunch", "dinner", "snack"] },
                "foods": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "name": { "type": "string" },
                      "quantity": { "type": "string" },
                      "calories": { "type": "number" }
                    }
                  }
                },
                "total_calories": { "type": "number" }
              }
            }
          }
        }
      }
    }
  }],
  "tool_choice": {"type": "function", "function": {"name": "create_meal_plan"}}
}
```

#### 14a. Save Meal Plan to Database
```javascript
// حلل الـ response من AI واحفظه في جدول meal_plans
```

---

### Node 15: Feedback Collection
**الغرض**: جمع تقييمات العملاء

**متى يُستخدم**: بعد كل أسبوع أو شهر

**رسالة التقييم**:
```
شكراً لاستخدامك مساعد التغذية! 🙏

نود معرفة رأيك:
1. كيف تقيم الخدمة من 1-5؟ ⭐
2. ما الذي أعجبك؟
3. ما الذي يمكن تحسينه؟

رأيك يهمنا لتقديم أفضل خدمة! 💚
```

#### 15a. Save Feedback
```javascript
// Node Type: Supabase
// Table: feedback
// استخدم AI لتحليل الرد واستخراج التقييم والملاحظات
```

---

### Node 16: Support Ticket Creation
**الغرض**: إنشاء طلب دعم فني

**متى يُستخدم**: عندما يكتب المستخدم "دعم" أو "مشكلة"

**الإعدادات**:
```javascript
// اكتشاف طلب الدعم
if (text.includes('دعم') || text.includes('مشكلة') || text.includes('help')) {
  // أنشئ ticket في جدول support_tickets
  return {
    client_id: clientId,
    subject: "طلب دعم من " + clientName,
    description: text,
    status: "open",
    priority: "medium"
  };
}
```

**رد تلقائي**:
```
تم استلام طلبك! 🎫

سيتواصل معك فريق الدعم في أقرب وقت ممكن.
رقم الطلب: #{{ ticket_id }}

شكراً لصبرك! 💚
```

---

## الميزات الإضافية

### 17. Image Recognition for Progress Photos
```javascript
// عندما يرسل المستخدم صورة جسم:
// 1. احفظها في progress_logs
// 2. استخدم AI لتحليل التغييرات المرئية
// 3. قدم تشجيع وملاحظات
```

### 18. Workout Plan Generation
```javascript
// عندما يطلب جدول تمارين:
// 1. استخدم AI لإنشاء خطة تمارين مخصصة
// 2. احفظها في workout_plans
// 3. أرسلها بصيغة منظمة مع فيديوهات توضيحية
```

### 19. Smart Recommendations
```javascript
// استخدم AI لتحليل:
// - أنماط الأكل
// - معدل الالتزام
// - التقدم الأسبوعي
// وقدم توصيات ذكية
```

---

## نصائح مهمة

### الأمان
1. **لا تخزن API Keys في الـ workflow**، استخدم Environment Variables
2. **فعّل Rate Limiting** لمنع الإساءة
3. **قم بالتحقق من هوية المستخدم** قبل إجراء عمليات حساسة

### الأداء
1. **استخدم Caching** للبيانات المتكررة
2. **قلل عدد استدعاءات قاعدة البيانات** بدمج الاستعلامات
3. **استخدم Batch Processing** للعمليات الكبيرة

### تجربة المستخدم
1. **كن سريعاً في الرد** (أقل من 3 ثوان)
2. **استخدم Emojis** لجعل الرسائل أكثر ودية
3. **قدم خيارات** بدلاً من الأسئلة المفتوحة عند الإمكان

### الاختبار
1. اختبر كل نوع من الرسائل (نص، صورة، صوت)
2. اختبر السيناريوهات الشائعة
3. اختبر حالات الأخطاء

---

## الربط مع لوحة التحكم

### Webhook للتحديثات
يمكنك إضافة webhook node لإرسال تحديثات إلى لوحة التحكم:

```javascript
// Node Type: HTTP Request
// Method: POST
// URL: https://your-lovable-app.com/api/webhook
// Body: {
//   "event": "new_message",
//   "client_id": "...",
//   "data": {...}
// }
```

### المزامنة الفورية
استخدم Supabase Realtime في لوحة التحكم لرؤية التحديثات فوراً:
```typescript
const channel = supabase
  .channel('messages-realtime')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'messages'
  }, (payload) => {
    console.log('New message:', payload);
  })
  .subscribe();
```

---

## الخلاصة

هذا الـ workflow سيعمل بشكل تلقائي كمساعد ذكي متكامل:

✅ يستقبل رسائل Telegram (نص، صور، صوت)
✅ يحلل الطعام ويحسب السعرات
✅ ينشئ خطط غذائية وتمارين
✅ يتابع التقدم تلقائياً
✅ يجمع التقييمات والاقتراحات
✅ يدير طلبات الدعم
✅ يتكامل مع قاعدة البيانات
✅ يرسل رسائل متابعة يومية

**بالتوفيق في بناء نظامك! 🚀**
