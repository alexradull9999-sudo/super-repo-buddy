import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from 'motion/react';
import { 
  Snowflake, Phone, Package, Thermometer, Truck, Target, 
  CheckCircle2, Clock, ShieldCheck, Settings, FileText, 
  ChevronRight, Download, MapPin, Mail, MessageCircle, Send, X, Wrench, Percent
} from 'lucide-react';
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

// --- Components ---

const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '8736832056:AAEUFgeNKKVA-ThvK17L7qBrX9Y-iKqJtug';
const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID || '5874913931';

const sendTelegramMessage = async (text: string) => {
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: 'HTML',
      }),
    });
  } catch (error) {
    console.error('Error sending message to Telegram:', error);
  }
};

const ContactModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [phone, setPhone] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length > 5) {
      setIsSubmitted(true);
      
      // 1. Send Telegram Notification
      await sendTelegramMessage(`<b>Новая заявка на подбор контейнера!</b>\n\n📞 Телефон: ${phone}`);
      
      // 2. Submit to AmoCRM via backend API
      try {
        await fetch('/api/lead', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'Заявка на подбор',
            phone,
            source: 'Подбор контейнера (Модальное окно)'
          }),
        });
      } catch (err) {
        console.error('Error submitting to AmoCRM:', err);
      }

      setTimeout(() => {
        setIsSubmitted(false);
        setPhone('');
        onClose();
      }, 3000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden z-[101]"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-8">
              {isSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Заявка отправлена!</h3>
                  <p className="text-gray-600">Мы перезвоним вам в течение 15 минут.</p>
                </motion.div>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Подбор контейнера</h3>
                  <p className="text-gray-600 mb-6">Оставьте свой номер, и наш специалист поможет подобрать идеальный контейнер под ваши задачи и рассчитает стоимость.</p>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Номер телефона
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          id="phone"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+7 (999) 000-00-00"
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00AEEF] focus:border-transparent transition-all outline-none"
                        />
                      </div>
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 bg-[#00AEEF] hover:bg-[#0090C5] text-white py-3 px-4 rounded-xl font-semibold transition-colors"
                    >
                      <Send className="w-5 h-5" />
                      Подобрать контейнер
                    </button>
                    <p className="text-xs text-center text-gray-500 mt-4">
                      Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности.
                    </p>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const CatalogModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [messenger, setMessenger] = useState<'whatsapp' | 'telegram' | 'max'>('whatsapp');
  const [phone, setPhone] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length > 5) {
      setIsSubmitted(true);
      
      // 1. Send Telegram Notification
      await sendTelegramMessage(`<b>Запрос каталога!</b>\n\n📱 Мессенджер: ${messenger}\n📞 Телефон: ${phone}`);
      
      // 2. Submit to AmoCRM via backend API
      try {
        await fetch('/api/lead', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'Запрос каталога',
            phone,
            message: `Предоставить в мессенджер: ${messenger}`,
            source: 'Запрос каталога (Модальное окно)'
          }),
        });
      } catch (err) {
        console.error('Error submitting to AmoCRM:', err);
      }

      setTimeout(() => {
        setIsSubmitted(false);
        setPhone('');
        onClose();
      }, 3000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden z-[101]"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-8">
              {isSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Каталог отправлен!</h3>
                  <p className="text-gray-600">Проверьте ваш {messenger === 'whatsapp' ? 'WhatsApp' : messenger === 'telegram' ? 'Telegram' : 'MAX'} через минуту.</p>
                </motion.div>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Куда отправить каталог?</h3>
                  <p className="text-gray-600 mb-6">Выберите удобный мессенджер и укажите номер телефона.</p>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-3 gap-3">
                      <button 
                        type="button" 
                        onClick={() => setMessenger('whatsapp')} 
                        className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${messenger === 'whatsapp' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 hover:border-green-200 text-gray-500 hover:text-green-600'}`}
                      >
                        <MessageCircle className="w-6 h-6" />
                        <span className="text-xs font-semibold">WhatsApp</span>
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setMessenger('telegram')} 
                        className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${messenger === 'telegram' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-blue-200 text-gray-500 hover:text-blue-500'}`}
                      >
                        <Send className="w-6 h-6" />
                        <span className="text-xs font-semibold">Telegram</span>
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setMessenger('max')} 
                        className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${messenger === 'max' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 hover:border-orange-200 text-gray-500 hover:text-orange-500'}`}
                      >
                        <MessageCircle className="w-6 h-6" />
                        <span className="text-xs font-semibold">MAX</span>
                      </button>
                    </div>

                    <div>
                      <label htmlFor="catalog-phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Номер телефона
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          id="catalog-phone"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+7 (999) 000-00-00"
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00AEEF] focus:border-transparent transition-all outline-none"
                        />
                      </div>
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 bg-[#00AEEF] hover:bg-[#0090C5] text-white py-3 px-4 rounded-xl font-semibold transition-colors"
                    >
                      <Download className="w-5 h-5" />
                      Получить каталог
                    </button>
                    <p className="text-xs text-center text-gray-500 mt-4">
                      Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности.
                    </p>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const FrostEffect = () => {
  const { scrollYProgress } = useScroll();
  // Freezes continuously from top to bottom
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.div
      style={{ opacity }}
      className="fixed inset-0 pointer-events-none z-[100] overflow-hidden"
    >
      {/* 1. Frosted Glass Base */}
      <div 
        className="absolute inset-0 backdrop-blur-[16px]"
        style={{
          maskImage: 'radial-gradient(ellipse at center, transparent 20%, black 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, transparent 20%, black 85%)'
        }}
      />
      
      {/* 2. Deep Freeze Gradient (Cold blue/white glow) */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 25%, rgba(255, 255, 255, 0.5) 60%, rgba(0, 174, 239, 0.4) 90%, rgba(0, 74, 153, 0.6) 100%)',
          boxShadow: 'inset 0 0 200px rgba(255, 255, 255, 0.9), inset 0 0 80px rgba(0, 174, 239, 0.6)'
        }}
      />

      {/* 3. Realistic Ice Cracks (Fractures) */}
      <div 
        className="absolute inset-0 opacity-90 mix-blend-overlay"
        style={{
          backgroundImage: `
            linear-gradient(135deg, transparent 15%, rgba(255,255,255,1) 15.1%, rgba(255,255,255,0.3) 15.3%, transparent 15.5%),
            linear-gradient(110deg, transparent 22%, rgba(255,255,255,0.9) 22.1%, transparent 22.3%),
            linear-gradient(-45deg, transparent 18%, rgba(255,255,255,1) 18.1%, rgba(255,255,255,0.3) 18.3%, transparent 18.5%),
            linear-gradient(-20deg, transparent 28%, rgba(255,255,255,0.8) 28.1%, transparent 28.2%),
            linear-gradient(225deg, transparent 25%, rgba(255,255,255,1) 25.1%, rgba(255,255,255,0.3) 25.3%, transparent 25.5%),
            linear-gradient(60deg, transparent 12%, rgba(255,255,255,0.9) 12.1%, rgba(255,255,255,0.2) 12.3%, transparent 12.5%),
            linear-gradient(160deg, transparent 35%, rgba(255,255,255,0.7) 35.1%, transparent 35.2%),
            linear-gradient(-160deg, transparent 32%, rgba(255,255,255,0.7) 32.1%, transparent 32.2%),
            linear-gradient(80deg, transparent 45%, rgba(255,255,255,0.8) 45.1%, transparent 45.2%),
            linear-gradient(-80deg, transparent 40%, rgba(255,255,255,0.8) 40.1%, transparent 40.2%)
          `,
          backgroundSize: '150% 150%',
          backgroundPosition: 'center',
          maskImage: 'radial-gradient(ellipse at center, transparent 30%, black 90%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, transparent 30%, black 90%)'
        }}
      />

      {/* 4. Snow Dusting (Fine crystals) */}
      <div 
        className="absolute inset-0 opacity-80 mix-blend-screen"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='snow'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 8 -5'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23snow)'/%3E%3C/svg%3E")`,
          maskImage: 'radial-gradient(ellipse at center, transparent 25%, black 95%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, transparent 25%, black 95%)'
        }}
      />

      {/* 5. Base Ice Texture (General frost) */}
      <div 
        className="absolute inset-0 opacity-50 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          maskImage: 'radial-gradient(ellipse at center, transparent 20%, black 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, transparent 20%, black 100%)'
        }}
      />
      
      {/* 6. Thick Ice Crust Border (Multi-layered for depth) */}
      <div className="absolute inset-0 border-[24px] border-white/50 blur-[4px] rounded-2xl mix-blend-overlay" />
      <div className="absolute inset-0 border-[48px] border-white/30 blur-[12px] rounded-3xl mix-blend-screen" />
      <div className="absolute inset-0 border-[80px] border-[#00AEEF]/10 blur-[24px] rounded-[3rem] mix-blend-multiply" />
      <div className="absolute inset-0 border-[12px] border-white/80 blur-[2px] rounded-xl" />
    </motion.div>
  );
};

const TemperatureIndicator = () => {
  const { scrollYProgress } = useScroll();
  const [temp, setTemp] = useState(5);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Map scroll progress 0 -> 1 to temperature +5 -> -60
    const currentTemp = 5 - (latest * 65);
    setTemp(Math.round(currentTemp));
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
      className="fixed bottom-6 right-6 z-[110] flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-3 rounded-2xl shadow-[0_0_20px_rgba(0,174,239,0.2)]"
    >
      <div className={`p-2 rounded-full transition-colors duration-300 ${temp <= 0 ? 'bg-[#00AEEF]/20 text-[#00AEEF]' : 'bg-orange-500/20 text-orange-500'}`}>
        <Thermometer className="w-6 h-6" />
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Температура</span>
        <span className={`text-2xl font-bold font-mono transition-colors duration-300 ${temp <= 0 ? 'text-[#00AEEF]' : 'text-orange-500'}`}>
          {temp > 0 ? `+${temp}` : temp}°C
        </span>
      </div>
    </motion.div>
  );
};

const Header = ({ onOpenModal }: { onOpenModal: () => void }) => {
  const scrollToQuiz = () => {
    document.getElementById('quiz-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <img src="/logo.png" alt="РефЭкспресс" className="h-10 object-contain" />
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#catalog" className="text-gray-600 hover:text-[#00AEEF] font-medium transition-colors">Каталог</a>
            <a href="#benefits" className="text-gray-600 hover:text-[#00AEEF] font-medium transition-colors">Преимущества</a>
            <a href="#quiz-section" className="text-gray-600 hover:text-[#00AEEF] font-medium transition-colors">Квиз</a>
            <a href="#contacts" className="text-gray-600 hover:text-[#00AEEF] font-medium transition-colors">Контакты</a>
          </nav>

          {/* CTA & Phone */}
          <div className="hidden lg:flex items-center gap-6">
            <div className="flex flex-col items-end">
              <a href="tel:+78125668710" className="text-lg font-bold text-gray-900 hover:text-[#00AEEF] transition-colors">
                +7 (812) 566-87-10
              </a>
              <a href="mailto:sales@refexpress.ru" className="text-xs text-gray-500 hover:text-[#00AEEF] transition-colors">sales@refexpress.ru</a>
            </div>
            <button 
              onClick={onOpenModal}
              className="bg-transparent border-2 border-[#004A99] text-[#004A99] hover:bg-[#004A99] hover:text-white px-5 py-2.5 rounded-lg font-semibold transition-all"
            >
              Заказать звонок
            </button>
          </div>

          {/* Mobile Menu Button (simplified) */}
          <div className="md:hidden flex items-center">
            <button className="text-gray-600 hover:text-[#004A99]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

const Hero = () => {
  const scrollToQuiz = () => {
    document.getElementById('quiz-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative bg-[#F4F7F9] pt-16 pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <div className="max-w-2xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-6"
            >
              Аренда и продажа рефконтейнеров с гарантией температуры <span className="text-[#00AEEF]">до -60°C</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg sm:text-xl text-gray-600 mb-10 leading-relaxed"
            >
              Подберем контейнер под задачу за 30 минут. Доставка по всей РФ. В наличии новые и б/у модели.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <button 
                onClick={scrollToQuiz}
                className="relative group overflow-hidden bg-[#004A99] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-[#004A99]/30 hover:shadow-[#004A99]/50 transition-all"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                <span className="relative flex items-center justify-center gap-2">
                  ПОЛУЧИТЬ КАТАЛОГ И ЦЕНЫ
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </motion.div>

            {/* Features Row */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-6"
            >
              <div className="flex flex-col gap-2">
                <Package className="w-6 h-6 text-[#00AEEF]" />
                <span className="text-sm font-semibold text-gray-900">В наличии</span>
                <span className="text-xs text-gray-500">Склады в крупнейших городах</span>
              </div>
              <div className="flex flex-col gap-2">
                <Thermometer className="w-6 h-6 text-[#00AEEF]" />
                <span className="text-sm font-semibold text-gray-900">-60°C ... +30°C</span>
                <span className="text-xs text-gray-500">Точное поддержание режима</span>
              </div>
              <div className="flex flex-col gap-2">
                <Truck className="w-6 h-6 text-[#00AEEF]" />
                <span className="text-sm font-semibold text-gray-900">От 1 дня</span>
                <span className="text-xs text-gray-500">Собственная логистика</span>
              </div>
              <div className="flex flex-col gap-2">
                <Target className="w-6 h-6 text-[#00AEEF]" />
                <span className="text-sm font-semibold text-gray-900">Подбор</span>
                <span className="text-xs text-gray-500">От фармпрепаратов до рыбы</span>
              </div>
            </motion.div>
          </div>

          {/* Image/Decor */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl"
          >
            <img 
              src="/hero.jpg" 
              alt="Рефконтейнер" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Glassmorphism Overlay for Discount */}
            <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-xl shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="bg-red-500/20 p-2 rounded-lg">
                  <Percent className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <div className="text-xs text-white/80 font-medium uppercase tracking-wider">Скидки</div>
                  <div className="text-3xl font-mono font-bold text-white">до 20%</div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-gradient-to-br from-[#00AEEF]/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
    </section>
  );
};

const Benefits = () => {
  const benefits = [
    {
      icon: <Package className="w-8 h-8 text-[#00AEEF]" />,
      title: "Контейнеры в наличии",
      desc: "Более 500 единиц оборудования на терминалах. Вам не нужно ждать поставки из-за рубежа."
    },
    {
      icon: <Truck className="w-8 h-8 text-[#00AEEF]" />,
      title: "Быстрая доставка по РФ",
      desc: "Отправляем контейнеры авто- и ж/д транспортом в любую точку страны."
    },
    {
      icon: <Settings className="w-8 h-8 text-[#00AEEF]" />,
      title: "Авторизованный сервисный центр",
      desc: "В наличии запчасти, осуществляем ремонт и техническое обслуживание рефконтейнеров."
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-[#00AEEF]" />,
      title: "Гарантия работоспособности",
      desc: "Каждый контейнер проходит предпродажную подготовку (PTI) и тестирование под нагрузкой."
    },
    {
      icon: <Target className="w-8 h-8 text-[#00AEEF]" />,
      title: "Подбор под ваш бизнес",
      desc: "Подбираем модели (Carrier, Thermo King, Daikin) под конкретный тип продукции."
    },
    {
      icon: <FileText className="w-8 h-8 text-[#00AEEF]" />,
      title: "Работаем с НДС",
      desc: "Полный пакет документов, прозрачные договоры аренды и купли-продажи."
    }
  ];

  return (
    <section id="benefits" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            Почему «РефЭкспресс» — надежный партнер для вашего бизнеса?
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((b, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#F4F7F9] p-8 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100"
            >
              <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center shadow-sm mb-6">
                {b.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{b.title}</h3>
              <p className="text-gray-600 leading-relaxed">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Quiz = () => {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const handleAnswer = (answer: string) => {
    setAnswers(prev => ({ ...prev, [step]: answer }));
    setStep(s => Math.min(s + 1, 5));
  };
  
  const handleFinish = async () => {
    if (phone.length > 5) {
      setStep(5);
      const quizDetails = `1. Цель: ${answers[1] || 'Не указано'}\n2. Температура: ${answers[2] || 'Не указано'}\n3. Формат: ${answers[3] || 'Не указано'}`;
      
      // 1. Send Telegram Notification
      await sendTelegramMessage(`<b>Результаты квиза!</b>\n\n${quizDetails}\n📞 Телефон: ${phone}`);
      
      // 2. Submit to AmoCRM via backend API
      try {
        await fetch('/api/lead', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'Лид из Квиза',
            phone,
            message: quizDetails,
            source: 'Квиз на сайте'
          }),
        });
      } catch (err) {
        console.error('Error submitting to AmoCRM:', err);
      }
    }
  };

  const progress = ((step - 1) / 4) * 100;

  return (
    <section id="quiz-section" className="py-24 bg-[#004A99] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
            Подберем рефконтейнер под вашу задачу за 1 минуту
          </h2>
          <p className="text-[#00AEEF] text-lg font-medium">
            Ответьте на 4 вопроса и получите подборку подходящих моделей с расчетом стоимости.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Progress Bar */}
          <div className="h-2 bg-gray-100 w-full">
            <motion.div 
              className="h-full bg-[#00AEEF]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <div className="p-8 md:p-12 min-h-[400px] flex flex-col">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex-1"
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-8">1. Какая у вас цель?</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {['Хранение продукции', 'Перевозка', 'Шоковая заморозка', 'Производство/Лаборатория'].map((item) => (
                      <button 
                        key={item}
                        onClick={() => handleAnswer(item)}
                        className="p-6 text-left border-2 border-gray-100 rounded-xl hover:border-[#00AEEF] hover:bg-[#F4F7F9] transition-all font-medium text-gray-700 group"
                      >
                        <div className="flex justify-between items-center">
                          {item}
                          <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#00AEEF]" />
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex-1"
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-8">2. Какой температурный режим нужен?</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {['Тепло (+5…+15 °C)', 'Охлаждение (0…-5 °C)', 'Заморозка (-18…-25 °C)', 'Глубокая заморозка (до -60 °C)'].map((item) => (
                      <button 
                        key={item}
                        onClick={() => handleAnswer(item)}
                        className="p-6 text-left border-2 border-gray-100 rounded-xl hover:border-[#00AEEF] hover:bg-[#F4F7F9] transition-all font-medium text-gray-700 group"
                      >
                        <div className="flex justify-between items-center">
                          {item}
                          <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#00AEEF]" />
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex-1"
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-8">3. Какой формат сделки интересует?</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {['Аренда краткосрочная', 'Аренда долгосрочная', 'Покупка нового', 'Покупка б/у'].map((item) => (
                      <button 
                        key={item}
                        onClick={() => handleAnswer(item)}
                        className="p-6 text-left border-2 border-gray-100 rounded-xl hover:border-[#00AEEF] hover:bg-[#F4F7F9] transition-all font-medium text-gray-700 group"
                      >
                        <div className="flex justify-between items-center">
                          {item}
                          <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#00AEEF]" />
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div 
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex-1 flex flex-col items-center justify-center text-center"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Ваша подборка готова!</h3>
                  <p className="text-gray-600 mb-8 max-w-md">
                    Введите номер телефона, к которому привязан мессенджер, и мы пришлем каталог с ценами в течение 2 минут.
                  </p>
                  
                  <div className="w-full max-w-md space-y-4">
                    <input 
                      type="tel" 
                      placeholder="+7 (___) ___-__-__"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-[#00AEEF] focus:border-transparent transition-all"
                    />
                    <button 
                      onClick={handleFinish}
                      className="w-full bg-[#004A99] hover:bg-[#003875] text-white font-bold py-4 rounded-xl text-lg transition-colors flex items-center justify-center gap-2"
                    >
                      ПОЛУЧИТЬ КАТАЛОГ
                      <Send className="w-5 h-5" />
                    </button>
                    
                    <div className="flex justify-center gap-4 pt-4">
                      <button className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-green-600 transition-colors">
                        <MessageCircle className="w-4 h-4" /> WhatsApp
                      </button>
                      <button className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-500 transition-colors">
                        <Send className="w-4 h-4" /> Telegram
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 5 && (
                <motion.div 
                  key="step5"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex-1 flex flex-col items-center justify-center text-center"
                >
                  <div className="w-20 h-20 bg-[#00AEEF]/10 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-[#00AEEF]" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">Спасибо за заявку!</h3>
                  <p className="text-gray-600 text-lg mb-8 max-w-md">
                    Каталог с ценами и подходящими моделями уже отправлен на ваш номер. Наш менеджер свяжется с вами в рабочее время для консультации.
                  </p>
                  <button 
                    onClick={() => setStep(1)}
                    className="text-[#004A99] font-medium hover:underline"
                  >
                    Пройти квиз заново
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

interface CaseStudy {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  challenge: string;
  solution: string;
  result: string;
  stats: { label: string; value: string }[];
  specs: { name: string; value: string }[];
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: 1,
    title: "Поставка 10 контейнеров для агрохолдинга (хранение ягод)",
    subtitle: "Проект по сохранению урожая свежих ягод в период пикового сбора",
    image: "/yagodi.png",
    challenge: "Агрохолдингу требовалось оперативно увеличить складские мощности для охлаждения и кратковременного хранения свежесобранной клубники и голубики в период пикового сбора урожая. Малейшее отклонение от температуры приводило к потере товарного вида и порче ягод.",
    solution: "Было оперативно доставлено и введено в эксплуатацию 10 рефрижераторных контейнеров Daikin 40-футового формата повышенной высоты (High Cube). Наши специалисты на месте настроили точное поддержание температуры +3°C с погрешностью не более 0.5°C и контроль влажности воздуха.",
    result: "Урожай ягод был сохранен на 100%, отгрузка дистрибьюторам прошла в запланированные сроки без потери качества. Клиент смог реализовать продукцию по максимальной цене и продлил договор аренды на следующий сезон.",
    stats: [
      { label: "Сохранено продукции", value: "100%" },
      { label: "Срок запуска", value: "24 часа" },
      { label: "Общий объем", value: "760 м³" }
    ],
    specs: [
      { name: "Тип оборудования", value: "40 High Cube" },
      { name: "Производитель", value: "Daikin" },
      { name: "Температурный режим", value: "+3°C (±0.5°C)" },
      { name: "Количество единиц", value: "10 шт." },
      { name: "Срок аренды", value: "4 месяца" }
    ]
  },
  {
    id: 2,
    title: "Организация склада шоковой заморозки для рыбного порта",
    subtitle: "Высокотехнологичный комплекс быстрой заморозки свежевыловленной рыбы",
    image: "/ribniy.png",
    challenge: "Рыбодобывающей компании в порту требовалось надежное решение для быстрой заморозки свежевыловленной рыбы непосредственно на портовом терминале перед транспортировкой. Стандартное холодильное оборудование не обеспечивало необходимую скорость заморозки, что снижало сортность рыбы.",
    solution: "Спроектирован и поставлен специализированный комплекс шоковой заморозки на базе 40-футового контейнера Carrier PrimeLINE с ультрапроизводительной холодильной установкой. Мы оптимизировали систему распределения воздушных потоков внутри контейнера для максимально быстрого теплообмена.",
    result: "Время полной заморозки рыбы сократилось с 12 до 4.5 часов. Благодаря высокой скорости заморозки структура волокон рыбы полностью сохраняется (технология IQF), что позволило клиенту продавать продукцию премиального качества.",
    stats: [
      { label: "Время заморозки", value: "4.5 ч" },
      { label: "Температура заморозки", value: "до -40°C" },
      { label: "Прирост сортности", value: "+35%" }
    ],
    specs: [
      { name: "Тип оборудования", value: "40 Shock Freeze" },
      { name: "Производитель", value: "Carrier PrimeLINE" },
      { name: "Температурный режим", value: "до -40°C" },
      { name: "Тип охлаждения", value: "Направленный поток" },
      { name: "Формат сделки", value: "Выкуп в лизинг" }
    ]
  }
];

const CaseModal = ({ isOpen, onClose, caseData, onOpenContactModal }: { isOpen: boolean; onClose: () => void; caseData: CaseStudy | null; onOpenContactModal: () => void }) => {
  if (!caseData) return null;
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden z-[101] max-h-[90vh] flex flex-col"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors z-20 bg-black/40 hover:bg-black/60 p-2 rounded-full cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Scrollable Container */}
            <div className="overflow-y-auto flex-1">
              {/* Cover Image */}
              <div className="relative h-60 sm:h-72 w-full">
                <img 
                  src={caseData.image} 
                  alt={caseData.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 sm:p-8">
                  <span className="text-[#00AEEF] font-bold text-xs sm:text-sm uppercase tracking-wider mb-1 sm:mb-2">Кейс из практики</span>
                  <h3 className="text-white text-xl sm:text-2xl font-extrabold tracking-tight leading-tight">{caseData.title}</h3>
                  <p className="text-gray-300 text-xs sm:text-sm mt-1 sm:mt-2">{caseData.subtitle}</p>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-6 sm:p-8 space-y-6 sm:space-y-8">
                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4 border-b border-gray-100 pb-6">
                  {caseData.stats.map((stat, i) => (
                    <div key={i} className="text-center">
                      <div className="text-xl sm:text-2xl font-black text-[#004A99]">{stat.value}</div>
                      <div className="text-[10px] sm:text-xs text-gray-500 font-medium mt-1 uppercase tracking-wider">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
                  <div className="md:col-span-2 space-y-6 sm:space-y-8">
                    {/* Challenge */}
                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-gray-950 flex items-center gap-2 mb-2">
                        <span className="w-1 h-5 bg-red-500 rounded-full inline-block"></span>
                        Проблема и вызов
                      </h4>
                      <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{caseData.challenge}</p>
                    </div>

                    {/* Solution */}
                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-gray-950 flex items-center gap-2 mb-2">
                        <span className="w-1 h-5 bg-[#00AEEF] rounded-full inline-block"></span>
                        Разработанное решение
                      </h4>
                      <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{caseData.solution}</p>
                    </div>

                    {/* Result */}
                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-gray-950 flex items-center gap-2 mb-2">
                        <span className="w-1 h-5 bg-green-500 rounded-full inline-block"></span>
                        Достигнутый результат
                      </h4>
                      <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{caseData.result}</p>
                    </div>
                  </div>

                  {/* Sidebar specs */}
                  <div className="bg-[#F4F7F9] p-5 sm:p-6 rounded-2xl h-fit border border-gray-100">
                    <h5 className="font-bold text-gray-900 border-b border-gray-200 pb-2 text-xs uppercase tracking-wider mb-4">Спецификация</h5>
                    <div className="space-y-3 text-xs sm:text-sm">
                      {caseData.specs.map((spec, i) => (
                        <div key={i} className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                          <span className="text-gray-500">{spec.name}</span>
                          <span className="font-semibold text-gray-800 text-left sm:text-right">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer action bar */}
            <div className="bg-[#F4F7F9] p-4 px-6 sm:px-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-gray-600 font-medium text-center sm:text-left">Хотите рассчитать аналогичное индивидуальное решение?</span>
              <button
                onClick={() => {
                  onClose();
                  onOpenContactModal();
                }}
                className="w-full sm:w-auto bg-[#00AEEF] hover:bg-[#0090C5] text-white py-2.5 px-6 rounded-xl font-bold text-sm transition-colors text-center cursor-pointer shadow-sm"
              >
                Рассчитать стоимость
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const Trust = ({ onOpenContactModal }: { onOpenContactModal: () => void }) => {
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="text-center p-8 bg-[#F4F7F9] rounded-2xl">
            <div className="text-5xl font-extrabold text-[#004A99] mb-2">500+</div>
            <div className="text-gray-600 font-medium">контейнеров в постоянном обороте</div>
          </div>
          <div className="text-center p-8 bg-[#F4F7F9] rounded-2xl">
            <div className="text-5xl font-extrabold text-[#004A99] mb-2">100+</div>
            <div className="text-gray-600 font-medium">активных B2B клиентов</div>
          </div>
          <div className="text-center p-8 bg-[#F4F7F9] rounded-2xl">
            <div className="text-5xl font-extrabold text-[#004A99] mb-2">12 лет</div>
            <div className="text-gray-600 font-medium">безупречной работы на рынке</div>
          </div>
        </div>

        {/* Cases */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {CASE_STUDIES.map((c) => (
            <div 
              key={c.id}
              onClick={() => setSelectedCase(c)}
              className="group relative rounded-2xl overflow-hidden shadow-lg h-80 cursor-pointer hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99] transition-all duration-300"
            >
              <img 
                src={c.image} 
                alt={c.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8">
                <span className="text-[#00AEEF] font-bold text-sm uppercase tracking-wider mb-2">Кейс</span>
                <h3 className="text-white text-xl font-bold group-hover:text-[#00AEEF] transition-colors leading-snug">{c.title}</h3>
                <div className="flex items-center gap-2 mt-4 text-white/80 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>Подробнее о проекте</span>
                  <ChevronRight className="w-4 h-4 text-[#00AEEF]" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cases Popup Modal */}
        <CaseModal 
          isOpen={!!selectedCase} 
          onClose={() => setSelectedCase(null)} 
          caseData={selectedCase} 
          onOpenContactModal={onOpenContactModal}
        />

        {/* Clients Logos */}
        <div className="pt-12 border-t border-gray-100">
          <p className="text-center text-sm font-semibold text-gray-400 uppercase tracking-widest mb-8">Среди наших клиентов</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            <img src="/partner/kinros.png" alt="Kinros" className="max-h-12 object-contain hover:scale-110 transition-transform" />
            <img src="/partner/polarstar.png" alt="Polar Star" className="max-h-12 object-contain hover:scale-110 transition-transform" />
            <img src="/partner/evergreen.png" alt="Evergreen" className="max-h-12 object-contain hover:scale-110 transition-transform" />
            <img src="/partner/agroprom.png" alt="Agroprom" className="max-h-12 object-contain hover:scale-110 transition-transform" />
            <img src="/partner/gazprom.png" alt="Gazprom" className="max-h-12 object-contain hover:scale-110 transition-transform" />
            <img src="/partner/alrosa.png" alt="Alrosa" className="max-h-12 object-contain hover:scale-110 transition-transform" />
          </div>
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const steps = [
    { num: "01", title: "Заявка", desc: "Оставляете запрос на сайте или звоните." },
    { num: "02", title: "Подбор", desc: "Эксперт подбирает модель и марку (Carrier/Daikin) под ваш бюджет." },
    { num: "03", title: "Договор", desc: "Согласуем условия, подписываем документы (ЭДО доступно)." },
    { num: "04", title: "Запуск", desc: "Доставляем, пуско-наладка, контейнер готов к работе." }
  ];

  return (
    <section className="py-24 bg-[#F4F7F9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-16 text-center tracking-tight">
          Как мы работаем
        </h2>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              {/* Connector Line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-[2px] bg-gray-200"></div>
              )}
              
              <div className="bg-white w-16 h-16 rounded-2xl shadow-sm flex items-center justify-center text-2xl font-black text-[#004A99] mb-6 relative z-10 border-2 border-[#F4F7F9]">
                {step.num}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Catalog = ({ onOpenModal }: { onOpenModal: () => void }) => {
  const items = [
    {
      title: "20 футов (Standart)",
      desc: "Компактный, до 10 паллет. Идеален для малого бизнеса.",
      img: "/containers/20.webp"
    },
    {
      title: "40 футов (High Cube)",
      desc: "Увеличенная высота, до 25 паллет. Оптимально для крупных складов.",
      img: "/containers/40.png"
    },
    {
      title: "Шоковая заморозка",
      desc: "Усиленные агрегаты для быстрой заморозки мяса/рыбы за 4-6 часов.",
      img: "/containers/shokzam.webp"
    },
    {
      title: "Спецрешения",
      desc: "Контейнеры с дополнительными дверьми или перегородками.",
      img: "/containers/spec.webp"
    }
  ];

  return (
    <section id="catalog" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-16 text-center tracking-tight">
          Типы контейнеров
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-shadow flex flex-col">
              <div className="h-48 overflow-hidden">
                <img 
                  src={item.img} 
                  alt={item.title} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-6 flex-1">{item.desc}</p>
                <button onClick={onOpenModal} className="w-full py-3 border-2 border-[#004A99] text-[#004A99] font-semibold rounded-xl hover:bg-[#004A99] hover:text-white transition-colors">
                  Узнать цену
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FinalCTA = ({ onOpenModal }: { onOpenModal: () => void }) => {
  return (
    <section className="py-24 bg-[#004A99] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#004A99] to-[#002855]"></div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight leading-tight">
          Не теряйте прибыль из-за нарушения температурного режима
        </h2>
        <p className="text-xl text-[#00AEEF] mb-12 font-medium">
          Получите закрытый каталог с актуальными ценами, наличием на складе и <span className="text-white border-b border-[#00AEEF]">чек-листом по выбору рефконтейнера</span>.
        </p>
        <button 
          onClick={onOpenModal}
          className="inline-flex items-center gap-3 bg-white text-[#004A99] px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:bg-gray-50 hover:scale-105 transition-all"
        >
          <Download className="w-6 h-6" />
          ПОЛУЧИТЬ КАТАЛОГ И ЧЕК ЛИСТ
        </button>
        <p className="mt-6 text-sm text-gray-400 font-medium">
          Отправим PDF-файл в WhatsApp или Telegram за 1 минуту
        </p>
      </div>
    </section>
  );
};

const ServiceCenter = ({ onOpenModal }: { onOpenModal: () => void }) => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F4F7F9] rounded-3xl p-8 md:p-16 relative overflow-hidden border border-gray-100">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 -mt-16 -mr-16 text-[#00AEEF] opacity-10">
            <Settings className="w-64 h-64 animate-[spin_20s_linear_infinite]" />
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#00AEEF]/10 text-[#00AEEF] rounded-full font-semibold text-sm mb-6">
                <ShieldCheck className="w-4 h-4" />
                Официальный сервис
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">
                Авторизованный сервисный центр
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                В наличии запчасти, осуществляем ремонт и техническое обслуживание рефконтейнеров любой сложности.
              </p>
              
              <ul className="space-y-4 mb-8">
                {[
                  'Оригинальные запчасти всегда на складе',
                  'Выездные бригады для ремонта на вашей территории',
                  'Плановое ТО и диагностика оборудования',
                  'Гарантия на все выполненные работы'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#00AEEF] shrink-0" />
                    <span className="text-gray-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={onOpenModal}
                className="inline-flex items-center justify-center gap-2 bg-[#00AEEF] hover:bg-[#0090C5] text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <Wrench className="w-5 h-5" />
                Обратиться в сервисный центр
              </button>
            </div>
            
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl relative">
                <img 
                  src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800" 
                  alt="Ремонт рефконтейнеров" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
              
              {/* Floating badge */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#004A99] rounded-full flex items-center justify-center text-white">
                    <Wrench className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">24/7</div>
                    <div className="text-sm text-gray-500 font-medium">Поддержка клиентов</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const TERMINAL_CITIES = [
  { id: 'msk', name: 'Москва', coordinates: [37.6173, 55.7558], address: 'Терминал Ворсино' },
  { id: 'spb', name: 'Санкт-Петербург', coordinates: [30.3351, 59.9343], address: 'Терминал Шушары' },
  { id: 'nsk', name: 'Новосибирск', coordinates: [82.9357, 55.0084], address: 'Терминал Клещиха' },
  { id: 'ekb', name: 'Екатеринбург', coordinates: [60.6057, 56.8389], address: 'Терминал Кольцово' },
  { id: 'kzn', name: 'Казань', coordinates: [49.1088, 55.7963], address: 'Терминал Свияжск' },
  { id: 'nnv', name: 'Нижний Новгород', coordinates: [44.0059, 56.3269], address: 'Терминал Доскино' },
  { id: 'chl', name: 'Челябинск', coordinates: [61.4368, 55.1644], address: 'Терминал Металлургическая' },
  { id: 'krs', name: 'Красноярск', coordinates: [92.8932, 56.0153], address: 'Терминал Базаиха' },
  { id: 'smr', name: 'Самара', coordinates: [50.2212, 53.2415], address: 'Терминал Безымянка' },
  { id: 'ufa', name: 'Уфа', coordinates: [55.9721, 54.7388], address: 'Терминал Дема' },
  { id: 'rnd', name: 'Ростов-на-Дону', coordinates: [39.7233, 47.2313], address: 'Терминал Заречная' },
  { id: 'omsk', name: 'Омск', coordinates: [73.3242, 54.9885], address: 'Терминал Карбышево' },
  { id: 'krd', name: 'Краснодар', coordinates: [38.9806, 45.0393], address: 'Терминал Сортировочная' },
  { id: 'vrn', name: 'Воронеж', coordinates: [39.2003, 51.6608], address: 'Терминал Придача' },
  { id: 'prm', name: 'Пермь', coordinates: [56.2502, 58.0105], address: 'Терминал Блочная' },
  { id: 'vlg', name: 'Волгоград', coordinates: [44.5133, 48.7080], address: 'Терминал Гумрак' },
  { id: 'vvo', name: 'Владивосток', coordinates: [131.8869, 43.1198], address: 'Терминал Морской порт' },
  { id: 'pkc', name: 'Петропавловск-Камчатский', coordinates: [158.6432, 53.0238], address: 'Терминал Камчатка' },
];

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const TerminalsMap = () => {
  const [activeCity, setActiveCity] = useState<typeof TERMINAL_CITIES[0] | null>(null);

  return (
    <section className="py-24 bg-[#F4F7F9] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            Наши терминалы по всей России
          </h2>
          <p className="text-xl text-gray-600">
            Мы присутствуем во всех городах-миллионниках, а также в ключевых портовых городах Дальнего Востока для быстрой отгрузки и обслуживания.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-4 lg:p-8 relative">
          <div className="w-full h-[400px] lg:h-[600px] relative">
            <ComposableMap
              projection="geoAzimuthalEqualArea"
              projectionConfig={{
                rotate: [-100, -60, 0],
                scale: 600
              }}
              style={{ width: "100%", height: "100%" }}
            >
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies
                    .filter(d => d.properties.name === "Russia")
                    .map(geo => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill="#E8F4FA"
                        stroke="#BBE3F8"
                        strokeWidth={1}
                        style={{
                          default: { outline: "none" },
                          hover: { outline: "none", fill: "#E8F4FA" },
                          pressed: { outline: "none" },
                        }}
                      />
                    ))
                }
              </Geographies>
              
              {TERMINAL_CITIES.map((city) => (
                <Marker 
                  key={city.id} 
                  coordinates={city.coordinates as [number, number]}
                  onMouseEnter={() => setActiveCity(city)}
                  onMouseLeave={() => setActiveCity(null)}
                  onClick={() => setActiveCity(city)}
                >
                  <g className="cursor-pointer transition-transform hover:scale-150">
                    <circle r={6} fill="#00AEEF" stroke="#fff" strokeWidth={2} />
                    <circle r={12} fill="#00AEEF" opacity={0.3} className="animate-ping" />
                  </g>
                </Marker>
              ))}
            </ComposableMap>

            {/* Tooltip */}
            <AnimatePresence>
              {activeCity && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-8 left-8 bg-white p-4 rounded-xl shadow-2xl border border-gray-100 pointer-events-none z-20"
                >
                  <h4 className="font-bold text-gray-900 text-lg mb-1">{activeCity.name}</h4>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#00AEEF]" />
                    {activeCity.address}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

const Questions = ({ onOpenModal }: { onOpenModal: () => void }) => {
  return (
    <section className="py-24 bg-[#004A99] relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M 8 0 L 0 0 0 8" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
          Остались вопросы?
        </h2>
        <p className="text-xl text-blue-100 mb-10 leading-relaxed max-w-2xl mx-auto">
          Наши специалисты готовы проконсультировать вас по любым вопросам аренды, покупки и обслуживания рефконтейнеров. Оставьте заявку, и мы свяжемся с вами в течение 15 минут.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={onOpenModal}
            className="w-full sm:w-auto bg-[#00AEEF] hover:bg-[#0090C5] text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Получить консультацию
          </button>
          <a 
            href="tel:+78125668710"
            className="w-full sm:w-auto bg-transparent border-2 border-white/20 hover:border-white text-white px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2"
          >
            <Phone className="w-5 h-5" />
            Позвонить нам
          </a>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer id="contacts" className="bg-gray-900 text-gray-300 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-6">
              <img src="/logo.png" alt="РефЭкспресс" className="h-10 object-contain" />
            </div>
            <p className="text-gray-400 max-w-sm mb-8">
              Надежный партнер в сфере хладологистики. Аренда и продажа рефконтейнеров по всей России.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#00AEEF] hover:text-white transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#00AEEF] hover:text-white transition-colors">
                <Send className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Контакты</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#00AEEF] shrink-0 mt-0.5" />
                <span>Санкт-Петербург, ул. Новорощинская, д.4, офис 1114-2</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#00AEEF] shrink-0" />
                <a href="tel:+78125668710" className="hover:text-white transition-colors">+7 (812) 566-87-10</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#00AEEF] shrink-0" />
                <a href="mailto:sales@refexpress.ru" className="hover:text-white transition-colors">sales@refexpress.ru</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Информация</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-white transition-colors">О компании</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Реквизиты (ИНН/ОГРН)</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Политика конфиденциальности</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Пользовательское соглашение</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-16 pt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} ООО «РефЭкспресс». Все права защищены.
        </div>
      </div>
    </footer>
  );
};

// --- Main App ---

export default function RefExpressApp() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#00AEEF] selection:text-white relative">
      <FrostEffect />
      <TemperatureIndicator />
      <Header onOpenModal={() => setIsModalOpen(true)} />
      <main>
        <Hero />
        <Benefits />
        <Quiz />
        <Trust onOpenContactModal={() => setIsModalOpen(true)} />
        <HowItWorks />
        <Catalog onOpenModal={() => setIsModalOpen(true)} />
        <FinalCTA onOpenModal={() => setIsCatalogModalOpen(true)} />
        <ServiceCenter onOpenModal={() => setIsModalOpen(true)} />
        <TerminalsMap />
        <Questions onOpenModal={() => setIsModalOpen(true)} />
      </main>
      <Footer />
      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <CatalogModal isOpen={isCatalogModalOpen} onClose={() => setIsCatalogModalOpen(false)} />
    </div>
  );
}

