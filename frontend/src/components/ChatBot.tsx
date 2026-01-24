import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageCircle, Minimize2, Sparkles, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

interface FAQ {
    question: string;
    answer: string;
    keywords: string[];
}

const faqs: FAQ[] = [
    {
        question: "How do I start analyzing medical images?",
        answer: "To analyze medical images:\n1. Click on 'New Analysis' or navigate to the Upload page\n2. Select the AI model that matches your scan type (Skin Disease, Brain Tumor, Diabetic Retinopathy, etc.)\n3. Upload your medical image (JPEG, PNG - Max 10MB)\n4. Click 'Analyze' to get instant AI-powered results\n\nYour analysis will include diagnosis, confidence level, and medical recommendations!",
        keywords: ["analyze", "upload", "image", "scan", "start", "how to", "begin"]
    },
    {
        question: "What AI models are available?",
        answer: "MediScan AI offers several specialized models:\n\n🔬 Skin Disease Detection (92% accuracy) - Detects melanoma, acne, eczema, and more\n👁️ Diabetic Retinopathy (94% accuracy) - Early detection of diabetic eye complications\n🧠 Brain Tumor Detection (89% accuracy) - MRI analysis for glioma, meningioma, pituitary tumors\n💉 CBC Analysis - Complete Blood Count interpretation\n📊 BMI Calculator - Body Mass Index calculation\n\nEach model is trained on millions of medical images!",
        keywords: ["models", "ai", "available", "types", "what", "which", "scan types"]
    },
    {
        question: "What are the new pricing plans?",
        answer: "We now offer flexible pricing options:\n\n� Custom Scans: ₹20 per scan\n• Buy exactly what you need\n• NEVER expire!\n• Perfect for occasional users\n\n📦 Monthly Pack: ₹500 for 100 scans (valid 31 days)\n• ₹5 per scan\n• 75% cheaper than custom\n\n🎁 Yearly Pack: ₹5000 for 2000 scans (valid 365 days)\n• ₹2.50 per scan\n• 87.5% cheaper than custom\n• 50% cheaper than monthly!\n\n✨ Custom scans accumulate and NEVER expire. Plan scans expire after their validity period!",
        keywords: ["pricing", "price", "cost", "plans", "monthly", "yearly", "how much", "rupees", "payment", "custom", "scans"]
    },
    {
        question: "Do my scans expire?",
        answer: "It depends on the type:\n\n✅ Custom Scans: NEVER expire!\n• They're yours forever\n• Accumulate over time\n• Perfect for long-term use\n\n⏰ Plan Scans:\n• Monthly Pack: Expires after 31 days\n• Yearly Pack: Expires after 365 days\n\n⚠️ Important:\n• Plan timers count down daily (even if unused)\n• After plan expiry, you keep your custom scans\n• You get 5 free scans if you have no custom scans\n• Track expiry date on Dashboard\n\nCustom scans = permanent | Plan scans = temporary!",
        keywords: ["expire", "expiration", "validity", "how long", "duration", "when", "time limit", "scans expire"]
    },
    {
        question: "How many free scans do I get?",
        answer: "New users receive 5 FREE scans to try our AI models! You can see your remaining scans on the Dashboard.\n\nWant more scans?\n💰 Custom: ₹20 per scan (never expires!)\n📦 Monthly: 100 scans for ₹500 (31 days)\n🎁 Yearly: 2000 scans for ₹5000 (365 days)\n\nBenefits include:\n✨ High-quality AI analyses\n📊 Priority processing\n📈 Advanced analytics\n🎯 All disease models\n\nCheck the Pricing page for details!",
        keywords: ["free", "scans", "remaining", "limit", "how many", "trial"]
    },
    {
        question: "Is my medical data secure?",
        answer: "Absolutely! Your privacy and security are our top priorities:\n\n🔒 DPDP Act 2023 Compliant - We follow India's data protection laws\n🛡️ End-to-end Encryption - All data is encrypted in transit and at rest\n🔐 Secure Storage - Images are stored securely and deleted after analysis\n👤 Complete Privacy - We never share your medical data with third parties\n✅ Clinically Validated - Our AI models are validated by 100+ medical professionals\n\nYour health information is safe with us!",
        keywords: ["security", "secure", "privacy", "safe", "data", "confidential", "hipaa", "dpdp"]
    },
    {
        question: "How do I upgrade to a scan pack?",
        answer: "Purchasing scan packs is easy:\n\n1. Navigate to the Dashboard or Pricing page\n2. Choose your pack (Monthly or Yearly)\n3. Click 'Get 100 Scans' or 'Get 5000 Scans'\n4. Complete payment via secure Razorpay gateway\n5. Your scans are available immediately!\n\n💎 After purchase, you'll see:\n• Total scans available\n• Expiration date\n• Remaining scans counter\n\nPayment is one-time, not recurring!",
        keywords: ["upgrade", "premium", "payment", "subscribe", "pay", "pricing", "plan", "buy", "purchase"]
    },
    {
        question: "What should I do if my analysis shows abnormal results?",
        answer: "If your AI analysis indicates abnormal findings:\n\n⚠️ Don't panic - AI provides preliminary screening, not final diagnosis\n👨‍⚕️ Consult a specialist - We provide doctor recommendations with each analysis\n📞 Emergency contacts - For urgent cases, call 911/108 immediately\n📋 Detailed guidance - Check the medical recommendations section for:\n   • Specialist referrals\n   • Medication information\n   • Lifestyle adjustments\n   • Follow-up care instructions\n\n🔔 Remember: Always seek professional medical advice for diagnosis and treatment!",
        keywords: ["abnormal", "results", "emergency", "doctor", "diagnosis", "help", "concerning", "problem"]
    },
    {
        question: "How accurate are the AI predictions?",
        answer: "Our AI models achieve high accuracy rates:\n\n🎯 Skin Disease Detection: 92% accuracy\n👁️ Diabetic Retinopathy: 94% accuracy  \n🧠 Brain Tumor Detection: 89% accuracy\n💉 CBC Analysis: Clinical-grade interpretation\n\nAll models are:\n✅ Trained on millions of medical images\n✅ Validated by 100+ medical professionals\n✅ Continuously improved with new data\n\n⚠️ Important: AI serves as a screening tool. Always consult healthcare professionals for final diagnosis and treatment!",
        keywords: ["accuracy", "reliable", "trust", "confidence", "how accurate", "percentage"]
    },
    {
        question: "Can I download or share my analysis results?",
        answer: "Yes! Your analysis results include:\n\n📊 Detailed prediction with confidence level\n🔬 Medical guidance and recommendations\n👨‍⚕️ Doctor referrals\n💊 Medication information\n\nTo access your history:\n1. Go to Dashboard\n2. View 'Activity History'\n3. Filter by date to find specific analyses\n\n📧 You can screenshot results to share with your doctor. We're working on PDF export feature!",
        keywords: ["download", "share", "export", "save", "results", "history", "pdf"]
    },
    {
        question: "What image formats are supported?",
        answer: "MediScan AI supports common image formats:\n\n✅ JPEG (.jpg, .jpeg)\n✅ PNG (.png)\n📏 Maximum file size: 10MB\n📐 Recommended: Clear, well-lit images\n\nTips for best results:\n🔍 Ensure good lighting\n📸 Keep the camera steady\n🎯 Center the area of interest\n✨ Avoid blurry or dark images\n\nFor best AI accuracy, use high-quality scans!",
        keywords: ["format", "image type", "file", "jpeg", "png", "size", "upload"]
    },
    {
        question: "How do I contact support?",
        answer: "We're here to help! Contact us:\n\n💬 Live Chat: Right here in this chatbot!\n📧 Email: support@mediscan.ai\n📞 Phone: Available on Dashboard\n🆘 Emergency Medical: Call 911/108\n\n⏰ Support Hours:\nMonday - Friday: 9 AM - 6 PM IST\nWeekends: 10 AM - 4 PM IST\n\nFor technical issues, please include:\n• Your account details\n• Description of the problem\n• Screenshots if applicable",
        keywords: ["contact", "support", "help", "email", "phone", "customer service"]
    },
    {
        question: "Can the AI interpret blood test results?",
        answer: "Yes! Our CBC Analysis model can interpret Complete Blood Count results:\n\n🩸 What we analyze:\n• White Blood Cell count (WBC)\n• Red Blood Cell count (RBC)\n• Hemoglobin levels\n• Platelet count\n• Other CBC parameters\n\n💡 You'll receive:\n✅ Normal/Abnormal indicators\n📊 Reference ranges\n⚠️ Health recommendations\n👨‍⚕️ When to see a doctor\n\nSimply upload a clear photo of your blood test report!",
        keywords: ["blood", "cbc", "test", "lab", "hemoglobin", "platelet", "report", "blood work"]
    },
    {
        question: "What if the image quality is poor?",
        answer: "For accurate AI analysis, image quality matters! If your image is unclear:\n\n📸 Image Quality Tips:\n1. Use good natural lighting or bright LED lights\n2. Avoid shadows and glare\n3. Keep camera steady (use timer or tripod)\n4. Center the area of interest\n5. Use the highest camera resolution\n6. Ensure focus is sharp\n\n⚠️ If quality is too low:\n• The AI may not analyze it\n• Results may be less accurate\n• You'll receive a quality warning\n\nRetake the image if needed - it won't consume extra scans if analysis fails!",
        keywords: ["quality", "blurry", "unclear", "dark", "bad image", "poor", "lighting", "focus"]
    },
    {
        question: "Can I cancel or get a refund?",
        answer: "Refund Policy:\n\n✅ Within 7 days of purchase:\n• Full refund if you haven't used any scans\n• Partial refund based on unused scans\n\n❌ After 7 days or if pack expired:\n• No refunds available\n• Scans are time-limited, not guaranteed usage\n\n📧 To request refund:\n1. Email support@mediscan.ai\n2. Include order ID and reason\n3. We'll process within 5-7 business days\n\n💡 Tip: Start with the Free Plan (5 scans) to test before purchasing!",
        keywords: ["refund", "cancel", "money back", "return", "cancellation", "unsubscribe"]
    },
    {
        question: "How do I interpret the confidence score?",
        answer: "The confidence score shows how certain the AI is about its prediction:\n\n📊 Confidence Level Guide:\n\n🟢 90-100%: Very High Confidence\n• Strong match found\n• Highly reliable prediction\n• Still consult doctor for confirmation\n\n🟡 70-89%: Moderate Confidence\n• Good match, some uncertainty\n• Consider multiple possibilities\n• Definitely see a specialist\n\n🔴 Below 70%: Low Confidence\n• AI is uncertain\n• Multiple conditions possible\n• Professional diagnosis essential\n\n⚠️ Remember: Even 99% confidence doesn't replace doctor consultation!",
        keywords: ["confidence", "score", "percentage", "accuracy", "interpret", "meaning", "understand"]
    },
    {
        question: "Is there a mobile app available?",
        answer: "Currently, MediScan AI is available as a web application:\n\n🌐 Access from anywhere:\n✅ Mobile browsers (Chrome, Safari)\n✅ Tablet browsers\n✅ Desktop computers\n\n📱 Mobile App (Coming Soon!):\n• Native iOS app\n• Native Android app\n• Offline analysis capability\n• Push notifications\n• Faster processing\n\nFor now, simply visit our website from your mobile browser - it's fully responsive and works great on all devices!",
        keywords: ["mobile", "app", "android", "ios", "phone", "download", "application"]
    },
    {
        question: "Can I analyze multiple images at once?",
        answer: "Currently, you can analyze one image at a time for accuracy:\n\n📸 Single Image Analysis:\n• Ensures focused AI processing\n• Better accuracy per scan\n• Detailed individual reports\n\n🔄 For multiple areas:\n1. Upload first image → Analyze\n2. Wait for results\n3. Upload next image → Analyze\n4. Each uses 1 scan from your balance\n\n💡 Batch Processing (Coming Soon!):\n• Upload multiple images\n• Process all at once\n• Get combined report\n• Available in future updates",
        keywords: ["multiple", "batch", "several", "many", "images", "at once", "bulk"]
    },
    {
        question: "What happens when my scans run out?",
        answer: "When you use all your scans:\n\n🔴 Out of Scans:\n• You'll see 'No scans remaining' message\n• Upload feature will be disabled\n• Dashboard shows scan count: 0\n\n✅ What you can do:\n1. Purchase a new scan pack\n2. Wait for pack expiration (resets to 5 free scans)\n3. View your previous analysis history\n\n📦 Quick Purchase:\n• Monthly: 100 scans for ₹150\n• Yearly: 5000 scans for ₹1500\n\nPurchasing is instant - scans available immediately!",
        keywords: ["run out", "no scans", "finished", "used up", "out of", "zero scans"]
    },
    {
        question: "How is my data used to train AI models?",
        answer: "Data Usage & Privacy:\n\n🔒 Your Privacy First:\n• Images are anonymized before any training\n• All personal information removed\n• You can opt-out anytime in Settings\n\n🤖 How We Improve:\n✅ Anonymized images may help train models\n✅ Only if you give explicit consent\n✅ Makes AI more accurate for everyone\n✅ Strictly compliant with DPDP Act 2023\n\n❌ We NEVER:\n• Share identifiable medical data\n• Sell your information\n• Use data without permission\n\nYour data helps save lives while staying completely private!",
        keywords: ["training", "data usage", "ai training", "privacy", "consent", "anonymized"]
    },
    {
        question: "What happens when I have both custom scans and plan scans?",
        answer: "Great question! Here's how it works when you have BOTH types:\\n\\n🎯 Smart Consumption System:\\n\\nWhen you analyze an image, the system uses:\\n1️⃣ PLAN scans first (they expire, so use them!)\\n2️⃣ CUSTOM scans second (they never expire, so saved for later)\\n\\n📊 Example Scenario:\\n\\nDay 1: You buy 20 custom scans (₹400)\\n→ Custom: 20 | Plan: 0\\n\\nDay 5: You buy Monthly Pack (₹500)\\n→ Custom: 20 | Plan: 100 | Total: 120\\n→ Expiry: 31 days from now\\n\\nDay 10: You use 30 scans\\n→ Custom: 20 (NOT touched!)\\n→ Plan: 70 (100 - 30 = 70)\\n→ System used plan scans first!\\n\\nDay 36: Monthly plan EXPIRES\\n→ Custom: 20 (PRESERVED!)\\n→ Plan: 0 (expired)\\n→ You still have 20 custom scans forever!\\n\\n✨ Benefits:\\n• Never waste permanent scans\\n• Always use expiring scans first\\n• Custom scans = insurance policy\\n• Dashboard shows both types separately\\n\\n💡 Smart Strategy: Buy custom scans for backup, use plan scans for regular use!",
        keywords: ["both scans", "custom and plan", "together", "combination", "mixed", "which used first", "priority", "consumption", "plan expires", "what happens", "scenario", "example"]
    }
];

const greetings = [
    "Hello! 👋 I'm your MediScan AI assistant. How can I help you today?",
    "Hi there! 🏥 I'm here to help you navigate MediScan AI. What would you like to know?",
    "Welcome! 💙 I'm your guide to MediScan AI. Ask me anything about our platform!"
];

const fallbackResponses = [
    "I'm not sure about that specific question, but here are some helpful topics:\n\n• How to analyze medical images\n• Available AI models\n• Pricing and free scans\n• Data security\n• Accuracy rates\n\nYou can also contact our support team for personalized assistance!",
    "Great question! While I don't have a specific answer for that, I can help with:\n\n• Getting started with analyses\n• Understanding your results\n• Account and billing\n• Technical support\n\nWould you like help with any of these topics?",
];

export function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [askedQuestions, setAskedQuestions] = useState<string[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && !isMinimized && messages.length === 0) {
            // Send greeting message
            const greeting = greetings[Math.floor(Math.random() * greetings.length)];
            addBotMessage(greeting);
        }
    }, [isOpen]);

    const addBotMessage = (text: string) => {
        const message: Message = {
            id: Date.now().toString(),
            text,
            sender: 'bot',
            timestamp: new Date()
        };
        setMessages(prev => [...prev, message]);
    };

    const addUserMessage = (text: string) => {
        const message: Message = {
            id: Date.now().toString(),
            text,
            sender: 'user',
            timestamp: new Date()
        };
        setMessages(prev => [...prev, message]);
    };

    const findBestAnswer = (userInput: string): string => {
        const input = userInput.toLowerCase();

        // Find matching FAQ
        const matches = faqs.map(faq => {
            const keywordMatches = faq.keywords.filter(keyword =>
                input.includes(keyword.toLowerCase())
            ).length;
            return { faq, score: keywordMatches };
        }).filter(m => m.score > 0)
            .sort((a, b) => b.score - a.score);

        if (matches.length > 0) {
            return matches[0].faq.answer;
        }

        // Return fallback response
        return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    };

    const handleSend = () => {
        if (!inputValue.trim()) return;

        addUserMessage(inputValue);
        // Track asked questions
        setAskedQuestions(prev => [...prev, inputValue.trim()]);
        setInputValue('');
        setIsTyping(true);

        // Simulate typing delay
        setTimeout(() => {
            const answer = findBestAnswer(inputValue);
            addBotMessage(answer);
            setIsTyping(false);
        }, 1000);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const suggestedQuestions = [
        "How do I start?",
        "What are the pricing plans?",
        "Do my scans expire?",
        "What happens when I have both custom scans and plan scans?",
        "Can you interpret blood tests?",
        "How accurate is the AI?"
    ];

    const handleClose = () => {
        setIsOpen(false);
        setMessages([]); // Clear all messages
        setInputValue(''); // Clear input field
        setIsMinimized(false); // Reset minimize state
        setAskedQuestions([]); // Clear asked questions
    };

    return (
        <>
            {/* Floating Chat Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsOpen(true)}
                        title="Need Help? Chat with us!"
                        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-teal-600 text-white p-4 rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all"
                    >
                        <MessageCircle className="h-6 w-6" />
                        <motion.div
                            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            !
                        </motion.div>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.8 }}
                        className="fixed bottom-6 right-6 z-50 w-96 bg-white rounded-2xl shadow-2xl border-2 border-blue-100 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-4 text-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="relative">
                                        <Bot className="h-8 w-8" />
                                        <motion.div
                                            className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">MediScan Assistant</h3>
                                        <p className="text-xs text-blue-100">Here to help 24/7</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => setIsMinimized(!isMinimized)}
                                        className="hover:bg-white/20 p-1.5 rounded-lg transition-colors"
                                    >
                                        <Minimize2 className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={handleClose}
                                        className="hover:bg-white/20 p-1.5 rounded-lg transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Chat Content */}
                        {!isMinimized && (
                            <>
                                {/* Messages */}
                                <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-50 to-white">
                                    {messages.map((message) => (
                                        <motion.div
                                            key={message.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[80%] p-3 rounded-2xl ${message.sender === 'user'
                                                    ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white'
                                                    : 'bg-white border border-slate-200 text-slate-800'
                                                    }`}
                                            >
                                                <p className="text-sm whitespace-pre-line">{message.text}</p>
                                                <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>
                                                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}

                                    {isTyping && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="flex justify-start"
                                        >
                                            <div className="bg-white border border-slate-200 p-4 rounded-2xl">
                                                <div className="flex space-x-2">
                                                    <motion.div
                                                        className="w-2 h-2 bg-blue-600 rounded-full"
                                                        animate={{ y: [0, -8, 0] }}
                                                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                                                    />
                                                    <motion.div
                                                        className="w-2 h-2 bg-teal-600 rounded-full"
                                                        animate={{ y: [0, -8, 0] }}
                                                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                                                    />
                                                    <motion.div
                                                        className="w-2 h-2 bg-green-600 rounded-full"
                                                        animate={{ y: [0, -8, 0] }}
                                                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Show suggested questions after each bot message (excluding asked ones) */}
                                    {!isTyping && messages.length > 0 && messages[messages.length - 1].sender === 'bot' && (
                                        <div className="space-y-2">
                                            <p className="text-xs text-slate-500 font-medium">You might also ask:</p>
                                            {suggestedQuestions
                                                .filter(question => !askedQuestions.includes(question))
                                                .map((question, index) => (
                                                    <motion.button
                                                        key={question}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: index * 0.1 }}
                                                        onClick={() => {
                                                            // Auto-send the question
                                                            addUserMessage(question);
                                                            setAskedQuestions(prev => [...prev, question]);
                                                            setIsTyping(true);
                                                            setTimeout(() => {
                                                                const answer = findBestAnswer(question);
                                                                addBotMessage(answer);
                                                                setIsTyping(false);
                                                            }, 1000);
                                                        }}
                                                        className="block w-full text-left p-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200 hover:shadow-sm"
                                                    >
                                                        {question}
                                                    </motion.button>
                                                ))}
                                        </div>
                                    )}

                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input */}
                                <div className="p-4 border-t border-slate-200 bg-white">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            placeholder="Ask me anything..."
                                            className="flex-1 p-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
                                        />
                                        <Button
                                            onClick={handleSend}
                                            disabled={!inputValue.trim()}
                                            className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 p-3"
                                        >
                                            <Send className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-2 text-center">
                                        Powered by MediScan AI <Sparkles className="inline h-3 w-3" />
                                    </p>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
