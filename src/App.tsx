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
  PieChart,
  FileText,
  ShieldAlert,
  HelpCircle,
  LogOut,
  UserMinus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type EntryType = 'asset' | 'liability';

interface Nominee {
  name: string;
}

interface Entry {
  id: string;
  type: EntryType;
  category: string;
  name: string;
  value: number;
  hasNominee: boolean;
  nominees: Nominee[];
}

const ASSET_CATEGORIES = [
  'Stock Portfolio',
  'Home',
  'Savings Account',
  'FD',
  'Insurance',
  'Other'
];

const LIABILITY_CATEGORIES = [
  'Home Loan',
  'Car Loan',
  'Credit Card',
  'Other'
];

const MOCK_ENTRIES: Entry[] = [
  { id: '1', type: 'asset', category: 'Home', name: 'Primary Residence', value: 850000, hasNominee: true, nominees: [{ name: 'Spouse' }] },
  { id: '2', type: 'asset', category: 'Stock Portfolio', name: 'Equity Portfolio', value: 125000, hasNominee: true, nominees: [{ name: 'Child 1' }] },
  { id: '3', type: 'asset', category: 'Savings Account', name: 'Emergency Fund', value: 45000, hasNominee: false, nominees: [] },
  { id: 'l1', type: 'liability', category: 'Home Loan', name: 'Mortgage', value: 420000, hasNominee: false, nominees: [] },
];

export default function App() {
  const [entries, setEntries] = useState<Entry[]>(MOCK_ENTRIES);
  const [activeModal, setActiveModal] = useState<'assets' | 'liabilities' | 'readiness' | null>(null);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  const closeModal = () => setActiveModal(null);
  const closeSideMenu = () => setIsSideMenuOpen(false);

  // Form States
  const [newType, setNewType] = useState<EntryType>('asset');
  const [newCategory, setNewCategory] = useState(ASSET_CATEGORIES[0]);
  const [newName, setNewName] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newHasNominee, setNewHasNominee] = useState(false);
  const [newNomineeCount, setNewNomineeCount] = useState<number>(0);
  const [newNominees, setNewNominees] = useState<Nominee[]>([]);

  // Calculations
  const totals = useMemo(() => {
    const assets = entries.filter(e => e.type === 'asset');
    const liabilities = entries.filter(e => e.type === 'liability');
    
    const totalAssets = assets.reduce((sum, a) => sum + (Number(a.value) || 0), 0);
    const totalLiabilities = liabilities.reduce((sum, l) => sum + (Number(l.value) || 0), 0);
    const netWorth = totalAssets - totalLiabilities;
    
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
  }, [entries]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleTypeChange = (type: EntryType) => {
    setNewType(type);
    setNewCategory(type === 'asset' ? ASSET_CATEGORIES[0] : LIABILITY_CATEGORIES[0]);
  };

  const handleNomineeCountChange = (count: number) => {
    const validCount = Math.max(0, Math.min(10, count)); // limit to 10
    setNewNomineeCount(validCount);
    
    // Adjust nominees array size
    setNewNominees(prev => {
      const updated = [...prev];
      if (updated.length < validCount) {
        while (updated.length < validCount) {
          updated.push({ name: '' });
        }
      } else if (updated.length > validCount) {
        updated.splice(validCount);
      }
      return updated;
    });
  };

  const updateNomineeName = (index: number, name: string) => {
    setNewNominees(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], name };
      return updated;
    });
  };

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newValue) return;
    
    const newEntry: Entry = {
      id: Math.random().toString(36).substr(2, 9),
      type: newType,
      category: newCategory,
      name: newName,
      value: parseFloat(newValue),
      hasNominee: newType === 'asset' ? newHasNominee : false,
      nominees: newType === 'asset' && newHasNominee ? newNominees : []
    };
    
    setEntries([...entries, newEntry]);
    
    // Reset form
    setNewName('');
    setNewValue('');
    setNewHasNominee(false);
    setNewNomineeCount(0);
    setNewNominees([]);
  };

  const deleteEntry = (id: string) => setEntries(entries.filter(e => e.id !== id));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-20">
        
        {/* Header */}
        <header className="mb-8 md:mb-12 space-y-6 md:space-y-8">
          {/* Top Nav */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 md:gap-6 pb-6 border-b-2 border-slate-200/50">
             {/* Logo & Mobile Profile */}
             <div className="flex items-center justify-between self-stretch md:self-auto">
               <div className="flex items-center gap-3">
                  <div className="h-10 w-10 md:h-12 md:w-12 shrink-0 rounded-2xl bg-slate-950 flex items-center justify-center text-white font-bold shadow-xl shadow-slate-950/20">
                    <PieChart className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <span className="text-xl md:text-2xl font-black tracking-tighter text-slate-950">W<span className="text-slate-300">/</span>E</span>
               </div>
               {/* Mobile Profile Trigger */}
               <button 
                 onClick={() => setIsSideMenuOpen(true)}
                 className="md:hidden h-10 w-10 shrink-0 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border-2 border-slate-200 hover:bg-slate-200 transition-colors"
               >
                 <Users className="w-5 h-5" />
               </button>
             </div>
             
             {/* Navigation Links */}
             <nav className="flex overflow-x-auto hide-scrollbar items-center gap-1 md:gap-2 bg-white px-2 py-2 rounded-2xl md:rounded-full shadow-sm border border-slate-200">
               {['Overview', 'Stocks', 'Mutual Funds', 'Budget', 'Will'].map((link) => (
                 <button
                   key={link}
                   className={`whitespace-nowrap text-xs md:text-sm font-bold tracking-tight px-3 py-2 md:px-4 md:py-2 rounded-xl transition-all shrink-0 ${
                     link === 'Overview' 
                       ? 'bg-slate-950 text-white shadow-md' 
                       : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                   }`}
                 >
                   {link}
                 </button>
               ))}
             </nav>
             
             {/* Desktop Profile Status */}
             <div className="items-center gap-4 hidden md:flex shrink-0">
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Account Status</p>
                  <p className="text-sm font-bold text-emerald-600">Secure</p>
                </div>
                <button 
                  onClick={() => setIsSideMenuOpen(true)}
                  className="h-10 w-10 shrink-0 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border-2 border-slate-200 hover:bg-slate-200 transition-colors"
                >
                  <Users className="w-5 h-5" />
                </button>
             </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-1.5">
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-950"
              >
                Dashboard
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
          </div>
        </header>

        {/* Dynamic Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-20">
          <StatCard 
            label="Total Assets" 
            value={formatCurrency(totals.totalAssets)} 
            icon={<TrendingUp className="w-5 h-5 text-emerald-600" />}
            trend={totals.totalAssets > 0 ? "Growth: +2.4%" : undefined}
            onClick={() => setActiveModal('assets')}
          />
          <StatCard 
            label="Liabilities" 
            value={formatCurrency(totals.totalLiabilities)} 
            icon={<TrendingDown className="w-5 h-5 text-slate-400" />}
            subtext="Debt Exposure"
            onClick={() => setActiveModal('liabilities')}
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
            onClick={() => setActiveModal('readiness')}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16">
          
          {/* Main Content Area */}
          <section className="lg:col-span-12 space-y-6 md:space-y-10">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
              <h2 className="text-2xl md:text-3xl font-black tracking-tighter uppercase">Record Entry</h2>
            </div>

            {/* Unified Form Pane */}
            <form onSubmit={handleAddEntry} className="bg-white p-5 md:p-8 rounded-3xl border-2 border-slate-200 shadow-xl shadow-slate-200/40 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Entry Type */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Entry Type</label>
                  <select 
                    value={newType}
                    onChange={(e) => handleTypeChange(e.target.value as EntryType)}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 text-sm font-bold focus:outline-none focus:border-emerald-500 transition-all appearance-none"
                  >
                    <option value="asset">Asset (Holding)</option>
                    <option value="liability">Liability (Debt)</option>
                  </select>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Category</label>
                  <select 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 text-sm font-bold focus:outline-none focus:border-emerald-500 transition-all appearance-none"
                  >
                    {newType === 'asset' 
                      ? ASSET_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)
                      : LIABILITY_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)
                    }
                  </select>
                </div>

                {/* Name */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Identifier Name</label>
                  <input 
                    required
                    maxLength={40}
                    type="text" 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder={newType === 'asset' ? "HDFC Savings, Index Fund..." : "HDFC Loan, Visa Card..."}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 text-sm font-bold focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Value */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Market Value (₹)</label>
                  <input 
                    required
                    min="0"
                    type="number" 
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    placeholder="0"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 text-sm font-bold focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-300"
                  />
                </div>

                {/* Nomination Toggle (Only for Assets) */}
                {newType === 'asset' && (
                  <div className="md:col-span-2 flex items-center pt-2">
                    <label className="flex items-center gap-4 cursor-pointer group w-full sm:w-auto">
                      <div className="relative flex items-center">
                        <input 
                          type="checkbox"
                          checked={newHasNominee}
                          onChange={(e) => setNewHasNominee(e.target.checked)}
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
                  </div>
                )}
              </div>

              {/* Dynamic Nominee Section */}
              <AnimatePresence>
                {newType === 'asset' && newHasNominee && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden border-t-2 border-slate-100 pt-6 mt-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Number of Nominees</label>
                        <input 
                          required
                          min="1"
                          max="10"
                          type="number" 
                          value={newNomineeCount || ''}
                          onChange={(e) => handleNomineeCountChange(parseInt(e.target.value) || 0)}
                          placeholder="e.g. 2"
                          className="w-full bg-emerald-50 border-2 border-emerald-100 rounded-2xl px-5 py-3 text-sm font-bold focus:outline-none focus:border-emerald-500 transition-all placeholder:text-emerald-300"
                        />
                      </div>
                      
                      <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <AnimatePresence>
                          {newNominees.map((nominee, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="space-y-2"
                            >
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nominee {idx + 1} Name</label>
                              <input 
                                required
                                type="text"
                                value={nominee.name}
                                onChange={(e) => updateNomineeName(idx, e.target.value)}
                                placeholder="Full Name"
                                className="w-full bg-white border-2 border-slate-100 rounded-2xl px-5 py-3 text-sm font-bold focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-300"
                              />
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-end pt-4 border-t-2 border-slate-100 mt-6">
                <button 
                  type="submit"
                  className="w-full sm:w-auto bg-slate-950 text-white font-black uppercase tracking-widest text-xs px-10 py-4 rounded-2xl hover:bg-emerald-600 transition-all shadow-lg shadow-slate-950/20 hover:shadow-emerald-600/30 active:scale-95"
                >
                  Post Entry to Ledger
                </button>
              </div>
            </form>
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

      {/* Modals & Overlays */}
      <AnimatePresence>
        {isSideMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeSideMenu}
              className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-[70] w-[85%] sm:w-full max-w-sm bg-white shadow-2xl flex flex-col border-l border-slate-200"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <span className="text-lg font-black tracking-tight uppercase">Menu</span>
                <button onClick={closeSideMenu} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors">
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-8 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-slate-100 border-2 border-slate-200 rounded-full flex items-center justify-center text-slate-400">
                    <Users className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black tracking-tight text-slate-900">John Doe</h3>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">View Profile</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto py-4">
                <nav className="flex flex-col px-4 gap-1">
                  <button className="flex items-center gap-4 w-full p-4 rounded-2xl hover:bg-slate-50 text-left transition-colors group">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 group-hover:text-emerald-600 group-hover:bg-emerald-50 transition-colors">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-sm font-bold text-slate-900">Family Members</span>
                      <span className="block text-[10px] uppercase tracking-widest text-slate-400">Manage dependents</span>
                    </div>
                  </button>

                  <button className="flex items-center gap-4 w-full p-4 rounded-2xl hover:bg-slate-50 text-left transition-colors group">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 group-hover:text-emerald-600 group-hover:bg-emerald-50 transition-colors">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-sm font-bold text-slate-900">Tax Reports</span>
                      <span className="block text-[10px] uppercase tracking-widest text-slate-400">Download summaries</span>
                    </div>
                  </button>

                  <button className="flex items-center gap-4 w-full p-4 rounded-2xl hover:bg-slate-50 text-left transition-colors group">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 group-hover:text-amber-600 group-hover:bg-amber-50 transition-colors">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-sm font-bold text-slate-900">Nominee Exposure Report</span>
                      <span className="block text-[10px] uppercase tracking-widest text-slate-400">View risk analysis</span>
                    </div>
                  </button>

                  <button className="flex items-center gap-4 w-full p-4 rounded-2xl hover:bg-slate-50 text-left transition-colors group">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 group-hover:text-emerald-600 group-hover:bg-emerald-50 transition-colors">
                      <HelpCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-sm font-bold text-slate-900">Need Help</span>
                      <span className="block text-[10px] uppercase tracking-widest text-slate-400">Support & FAQ</span>
                    </div>
                  </button>
                </nav>
              </div>

              <div className="p-6 border-t border-slate-100 space-y-2">
                <button className="flex items-center gap-3 w-full p-4 rounded-2xl hover:bg-slate-50 text-left transition-colors text-slate-600 hover:text-slate-900 font-bold text-sm">
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
                <button className="flex items-center gap-3 w-full p-4 rounded-2xl hover:bg-rose-50 text-left transition-colors text-slate-600 hover:text-rose-600 font-bold text-sm">
                  <UserMinus className="w-5 h-5" />
                  Delete Account
                </button>
              </div>
            </motion.div>
          </>
        )}
        
        {activeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-slate-900/60 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 100 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 100 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl max-h-[90vh] md:max-h-[85vh] flex flex-col bg-slate-50 rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden md:border border-slate-200"
            >
              <div className="p-6 md:px-10 md:py-8 border-b border-slate-200 flex justify-between items-center bg-white shrink-0">
                <div>
                  <h3 className="text-xl md:text-2xl font-black tracking-tighter uppercase whitespace-normal truncate sm:whitespace-nowrap pr-4">
                    {activeModal === 'assets' && "Assets Summary"}
                    {activeModal === 'liabilities' && "Debt Summary"}
                    {activeModal === 'readiness' && "Readiness & Gap Analysis"}
                  </h3>
                </div>
                <button 
                  onClick={closeModal}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 md:p-10 overflow-y-auto w-full">
                <div className="divide-y divide-slate-100 bg-white border border-slate-200 rounded-[2rem] overflow-hidden">
                  {activeModal === 'assets' && (
                    <AssetList entries={entries} formatCurrency={formatCurrency} deleteEntry={deleteEntry} />
                  )}
                  {activeModal === 'liabilities' && (
                    <LiabilityList entries={entries} formatCurrency={formatCurrency} deleteEntry={deleteEntry} />
                  )}
                  {activeModal === 'readiness' && (
                    <ReadinessList entries={entries} formatCurrency={formatCurrency} totals={totals} />
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AssetList({ entries, formatCurrency, deleteEntry }: any) {
  const assets = entries.filter((e: any) => e.type === 'asset');
  
  if (assets.length === 0) {
    return <div className="p-12 text-center text-slate-400 font-bold italic">No active assets registered.</div>;
  }

  return (
    <>
      {assets.map((asset: any, idx: number) => (
        <div key={asset.id} className={`group p-6 flex flex-col gap-3 hover:bg-slate-50 transition-all ${idx % 2 === 1 ? 'bg-slate-50/30' : ''}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h4 className="text-lg font-bold text-slate-900 tracking-tight">{asset.name}</h4>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{asset.category}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <span className="font-bold text-xl tabular-nums tracking-tighter text-slate-950">{formatCurrency(asset.value)}</span>
              <button onClick={() => deleteEntry(asset.id)} className="p-2 text-slate-200 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-1">
            {asset.hasNominee ? (
              <div className="flex items-center gap-2">
                <span className="text-[9px] uppercase font-black text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full ring-2 ring-emerald-50">Secured</span>
                <span className="text-xs font-semibold text-slate-500">
                  {asset.nominees.length} Nominee(s): {asset.nominees.map((n: any) => n.name).join(', ')}
                </span>
              </div>
            ) : (
              <span className="text-[9px] uppercase font-black text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full ring-2 ring-amber-50">Exposed</span>
            )}
          </div>
        </div>
      ))}
    </>
  );
}

function LiabilityList({ entries, formatCurrency, deleteEntry }: any) {
  const liabilities = entries.filter((e: any) => e.type === 'liability');
  
  if (liabilities.length === 0) {
    return <div className="p-12 text-center text-slate-400 font-bold italic">Debt-free profile.</div>;
  }

  return (
    <>
      {liabilities.map((liability: any, idx: number) => (
        <div key={liability.id} className={`group p-6 flex flex-col gap-3 hover:bg-slate-50 transition-all ${idx % 2 === 1 ? 'bg-slate-50/30' : ''}`}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h4 className="text-lg font-bold text-slate-900 tracking-tight">{liability.name}</h4>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{liability.category}</p>
            </div>
            <div className="flex items-center gap-6">
              <span className="font-bold text-xl tabular-nums tracking-tighter text-slate-950">{formatCurrency(liability.value)}</span>
              <button onClick={() => deleteEntry(liability.id)} className="p-2 text-slate-200 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

function ReadinessList({ entries, formatCurrency, totals }: any) {
  const assets = entries.filter((e: any) => e.type === 'asset');

  return (
    <div className="p-6 md:p-8 flex flex-col gap-8">
      {/* Overview Block */}
      <div className="flex flex-col md:flex-row gap-6 p-6 bg-slate-50 border-2 border-slate-100 rounded-3xl">
        <div className="flex-1 space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Vulnerability Gap</p>
          <p className="text-3xl font-black tracking-tighter tabular-nums text-amber-600">{totals.nominationGap.toFixed(1)}%</p>
        </div>
        <div className="flex-1 space-y-1 md:border-l-2 md:border-slate-200 md:pl-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Items at Risk</p>
          <p className="text-3xl font-black tracking-tighter tabular-nums text-slate-950">{totals.missingNomineesCount}</p>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 px-2">Asset Level Analysis</h4>
        <div className="divide-y divide-slate-100 border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
          {assets.map((asset: any) => (
            <div key={asset.id} className="p-4 md:p-6 bg-white flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <h5 className="font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  {asset.name}
                  {asset.hasNominee ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Users className="w-4 h-4 text-amber-500" />
                  )}
                </h5>
                <p className="text-xs font-semibold text-slate-500 mt-1">Value: {formatCurrency(asset.value)}</p>
              </div>
              <div className="w-full sm:w-auto mt-2 sm:mt-0">
                {asset.hasNominee ? (
                   <div className="px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-2xl w-full sm:w-auto">
                     <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Nominees Assigned</p>
                     <p className="text-sm font-semibold text-emerald-900 mt-0.5">
                       {asset.nominees.map((n: any) => n.name).join(', ')}
                     </p>
                   </div>
                ) : (
                   <div className="px-4 py-2 bg-amber-50 border border-amber-100 rounded-2xl w-full sm:w-auto">
                     <p className="text-[10px] font-black uppercase tracking-widest text-amber-700">Risk Detected</p>
                     <p className="text-sm font-semibold text-amber-900 mt-0.5">Missing Nomination</p>
                   </div>
                )}
              </div>
            </div>
          ))}
          {assets.length === 0 && (
            <div className="p-8 text-center text-slate-400 font-bold italic">No assets to analyze.</div>
          )}
        </div>
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
  isGap = false,
  onClick
}: { 
  label: string; 
  value: string; 
  icon: React.ReactNode; 
  trend?: string;
  subtext?: string;
  highlight?: boolean;
  isGap?: boolean;
  onClick?: () => void;
}) {
  return (
    <motion.div 
      onClick={onClick}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`p-7 rounded-[2rem] border-2 transition-all ${onClick ? 'cursor-pointer hover:border-emerald-200' : 'cursor-default'} ${
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
