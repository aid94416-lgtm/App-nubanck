import React, { useState, useMemo } from 'react';
import {
  Eye,
  EyeOff,
  QrCode,
  Send,
  ArrowDownLeft,
  CreditCard,
  Barcode,
  Smartphone,
  PiggyBank,
  TrendingUp,
  ShoppingBag,
  Home,
  DollarSign,
  Bell,
  User,
  ChevronRight,
  X,
  CheckCircle2,
  Lock,
  Unlock,
  ArrowUpRight,
  Sparkles,
  Search,
  Copy,
  Check,
  Bitcoin,
  ShieldCheck,
  SlidersHorizontal,
  Edit2,
  Sun,
  Moon
} from 'lucide-react';

const INITIAL_BALANCE = 5000.00;
const INITIAL_CREDIT_LIMIT = 10000.00;
const INITIAL_CREDIT_USED = 1250.00;

const INITIAL_CARDS = [
  {
    id: 'card-phys',
    name: 'Cartão Físico Black',
    type: 'físico',
    number: '5412 •••• •••• 9012',
    fullNumber: '5412 3890 1234 9012',
    expiry: '11/31',
    cvv: '891',
    locked: false,
    limit: 10000,
    color: 'from-zinc-900 via-zinc-800 to-black',
    tag: 'Ultravioleta'
  },
  {
    id: 'card-virt-1',
    name: 'Cartão Virtual Online',
    type: 'virtual',
    number: '4221 •••• •••• 4410',
    fullNumber: '4221 8812 9011 4410',
    expiry: '08/29',
    cvv: '312',
    locked: false,
    limit: 5000,
    color: 'from-[#820AD1] to-[#5B0099]',
    tag: 'Recorrente'
  }
];

const INITIAL_CAIXINHAS = [
  { id: 1, name: 'Reserva de Emergência', balance: 5000.00, cdiPercent: 100, goal: 15000 },
  { id: 2, name: 'Viagem dos Sonhos', balance: 2500.00, cdiPercent: 102, goal: 8000 }
];

const INITIAL_TRANSACTIONS = [
  { id: 101, type: 'pix_received', title: 'Pix recebido de Carlos M.', value: 1500.00, date: 'Hoje, 14:32', category: 'Pix' },
  { id: 102, type: 'card_buy', title: 'Supermercado Pão de Açúcar', value: 215.40, date: 'Ontem, 18:45', category: 'Cartão de Crédito' }
];

const formatBRL = (val) ="> new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

export default function App() {
  const [userName, setUserName] = useState('Natan');
  const [darkMode, setDarkMode] = useState(true);
  const [showBalance, setShowBalance] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [toastMessage, setToastMessage] = useState(null);

  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [adjustedLimit, setAdjustedLimit] = useState(INITIAL_CREDIT_LIMIT);
  const [creditUsed, setCreditUsed] = useState(INITIAL_CREDIT_USED);
  const [caixinhas, setCaixinhas] = useState(INITIAL_CAIXINHAS);
  const [cards, setCards] = useState(INITIAL_CARDS);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);

  const [customBalanceInput, setCustomBalanceInput] = useState('');
  const [customLimitInput, setCustomLimitInput] = useState('');
  const [customInvoiceInput, setCustomInvoiceInput] = useState('');
  const [customUserNameInput, setCustomUserNameInput] = useState('Natan');

  const [activeModal, setActiveModal] = useState(null);
  const [pinInput, setPinInput] = useState(['', '', '', '']);
  const [pendingAction, setPendingAction] = useState(null);
  const [modalStep, setModalStep] = useState(1);
  const [amountInput, setAmountInput] = useState('');
  const [pixKeyInput, setPixKeyInput] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const closeModal = () => {
    setActiveModal(null);
    setModalStep(1);
    setAmountInput('');
    setPixKeyInput('');
  };

  const openBalanceEditModal = () => {
    setCustomBalanceInput(balance.toString());
    setCustomLimitInput(adjustedLimit.toString());
    setCustomInvoiceInput(creditUsed.toString());
    setCustomUserNameInput(userName);
    setActiveModal('edit_money');
  };

  const handleSaveCustomMoney = () => {
    if (customUserNameInput.trim()) setUserName(customUserNameInput.trim());
    if (customBalanceInput !== '') setBalance(parseFloat(customBalanceInput) || 0);
    if (customLimitInput !== '') setAdjustedLimit(parseFloat(customLimitInput) || 0);
    if (customInvoiceInput !== '') setCreditUsed(parseFloat(customInvoiceInput) || 0);
    showToast(`Valores atualizados com sucesso, ${customUserNameInput || userName}!`);
    closeModal();
  };

  const totalCaixinhasBalance = useMemo(() => caixinhas.reduce((acc, curr) => acc + curr.balance, 0), [caixinhas]);

  return (
    <div className={`flex justify-center items-center min-h-screen ${darkMode ? 'bg-zinc-950 text-white' : 'bg-zinc-200 text-zinc-900'} p-0 sm:p-4`}>
      <div className={`w-full max-w-md ${darkMode ? 'bg-[#0D001A] text-white border-zinc-800' : 'bg-[#F4F4F6] text-zinc-900 border-zinc-300'} min-h-screen sm:min-h-[850px] sm:rounded-[48px] shadow-2xl flex flex-col justify-between relative overflow-hidden sm:border-[8px]`}>
        
        {toastMessage && (
          <div className="absolute top-4 left-4 right-4 z-50 bg-[#820AD1] text-white p-3.5 rounded-2xl shadow-2xl flex items-center space-x-3 border border-purple-400/30">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-purple-200"/>
            <div className="text-xs font-bold">{toastMessage}</div>
          </div>
        )}

        <header className="bg-[#820AD1] text-white p-5 pt-6 rounded-b-3xl shadow-lg relative z-20">
          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold border border-white/30">
                <User className="w-5 h-5 text-white"/>
              </div>
              <div>
                <span className="text-[10px] text-purple-200 block">Olá,</span>
                <h1 className="text-sm font-bold flex items-center gap-1">
                  {userName}
                  <Edit2 className="w-3 h-3 text-purple-300 cursor-pointer" onClick="{openBalanceEditModal}"/>
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button onClick={() => setDarkMode(!darkMode)} className="p-2 bg-white/10 rounded-full">
                {darkMode ? <Sun className="w-4 h-4 text-amber-300"/> : <Moon className="w-4 h-4 text-purple-200"/>}
              </button>
              <button onClick={() => setShowBalance(!showBalance)} className="p-2 bg-white/10 rounded-full">
                {showBalance ? <Eye className="w-4 h-4"/> : <EyeOff className="w-4 h-4"/>}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-purple-200 text-[11px] font-semibold uppercase">Conta</span>
            <div onClick={openBalanceEditModal} className="inline-flex items-center space-x-2 cursor-pointer rounded-lg p-1 hover:bg-white/10">
              <span className="text-2xl font-black">{showBalance ? formatBRL(balance) : '•••••'}</span>
              <span className="text-[10px] font-medium text-purple-200 bg-white/15 px-2 py-0.5 rounded-full">+100% CDI</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-24">
          <div className="flex space-x-3 overflow-x-auto py-1 select-none">
            <button onClick={() => setActiveModal('pix')} className="flex flex-col items-center flex-shrink-0">
              <div className="w-14 h-14 bg-zinc-800 rounded-full flex items-center justify-center text-white">
                <QrCode className="w-5 h-5"/>
              </div>
              <span className="text-[11px] font-semibold mt-1.5">Área Pix</span>
            </button>
            <button onClick={() => setActiveModal('my_cards')} className="flex flex-col items-center flex-shrink-0">
              <div className="w-14 h-14 bg-zinc-800 rounded-full flex items-center justify-center text-white">
                <CreditCard className="w-5 h-5"/>
              </div>
              <span className="text-[11px] font-semibold mt-1.5">Cartões</span>
            </button>
          </div>

          <div className={`${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-100'} p-4 rounded-2xl border space-y-3`}>
            <h2 className="font-bold text-xs">Cartão de crédito</h2>
            <div>
              <span className="text-[11px] text-zinc-400 block">Fatura atual</span>
              <div onClick={openBalanceEditModal} className="text-xl font-black cursor-pointer">
                {showBalance ? formatBRL(creditUsed) : '•••••'}
              </div>
            </div>
          </div>
        </main>

        <nav className={`${darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-200'} border-t absolute bottom-0 left-0 right-0 max-w-md mx-auto flex justify-around py-2.5 z-30`}>
          <button onClick={() => setActiveTab('home')} className="flex flex-col items-center text-[#820AD1]">
            <Home className="w-5 h-5"/>
            <span className="text-[10px] font-bold">Início</span>
          </button>
        </nav>

        {activeModal === 'edit_money' && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className={`${darkMode ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'} w-full max-w-md rounded-3xl p-6 space-y-4`}>
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-base">Personalizar Valores</h3>
                <button onClick={closeModal} className="p-1.5 bg-zinc-800/40 rounded-full"><X className="w-4 h-4"/></button>
              </div>
              <div className="space-y-3">
                <input type="text" value={customUserNameInput} onChange={(e) => setCustomUserNameInput(e.target.value)} placeholder="Nome" className="w-full p-3 bg-zinc-800/60 rounded-xl text-sm" />
                <input type="number" value={customBalanceInput} onChange={(e) => setCustomBalanceInput(e.target.value)} placeholder="Saldo" className="w-full p-3 bg-zinc-800/60 rounded-xl text-sm" />
              </div>
              <button onClick={handleSaveCustomMoney} className="w-full bg-[#820AD1] text-white py-3.5 rounded-full font-bold text-xs">Salvar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
