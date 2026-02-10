
import React, { useState } from 'react';
import { CreditCard, Bitcoin, Wallet, X, CheckCircle2 } from 'lucide-react';

interface Props {
  onClose: () => void;
  onPurchase: (points: number) => void;
}

const plans = [
  { id: 'small', points: 500, price: '$1', label: 'Starter' },
  { id: 'medium', points: 2000, price: '$2', label: 'Pro' },
  { id: 'large', points: 10000, price: '$4', label: 'Elite' },
];

const Pricing: React.FC<Props> = ({ onClose, onPurchase }) => {
  const [selectedPlan, setSelectedPlan] = useState(plans[1]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      onPurchase(selectedPlan.points);
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Wallet className="w-6 h-6 text-indigo-600" />
            Purchase Points
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {plans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan)}
                className={`p-6 rounded-2xl border-2 transition-all text-left relative overflow-hidden group ${
                  selectedPlan.id === plan.id
                    ? 'border-indigo-600 bg-indigo-50 shadow-md'
                    : 'border-slate-100 hover:border-indigo-200'
                }`}
              >
                <div className="font-bold text-slate-900 text-lg">{plan.points} Points</div>
                <div className="text-indigo-600 font-bold text-2xl mt-1">{plan.price}</div>
                <div className="text-xs text-slate-500 mt-2 font-medium uppercase tracking-wider">{plan.label}</div>
                {selectedPlan.id === plan.id && (
                  <CheckCircle2 className="absolute top-2 right-2 w-5 h-5 text-indigo-600" />
                )}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Select Payment Method</h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 border-2 border-slate-100 p-4 rounded-xl hover:bg-slate-50 transition-colors">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-slate-700">PayPal</span>
              </button>
              <button className="flex items-center justify-center gap-3 border-2 border-slate-100 p-4 rounded-xl hover:bg-slate-50 transition-colors">
                <Bitcoin className="w-5 h-5 text-orange-500" />
                <span className="font-semibold text-slate-700">Crypto</span>
              </button>
            </div>
          </div>

          <button
            onClick={handlePay}
            disabled={isProcessing}
            className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isProcessing ? 'Processing Payment...' : `Confirm & Pay ${selectedPlan.price}`}
          </button>
          
          <p className="text-center text-xs text-slate-400 mt-6">
            Payments are secured and encrypted. Digital goods are non-refundable.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
