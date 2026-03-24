import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNutrition } from '../store/NutritionContext';
import { Camera as CameraIcon, X, Check, Loader2, Image as ImageIcon } from 'lucide-react';
import { cn } from '../lib/utils';

export const Camera: React.FC = () => {
  const navigate = useNavigate();
  const { addLog, qwenApiKey } = useNutrition();
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [mealType, setMealType] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'>('Lunch');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mealTypeMap: Record<string, string> = { Breakfast: '早餐', Lunch: '午餐', Dinner: '晚餐', Snack: '加餐' };

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        analyzeImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (base64Image: string) => {
    if (!qwenApiKey) {
      alert('请先在“我的”页面配置通义千问 API Key');
      return;
    }
    setAnalyzing(true);
    try {
      const prompt = `分析这张食物图片。请提供以下 JSON 格式的响应，不要包含任何 markdown 标记或其他文本：
      {
        "name": "菜品/食物名称",
        "weight": 预估重量（克，数字）,
        "calories": 预估总卡路里（数字）,
        "carbs": 预估总碳水化合物（克，数字）,
        "protein": 预估总蛋白质（克，数字）,
        "fat": 预估总脂肪（克，数字）,
        "breakdown": [
          {"name": "食材1", "percentage": 50, "weight": 100},
          {"name": "食材2", "percentage": 50, "weight": 100}
        ]
      }
      请根据视觉体积和典型份量尽可能准确地估算。`;

      const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${qwenApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'qwen-vl-max',
          messages: [
            {
              role: 'user',
              content: [
                { type: 'image_url', image_url: { url: base64Image } },
                { type: 'text', text: prompt }
              ]
            }
          ],
          response_format: { type: "json_object" }
        })
      });

      const data = await response.json();
      if (data.choices && data.choices[0] && data.choices[0].message) {
        let content = data.choices[0].message.content;
        content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const parsedData = JSON.parse(content);
        setResult(parsedData);
      } else {
        throw new Error('Invalid API response');
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      alert('识别失败，请检查 API Key 或稍后再试。');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleConfirm = () => {
    if (result && image) {
      addLog({
        name: result.name,
        weight: result.weight,
        mealType,
        calories: result.calories,
        carbs: result.carbs,
        protein: result.protein,
        fat: result.fat,
        imageUrl: image,
        breakdown: result.breakdown,
      });
      navigate('/');
    }
  };

  return (
    <div className="h-screen bg-black text-white flex flex-col animate-in slide-in-from-bottom duration-300">
      {/* Header */}
      <header className="p-6 flex justify-between items-center z-10">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-black/50 backdrop-blur-md">
          <X size={24} />
        </button>
        <div className="flex bg-black/50 backdrop-blur-md rounded-full p-1">
          {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map(type => (
            <button
              key={type}
              onClick={() => setMealType(type as any)}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-medium transition-colors",
                mealType === type ? "bg-white text-black" : "text-white/70 hover:text-white"
              )}
            >
              {mealTypeMap[type]}
            </button>
          ))}
        </div>
      </header>

      {/* Main Area */}
      <main className="flex-1 relative flex items-center justify-center overflow-hidden">
        {image ? (
          <img src={image} alt="Captured" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center justify-center text-white/50">
            <CameraIcon size={64} className="mb-4 opacity-50" />
            <p className="text-sm font-medium">点击扫描您的食物</p>
          </div>
        )}

        {/* Viewfinder Overlay */}
        {!image && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-64 h-64 border-2 border-white/30 rounded-3xl relative">
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-mint-400 rounded-tl-3xl" />
              <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-mint-400 rounded-tr-3xl" />
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-mint-400 rounded-bl-3xl" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-mint-400 rounded-br-3xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 border border-white/20 rounded-full flex items-center justify-center">
                <div className="w-1 h-1 bg-mint-400 rounded-full" />
              </div>
            </div>
          </div>
        )}

        {/* Analysis Overlay */}
        {analyzing && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-20">
            <Loader2 size={48} className="text-mint-400 animate-spin mb-4" />
            <p className="text-lg font-medium text-white tracking-wide">正在分析食材...</p>
            <p className="text-sm text-white/60 mt-2">正在估算体积和营养成分</p>
          </div>
        )}

        {/* Result Card */}
        {result && !analyzing && (
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/70 to-transparent z-20 animate-in slide-in-from-bottom-10">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-1">{result.name}</h2>
              <p className="text-mint-300 font-medium mb-6">预估 {result.weight}g • {result.calories} 千卡</p>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-coral-400 font-bold text-xl">{result.carbs}g</div>
                  <div className="text-white/60 text-xs uppercase tracking-wider mt-1">碳水</div>
                </div>
                <div className="text-center border-x border-white/10">
                  <div className="text-sky-400 font-bold text-xl">{result.protein}g</div>
                  <div className="text-white/60 text-xs uppercase tracking-wider mt-1">蛋白质</div>
                </div>
                <div className="text-center">
                  <div className="text-lemon-400 font-bold text-xl">{result.fat}g</div>
                  <div className="text-white/60 text-xs uppercase tracking-wider mt-1">脂肪</div>
                </div>
              </div>

              {result.breakdown && (
                <div className="mb-6 space-y-2">
                  <h3 className="text-sm font-semibold text-white/80 mb-3 uppercase tracking-wider">食材明细</h3>
                  {result.breakdown.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <span className="text-white/90">{item.name}</span>
                      <span className="text-white/50">{item.weight}g ({item.percentage}%)</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-3">
                <button 
                  onClick={() => { setImage(null); setResult(null); }}
                  className="flex-1 py-4 rounded-2xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors"
                >
                  重拍
                </button>
                <button 
                  onClick={handleConfirm}
                  className="flex-1 py-4 rounded-2xl bg-mint-500 text-white font-semibold flex items-center justify-center gap-2 hover:bg-mint-600 transition-colors shadow-lg shadow-mint-500/20"
                >
                  <Check size={20} /> 记录饮食
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Capture Controls */}
      {!image && (
        <footer className="p-8 pb-12 flex justify-center items-center z-10">
          <input 
            type="file" 
            accept="image/*" 
            capture="environment" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleCapture}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-20 h-20 rounded-full border-4 border-white/50 flex items-center justify-center active:scale-95 transition-transform"
          >
            <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center text-black/50">
              <ImageIcon size={28} />
            </div>
          </button>
        </footer>
      )}
    </div>
  );
};
