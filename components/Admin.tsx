
import React, { useMemo } from 'react';
import { BarChart3, Users, Globe, Layout, X, Clock, TrendingUp } from 'lucide-react';
import { getUsageStats, getVisitCount } from '../services/storageService';

interface Props {
  onClose: () => void;
}

const Admin: React.FC<Props> = ({ onClose }) => {
  const stats = useMemo(() => getUsageStats(), []);
  const visitCount = useMemo(() => getVisitCount(), []);

  const topSettings = useMemo(() => {
    const counts: Record<string, number> = {};
    stats.forEach(s => {
      const key = `${s.language} - ${s.tone}`;
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  }, [stats]);

  const topCategories = useMemo(() => {
    const counts: Record<string, number> = {};
    stats.forEach(s => {
      counts[s.category] = (counts[s.category] || 0) + 1;
    });
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  }, [stats]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-auto">
      <div className="bg-slate-50 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-300">
        <div className="bg-white p-6 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Admin Analytics</h2>
              <p className="text-xs text-slate-500">Live system performance & trends</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Quick Stats */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-indigo-500" />
              <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">+12%</span>
            </div>
            <div className="text-3xl font-bold text-slate-900">{visitCount}</div>
            <div className="text-sm text-slate-500 font-medium">Total Visits</div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-slate-900">{stats.length}</div>
            <div className="text-sm text-slate-500 font-medium">Emails Generated</div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <Globe className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-slate-900">{Array.from(new Set(stats.map(s => s.email))).length}</div>
            <div className="text-sm text-slate-500 font-medium">Active Users</div>
          </div>

          {/* Detailed Lists */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-500" />
                Popular Language & Tone Combinations
              </h3>
              <div className="space-y-3">
                {topSettings.map(([key, count], i) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-400 w-4">{i + 1}.</span>
                      <span className="text-sm text-slate-700 font-medium">{key}</span>
                    </div>
                    <div className="flex items-center gap-4 flex-grow px-8">
                      <div className="h-1.5 bg-slate-100 rounded-full flex-grow overflow-hidden">
                        <div 
                          className="h-full bg-indigo-500 rounded-full" 
                          style={{ width: `${(count / stats.length) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-bold text-slate-900">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Layout className="w-4 h-4 text-indigo-500" />
                Top Categories
              </h3>
              <div className="space-y-3">
                {topCategories.map(([cat, count]) => (
                  <div key={cat} className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 font-medium">{cat}</span>
                    <span className="text-indigo-600 font-bold">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
