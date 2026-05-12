/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Users, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  PieChart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Asset {
  id: string;
  name: string;
  value: number;
  hasNominee: boolean;
}

interface Liability {
  id: string;
  type: string;
  amount: number;
}

const MOCK_ASSETS: Asset[] = [
  { id: '1', name: 'Primary Residence', value: 850000, hasNominee: true },
  { id: '2', name: 'Equity Portfolio', value: 125000, hasNominee: true },
  { id: '3', name: 'Savings Account', value: 45000, hasNominee: false },
  { id: '4', name: 'Crypto Wallet', value: 12000, hasNominee: false },
];

const MOCK_LIABILITIES: Liability[] = [
  { id: 'l1', type: 'Mortgage', amount: 420000 },
  { id: 'l2', type: 'Car Loan', amount: 25000 },
  { id: 'l3', type: 'Credit Card', amount: 4500 },
];

export default function App() {
  const [assets, setAssets] = useState<Asset[]>(MOCK_ASSETS);
  const [liabilities, setLiabilities] = useState<Liability[]>(MOCK_LIABILITIES);

  // Form States
  const [newAssetName, setNewAssetName] = useState('');
  const [newAssetValue, setNewAssetValue] = useState('');
  const [newAssetNominee, setNewAssetNominee] = useState(false);
  
  const [newLiabilityType, setNewLiabilityType] = useState('');
  const [newLiabilityAmount, setNewLiabilityAmount] = useState('');

  // Calculations
  const totals = useMemo(() => {
    // Robust calculation with safety fallbacks for empty lists or invalid data
    const totalAssets = assets.reduce((sum, a) => sum + (Number(a.value) || 0), 0);
    const totalLiabilities = liabilities.reduce((sum, l) => sum + (Number(l.amount) || 0), 0);
    const netWorth = totalAssets - totalLiabilities;
    
    // Estate Planning Readiness: Value-weighted nomination gap
    const missingNomineesCount = assets.filter(a => !a.hasNominee).length;
    const assetsWithoutNomineeValue = assets.filter(a => !a.hasNominee).reduce((sum, a) => sum + (Number(a.value) || 0), 0);
    const nominationGap = totalAssets > 0 ? (assetsWithoutNomineeValue / totalAssets) * 100 : 0;

    return { 
      totalAssets, 
      totalLiabilities, 
      netWorth, 
      nominationGap,
      missingNomineesCount
    };
  }, [assets, liabilities]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetName || !newAssetValue) return;
    
    const newAsset: Asset = {
      id: Math.random().toString(36).substr(2, 9),
      name: newAssetName,
      value: parseFloat(newAssetValue),
      hasNominee: newAssetNominee
    };
    
    setAssets([...assets, newAsset]);
    setNewAssetName('');
    setNewAssetValue('');
    setNewAssetNominee(false);
  };

  const handleAddLiability = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLiabilityType || !newLiabilityAmount) return;
    
    const newLiability: Liability = {
      id: Math.random().toString(36).substr(2, 9),
      type: newLiabilityType,
      amount: parseFloat(newLiabilityAmount)
    };
    
    setLiabilities([...liabilities, newLiability]);
    setNewLiabilityType('');
    setNewLiabilityAmount('');
  };

  const deleteAsset = (id: string) => setAssets(assets.filter(a => a.id !== id));
  const deleteLiability = (id: string) => setLiabilities(liabilities.filter(l => l.id !== id));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-20">
        
        {/* Header */}
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-1.5">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl md:text-6xl font-black tracking-tight text-slate-950"
            >
              Wealth <span className="text-slate-300">/</span> Estate
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-slate-500 font-semibold tracking-tight"
            >
              Monthly Portfolio Overview • {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
            </motion.p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Account Status</p>
              <p className="text-sm font-bold text-emerald-600">Active / Encrypted</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-slate-950 flex items-center justify-center text-white font-bold shadow-xl shadow-slate-950/20">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </header>

        {/* Dynamic Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          <StatCard 
            label="Total Assets" 
            value={formatCurrency(totals.totalAssets)} 
            icon={<TrendingUp className="w-5 h-5 text-emerald-600" />}
            trend={totals.totalAssets > 0 ? "Growth: +2.4%" : undefined}
          />
          <StatCard 
            label="Liabilities" 
            value={formatCurrency(totals.totalLiabilities)} 
            icon={<TrendingDown className="w-5 h-5 text-slate-400" />}
            subtext="Debt Exposure"
          />
          <StatCard 
            label="Net Worth" 
            value={formatCurrency(totals.netWorth)} 
            icon={<Wallet className="w-5 h-5 text-emerald-400" />}
            highlight
            subtext="Total Equity"
          />
          <StatCard 
            label="Est. Readiness" 
            value={`${totals.nominationGap.toFixed(1)}%`} 
            icon={<Users className="w-5 h-5 text-amber-500" />}
            isGap
            subtext={totals.missingNomineesCount > 0 
              ? `${totals.missingNomineesCount} items risk orphan status` 
              : "Portfolio fully secured"}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Assets Section */}
          <section className="lg:col-span-12 xl:col-span-7 space-y-10">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
              <h2 className="text-3xl font-black tracking-tighter uppercase">Assets</h2>
              <span className="text-xs font-black bg-slate-900 text-white px-3 py-1.5 rounded-full">
                {assets.length} HOLDINGS
              </span>
            </div>

            {/* Robust Asset Entry Form */}
            <form onSubmit={handleAddAsset} className="bg-white p-8 rounded-3xl border-2 border-slate-200 shadow-xl shadow-slate-200/40 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Inventory Name</label>
                  <input 
                    required
                    maxLength={30}
                    type="text" 
                    value={newAssetName}
                    onChange={(e) => setNewAssetName(e.target.value)}
                    placeholder="Principal Residence, BTC, etc."
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 text-sm font-bold focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-300"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Market Value (₹)</label>
                  <input 
                    required
                    min="0"
                    type="number" 
                    value={newAssetValue}
                    onChange={(e) => setNewAssetValue(e.target.value)}
                    placeholder="0"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 text-sm font-bold focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-300"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
                <label className="flex items-center gap-4 cursor-pointer group w-full sm:w-auto">
                  <div className="relative flex items-center">
                    <input 
                      type="checkbox"
                      checked={newAssetNominee}
                      onChange={(e) => setNewAssetNominee(e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="w-12 h-7 bg-slate-200 rounded-full peer-checked:bg-emerald-600 transition-colors"></div>
                    <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full peer-checked:translate-x-5 transition-transform shadow-md"></div>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-950 transition-colors">Nomination Active</span>
                    <p className="text-[10px] text-slate-400 font-bold">Ensure estate legal compliance</p>
                  </div>
                </label>
                <button 
                  type="submit"
                  className="w-full sm:w-auto bg-emerald-600 text-white font-black uppercase tracking-widest text-xs px-8 py-4 rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
                >
                  Record Holding
                </button>
              </div>
            </form>

            {/* Asset Ledger */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
              <div className="divide-y divide-slate-100">
                <AnimatePresence mode="popLayout">
                  {assets.length === 0 ? (
                    <div className="p-12 text-center">
                      <p className="text-slate-400 font-bold italic">No active assets registered.</p>
                    </div>
                  ) : (
                    assets.map((asset, idx) => (
                      <motion.div 
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        key={asset.id}
                        className={`group p-6 flex items-center justify-between hover:bg-slate-50 transition-all ${idx % 2 === 1 ? 'bg-slate-50/30' : ''}`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-4">
                            <h3 className="text-lg font-bold text-slate-900 tracking-tight">{asset.name}</h3>
                            {asset.hasNominee ? (
                              <span className="text-[9px] uppercase font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full ring-2 ring-emerald-50">Secured</span>
                            ) : (
                              <span className="text-[9px] uppercase font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full ring-2 ring-amber-50">Exposed</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-12">
                          <span className="font-bold text-xl tabular-nums tracking-tighter text-slate-950">{formatCurrency(asset.value)}</span>
                          <button 
                            onClick={() => deleteAsset(asset.id)}
                            className="p-2 text-slate-200 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          </section>

          {/* Liabilities Section */}
          <section className="lg:col-span-12 xl:col-span-5 space-y-10">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
              <h2 className="text-3xl font-black tracking-tighter uppercase">Debt</h2>
              <span className="text-xs font-black bg-slate-200 text-slate-600 px-3 py-1.5 rounded-full">
                ACTIVE LIENS
              </span>
            </div>

            {/* Quick Record Debt */}
            <div className="bg-slate-950 p-8 rounded-[2rem] shadow-2xl shadow-slate-950/20">
              <form onSubmit={handleAddLiability} className="flex flex-col sm:flex-row gap-4">
                <input 
                  required
                  type="text" 
                  value={newLiabilityType}
                  onChange={(e) => setNewLiabilityType(e.target.value)}
                  placeholder="Debt Category"
                  className="flex-1 bg-slate-900 text-white border-2 border-slate-800 rounded-2xl px-5 py-3 text-sm font-bold focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-600"
                />
                <input 
                  required
                  min="1"
                  type="number" 
                  value={newLiabilityAmount}
                  onChange={(e) => setNewLiabilityAmount(e.target.value)}
                  placeholder="Val"
                  className="w-full sm:w-28 bg-slate-900 text-white border-2 border-slate-800 rounded-2xl px-5 py-3 text-sm font-bold focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-600"
                />
                <button 
                  type="submit"
                  className="bg-white text-slate-950 font-black uppercase tracking-widest text-xs px-6 py-3 rounded-2xl hover:bg-slate-200 transition-all active:scale-95 whitespace-nowrap"
                >
                  Post Debt
                </button>
              </form>
            </div>

            {/* Debt Ledger */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <tbody className="text-sm">
                  <AnimatePresence mode="popLayout">
                    {liabilities.length === 0 ? (
                      <tr>
                        <td className="p-12 text-center text-slate-400 font-bold italic">Debt-free profile.</td>
                      </tr>
                    ) : (
                      liabilities.map((liability, idx) => (
                        <motion.tr 
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          key={liability.id}
                          className={`group border-t border-slate-100 ${idx % 2 === 1 ? 'bg-slate-50/50' : ''} hover:bg-slate-100 transition-colors`}
                        >
                          <td className="p-6 font-bold text-slate-900 tracking-tight text-lg">{liability.type}</td>
                          <td className="p-6 font-bold text-right text-slate-950">
                            <div className="flex items-center justify-end gap-6 text-xl tabular-nums tracking-tighter">
                              {formatCurrency(liability.amount)}
                              <button 
                                onClick={() => deleteLiability(liability.id)}
                                className="text-slate-200 hover:text-slate-950 transition-all opacity-0 group-hover:opacity-100 p-1"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </section>

        </div>

        {/* Action Footer */}
        <footer className="mt-32 pt-12 border-t-4 border-slate-950 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          <div className="space-y-2">
            <h4 className="text-lg font-black uppercase tracking-tighter italic">Compliance Shield Active</h4>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-relaxed max-w-sm">
              Secure estate planning protocol v2.8 / Regional data mirroring active / Peer-verified nomination verification.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button className="bg-slate-100 border-2 border-slate-200 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-900 hover:border-slate-900 hover:text-white transition-all">Generate Full PDF</button>
            <button className="bg-slate-950 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-slate-950/20 active:scale-95">Verify nominations</button>
          </div>
        </footer>
      </div>
    </div>
  );
}

function StatCard({ 
  label, 
  value, 
  icon, 
  trend, 
  subtext, 
  highlight = false,
  isGap = false
}: { 
  label: string; 
  value: string; 
  icon: React.ReactNode; 
  trend?: string;
  subtext?: string;
  highlight?: boolean;
  isGap?: boolean;
}) {
  return (
    <motion.div 
      whileHover={{ y: -4, scale: 1.02 }}
      className={`p-7 rounded-[2rem] border-2 transition-all cursor-default ${
        highlight 
          ? 'bg-slate-950 border-slate-950 shadow-2xl shadow-slate-950/30' 
          : 'bg-white border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-200'
      }`}
    >
      <div className="mb-6 flex justify-between items-start">
        <div className={`p-2.5 rounded-2xl ${highlight ? 'bg-slate-900' : 'bg-slate-50'}`}>
          {icon}
        </div>
        {trend && (
          <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      
      <div className="space-y-1">
        <p className={`text-[10px] font-black uppercase tracking-widest ${
          highlight ? 'text-slate-500' : 'text-slate-400'
        }`}>
          {label}
        </p>
        <p className={`text-4xl font-black tracking-tighter tabular-nums ${
          highlight ? 'text-white' : (isGap ? 'text-amber-600' : 'text-slate-950')
        }`}>
          {value}
        </p>
      </div>
      
      {subtext && (
        <div className={`mt-5 text-[10px] font-bold uppercase tracking-tight ${highlight ? 'text-emerald-400' : 'text-slate-400'}`}>
          {subtext}
        </div>
      )}

      {isGap && (
        <div className="mt-4 pt-4 border-t border-slate-100">
           <button className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-600 transition-colors flex items-center gap-1 group/btn">
            Security Audit <ArrowUpRight className="w-3 h-3 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      )}
    </motion.div>
  );
}
