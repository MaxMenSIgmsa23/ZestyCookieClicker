import React, { useState } from 'react';

interface PromoCodePanelProps {
  onUsePromoCode: (code: string) => void;
}

export const PromoCodePanel = ({ onUsePromoCode }: PromoCodePanelProps) => {
  const [promoCode, setPromoCode] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!promoCode.trim()) {
      setMessage('Please enter a promo code!');
      return;
    }
    
    if (promoCode.toUpperCase() === 'BONUS') {
      onUsePromoCode(promoCode);
      setMessage('🎉 BONUS code activated! You got 35M cookies!');
      setPromoCode('');
    } else {
      setMessage('❌ Invalid promo code. Try again!');
    }
    
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="bg-gradient-to-br from-green-100 to-emerald-200 rounded-xl p-6 shadow-lg border-2 border-green-300">
      <h2 className="text-2xl font-bold text-green-800 mb-4 flex items-center gap-2">
        <span className="text-3xl">🎁</span>
        Promo Codes
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Enter promo code..."
            className="w-full px-4 py-2 border-2 border-green-300 rounded-lg focus:border-green-500 focus:outline-none text-center font-mono text-lg"
            maxLength={20}
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 hover:scale-105"
        >
          🚀 Activate Code
        </button>
        
        {message && (
          <div className={`text-center p-2 rounded-lg ${
            message.includes('🎉') 
              ? 'bg-green-200 text-green-800' 
              : 'bg-red-200 text-red-800'
          }`}>
            {message}
          </div>
        )}
      </form>
      
      <div className="mt-4 text-xs text-green-600 text-center">
        💡 Hint: Try "BONUS" for 35M cookies!
      </div>
    </div>
  );
};