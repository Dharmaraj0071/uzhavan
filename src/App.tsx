import React, { useState, useEffect, useRef } from 'react';
import { 
  Sprout, 
  Droplets, 
  Bug, 
  TrendingUp, 
  LayoutDashboard, 
  Languages, 
  Thermometer, 
  Droplet, 
  FlaskConical,
  Camera,
  Upload,
  ChevronRight,
  AlertCircle,
  Loader2,
  MapPin,
  Calendar,
  Waves
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { 
  getCropRecommendation, 
  analyzePest, 
  getSoilAdvice 
} from './services/geminiService';
import { 
  TAMIL_DISTRICTS, 
  SOIL_TYPES, 
  SEASONS, 
  WATER_LEVELS,
  type SoilStats,
  type MarketPrice
} from './constants';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Tab = 'dashboard' | 'advisor' | 'scanner' | 'market';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [lang, setLang] = useState<'ta' | 'en'>('ta');
  
  // Dashboard State
  const [soilStats, setSoilStats] = useState<SoilStats>({
    moisture: 32,
    ph: 6.5,
    temp: 28
  });
  const [soilAdvice, setSoilAdvice] = useState<string | null>(null);
  const [loadingSoil, setLoadingSoil] = useState(false);

  // Advisor State
  const [advisorData, setAdvisorData] = useState({
    district: 'Thanjavur',
    soilType: 'Alluvial Soil',
    season: 'Kharif (Sornavari/Kar/Kuruvai)',
    waterAvailability: 'Moderate'
  });
  const [cropAdvice, setCropAdvice] = useState<string | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  // Scanner State
  const [scannerImage, setScannerImage] = useState<string | null>(null);
  const [pestAnalysis, setPestAnalysis] = useState<string | null>(null);
  const [loadingScanner, setLoadingScanner] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Market State
  const [marketPrices] = useState<MarketPrice[]>([
    { crop: 'Paddy (Ponni)', price: '₹2,400/quintal', trend: 'up', market: 'Thanjavur' },
    { crop: 'Turmeric', price: '₹12,500/quintal', trend: 'up', market: 'Erode' },
    { crop: 'Groundnut', price: '₹6,800/quintal', trend: 'stable', market: 'Madurai' },
    { crop: 'Cotton', price: '₹7,200/quintal', trend: 'down', market: 'Salem' },
    { crop: 'Banana', price: '₹450/bunch', trend: 'up', market: 'Trichy' },
  ]);

  const handleSoilAdvice = async () => {
    setLoadingSoil(true);
    try {
      const advice = await getSoilAdvice(soilStats);
      setSoilAdvice(advice || 'No advice received.');
    } catch (error) {
      console.error(error);
      setSoilAdvice('Error getting advice.');
    } finally {
      setLoadingSoil(false);
    }
  };

  const handleCropAdvice = async () => {
    setLoadingAdvice(true);
    try {
      const advice = await getCropRecommendation(advisorData);
      setCropAdvice(advice || 'No advice received.');
    } catch (error) {
      console.error(error);
      setCropAdvice('Error getting advice.');
    } finally {
      setLoadingAdvice(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScannerImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePestAnalysis = async () => {
    if (!scannerImage) return;
    setLoadingScanner(true);
    try {
      const analysis = await analyzePest(scannerImage);
      setPestAnalysis(analysis || 'No analysis received.');
    } catch (error) {
      console.error(error);
      setPestAnalysis('Error analyzing image.');
    } finally {
      setLoadingScanner(false);
    }
  };

  const t = (ta: string, en: string) => (lang === 'ta' ? ta : en);

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-white shadow-2xl relative overflow-hidden">
      {/* Header */}
      <header className="bg-agri-green text-white p-6 rounded-b-[2rem] shadow-lg z-10">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-2 rounded-xl">
              <Sprout className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">
              {t('உழவன் AI', 'Uzhavan AI')}
            </h1>
          </div>
          <button 
            onClick={() => setLang(lang === 'ta' ? 'en' : 'ta')}
            className="flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-white/20 transition-colors"
          >
            <Languages className="w-4 h-4" />
            {lang === 'ta' ? 'English' : 'தமிழ்'}
          </button>
        </div>
        <p className="text-white/80 text-sm font-serif italic">
          {t('தமிழ்நாடு விவசாயிகளின் டிஜிட்டல் தோழன்', 'Digital companion for Tamil Nadu farmers')}
        </p>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 pb-24">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <section>
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-agri-brown">
                  <LayoutDashboard className="w-5 h-5" />
                  {t('மண் ஆரோக்கியம்', 'Soil Health Card')}
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                    <div className="flex items-center gap-2 text-blue-600 mb-2">
                      <Droplet className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">{t('ஈரப்பதம்', 'Moisture')}</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-900">{soilStats.moisture}%</div>
                    <div className="text-[10px] text-blue-600 mt-1">{soilStats.moisture < 30 ? t('குறைவு', 'Low') : t('மிதமானது', 'Optimal')}</div>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
                    <div className="flex items-center gap-2 text-amber-600 mb-2">
                      <FlaskConical className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">{t('pH அளவு', 'pH Level')}</span>
                    </div>
                    <div className="text-2xl font-bold text-amber-900">{soilStats.ph}</div>
                    <div className="text-[10px] text-amber-600 mt-1">{t('சற்று அமிலத்தன்மை', 'Slightly Acidic')}</div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
                    <div className="flex items-center gap-2 text-orange-600 mb-2">
                      <Thermometer className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">{t('வெப்பநிலை', 'Temp')}</span>
                    </div>
                    <div className="text-2xl font-bold text-orange-900">{soilStats.temp}°C</div>
                    <div className="text-[10px] text-orange-600 mt-1">{t('சாதாரணமானது', 'Normal')}</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-2xl border border-green-100 flex flex-col justify-center items-center text-center cursor-pointer hover:bg-green-100 transition-colors"
                    onClick={() => setSoilStats(prev => ({ ...prev, moisture: Math.floor(Math.random() * 100) }))}
                  >
                    <div className="text-[10px] font-bold text-green-700 uppercase">{t('புதுப்பி', 'Refresh')}</div>
                    <Sprout className="w-6 h-6 text-green-600 mt-1" />
                  </div>
                </div>
              </section>

              <section className="bg-agri-brown/5 p-5 rounded-3xl border border-agri-brown/10">
                <button 
                  onClick={handleSoilAdvice}
                  disabled={loadingSoil}
                  className="w-full bg-agri-brown text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-agri-brown/90 transition-all disabled:opacity-50"
                >
                  {loadingSoil ? <Loader2 className="w-5 h-5 animate-spin" /> : <Droplets className="w-5 h-5" />}
                  {t('AI ஆலோசனை பெறுங்கள்', 'Get AI Advice')}
                </button>
                
                {soilAdvice && (
                  <div className="mt-4 p-4 bg-white rounded-xl border border-agri-brown/20 shadow-sm">
                    <div className="markdown-body">
                      <Markdown>{soilAdvice}</Markdown>
                    </div>
                  </div>
                )}
              </section>

              <section className="bg-red-50 p-4 rounded-2xl border border-red-100 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-red-900">{t('எச்சரிக்கை', 'Alert')}</h4>
                  <p className="text-xs text-red-700 mt-1">
                    {t('ஈரப்பதம் குறைவு. அடுத்த 24 மணிநேரத்தில் பாசனம் செய்யவும்.', 'Low moisture. Irrigate within 24 hours.')}
                  </p>
                </div>
              </section>

              <section className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
                <h3 className="text-sm font-bold text-amber-900 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {t('அறுவடைக்கு பிந்தைய கண்காணிப்பு', 'Post-Harvest Monitoring')}
                </h3>
                <p className="text-xs text-amber-800">
                  {t('சேமிப்பு கிடங்கில் ஈரப்பதம் 14% க்கு மேல் உள்ளது. தானியங்கள் முளைக்க வாய்ப்புள்ளது. காற்றோட்டத்தை அதிகரிக்கவும்.', 'Storage humidity is above 14%. Risk of sprouting. Increase ventilation.')}
                </p>
              </section>
            </motion.div>
          )}

          {activeTab === 'advisor' && (
            <motion.div
              key="advisor"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-lg font-bold flex items-center gap-2 text-agri-green">
                <Sprout className="w-5 h-5" />
                {t('பயிர் ஆலோசகர்', 'Crop Advisor')}
              </h2>

              <div className="space-y-4 bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {t('மாவட்டம்', 'District')}
                  </label>
                  <select 
                    value={advisorData.district}
                    onChange={(e) => setAdvisorData({...advisorData, district: e.target.value})}
                    className="w-full p-3 rounded-xl bg-slate-50 border-none text-sm focus:ring-2 focus:ring-agri-green"
                  >
                    {TAMIL_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 flex items-center gap-1">
                    <FlaskConical className="w-3 h-3" /> {t('மண் வகை', 'Soil Type')}
                  </label>
                  <select 
                    value={advisorData.soilType}
                    onChange={(e) => setAdvisorData({...advisorData, soilType: e.target.value})}
                    className="w-full p-3 rounded-xl bg-slate-50 border-none text-sm focus:ring-2 focus:ring-agri-green"
                  >
                    {SOIL_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {t('பருவம்', 'Season')}
                  </label>
                  <select 
                    value={advisorData.season}
                    onChange={(e) => setAdvisorData({...advisorData, season: e.target.value})}
                    className="w-full p-3 rounded-xl bg-slate-50 border-none text-sm focus:ring-2 focus:ring-agri-green"
                  >
                    {SEASONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 flex items-center gap-1">
                    <Waves className="w-3 h-3" /> {t('நீர் வசதி', 'Water Availability')}
                  </label>
                  <select 
                    value={advisorData.waterAvailability}
                    onChange={(e) => setAdvisorData({...advisorData, waterAvailability: e.target.value})}
                    className="w-full p-3 rounded-xl bg-slate-50 border-none text-sm focus:ring-2 focus:ring-agri-green"
                  >
                    {WATER_LEVELS.map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>

                <button 
                  onClick={handleCropAdvice}
                  disabled={loadingAdvice}
                  className="w-full bg-agri-green text-white py-4 rounded-xl font-bold shadow-lg shadow-agri-green/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loadingAdvice ? <Loader2 className="w-5 h-5 animate-spin" /> : <ChevronRight className="w-5 h-5" />}
                  {t('பரிந்துரைகளைக் காட்டு', 'Show Recommendations')}
                </button>
              </div>

              {cropAdvice && (
                <div className="p-5 bg-agri-green/5 rounded-3xl border border-agri-green/10">
                  <div className="markdown-body">
                    <Markdown>{cropAdvice}</Markdown>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'scanner' && (
            <motion.div
              key="scanner"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-lg font-bold flex items-center gap-2 text-purple-700">
                <Bug className="w-5 h-5" />
                {t('பூச்சி ஸ்கேனர்', 'Pest Scanner')}
              </h2>

              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center">
                {!scannerImage ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-200 rounded-2xl p-12 flex flex-col items-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <div className="bg-purple-100 p-4 rounded-full text-purple-600">
                      <Camera className="w-8 h-8" />
                    </div>
                    <p className="text-sm font-medium text-slate-600">
                      {t('புகைப்படத்தைப் பதிவேற்றவும்', 'Upload or Take Photo')}
                    </p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest">
                      {t('பயிர் இலைகளைத் தெளிவாகக் காட்டவும்', 'Show crop leaves clearly')}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <img 
                      src={scannerImage} 
                      alt="Crop" 
                      className="w-full h-64 object-cover rounded-2xl shadow-md" 
                    />
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setScannerImage(null)}
                        className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-600"
                      >
                        {t('மாற்று', 'Change')}
                      </button>
                      <button 
                        onClick={handlePestAnalysis}
                        disabled={loadingScanner}
                        className="flex-[2] bg-purple-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {loadingScanner ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                        {t('ஆராய்ந்து சொல்', 'Analyze Now')}
                      </button>
                    </div>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>

              {pestAnalysis && (
                <div className="p-5 bg-purple-50 rounded-3xl border border-purple-100">
                  <div className="markdown-body">
                    <Markdown>{pestAnalysis}</Markdown>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'market' && (
            <motion.div
              key="market"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-lg font-bold flex items-center gap-2 text-blue-700">
                <TrendingUp className="w-5 h-5" />
                {t('சந்தை நிலவரம்', 'Market Intelligence')}
              </h2>

              <div className="space-y-3">
                {marketPrices.map((item, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-slate-800">{item.crop}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-500 font-bold uppercase">
                          {item.market}
                        </span>
                        <span className={cn(
                          "text-[10px] font-bold uppercase",
                          item.trend === 'up' ? "text-green-600" : item.trend === 'down' ? "text-red-600" : "text-slate-400"
                        )}>
                          {item.trend === 'up' ? '↑ Rising' : item.trend === 'down' ? '↓ Falling' : '• Stable'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-blue-700">{item.price}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{t('இன்று', 'Today')}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 p-5 rounded-3xl border border-blue-100">
                <h4 className="text-sm font-bold text-blue-900 mb-2">{t('AI கணிப்பு', 'AI Prediction')}</h4>
                <p className="text-xs text-blue-700 leading-relaxed">
                  {t(
                    'மஞ்சள் விலை அடுத்த வாரம் 5% அதிகரிக்க வாய்ப்புள்ளது. இப்போது விற்பனை செய்வதைத் தவிர்க்கவும்.',
                    'Turmeric prices are likely to rise by 5% next week. Avoid selling now for better profit.'
                  )}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-100 px-6 py-4 flex justify-between items-center z-20">
        <NavButton 
          active={activeTab === 'dashboard'} 
          onClick={() => setActiveTab('dashboard')}
          icon={<LayoutDashboard className="w-5 h-5" />}
          label={t('முகப்பு', 'Home')}
        />
        <NavButton 
          active={activeTab === 'advisor'} 
          onClick={() => setActiveTab('advisor')}
          icon={<Sprout className="w-5 h-5" />}
          label={t('ஆலோசனை', 'Advice')}
        />
        <NavButton 
          active={activeTab === 'scanner'} 
          onClick={() => setActiveTab('scanner')}
          icon={<Bug className="w-5 h-5" />}
          label={t('ஸ்கேன்', 'Scan')}
        />
        <NavButton 
          active={activeTab === 'market'} 
          onClick={() => setActiveTab('market')}
          icon={<TrendingUp className="w-5 h-5" />}
          label={t('சந்தை', 'Market')}
        />
      </nav>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 transition-all",
        active ? "text-agri-green scale-110" : "text-slate-400"
      )}
    >
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
      {active && <motion.div layoutId="nav-dot" className="w-1 h-1 bg-agri-green rounded-full mt-0.5" />}
    </button>
  );
}
