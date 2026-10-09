import React, { useState, useMemo } from 'react';
import {
  Eye,
  EyeOff,
  QrCode,
  Send,
  ArrowDownLeft,
  CreditCard,
  Barcode,
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
  PiggyBank,
  TrendingUp,
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
    number: '5412 •••• •••• 9012',
    expiry: '11/31',
    cvv: '891',
    locked: false,
    color: 'from-zinc-900 via-zinc-800 to-black',
    tag: 'Ultravioleta'
  },
  {
    id: 'card-virt-1',
    name: 'Cartão Virtual Online',
    number: '4221 •••• •••• 4410',
    expiry: '08/29',
    cvv: '312',
    locked: false,
    color: 'from-[#820AD1] to-[#5B0099]',
    tag: 'Recorrente'
  }
];

const INITIAL_TRANSACTIONS = [
  { id: 101, type: 'pix_received', title: 'Pix recebido de Carlos M.', value: 1500.00, date: 'Hoje, 14:32' },
  { id: 102, type: 'card_buy', title: 'Supermercado Pão de Açúcar', value: 215.40, date: 'Ontem, 18:45' },
  { id: 103, type: 'payment', title: 'Pagamento de Boleto - Enel', value: 128.30, date: '04 Out' }
];

const formatBRL = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

export default function App() {
  const [userName, setUserName] = useState('Natan');
  const [darkMode, setDarkMode] = useState(true);
  const [showBalance, setShowBalance] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [toastMessage, setToastMessage] = useState(null);

  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [adjustedLimit, setAdjustedLimit] = useState(INITIAL_CREDIT_LIMIT);
  const [creditUsed, setCreditUsed] = useState(INITIAL_CREDIT_USED);
  const [cards, setCards] = useState(INITIAL_CARDS);
  const [transactions] = useState(INITIAL_TRANSACTIONS);

  const [customBalanceInput, setCustomBalanceInput] = useState('');
  const [customLimitInput, setCustomLimitInput] = useState('');
  const [customInvoiceInput, setCustomInvoiceInput] = useState('');
  const [customUserNameInput, setCustomUserNameInput] = useState('Natan');

  const [activeModal, setActiveModal] = useState(null);
  const [amountInput, setAmountInput] = useState('');
  const [pixKeyInput, setPixKeyInput] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const closeModal = () => {
    setActiveModal(null);
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

  const handlePixSend = () => {
    const numVal = parseFloat(amountInput);
    if (!numVal || numVal <= 0) return;
    if (numVal > balance) {
      showToast('Saldo insuficiente em conta!');
      return;
    }
    setBalance(prev => prev - numVal);
    showToast(`Pix de ${formatBRL(numVal)} enviado com sucesso!`);
    closeModal();
  };

  const toggleLockCard = (cardId) => {
    setCards(prev => prev.map(c => c.id === cardId ? { ...c, locked: !c.locked } : c));
  };

  return (
    <div className={`flex justify-center items-center min-h-screen ${darkMode ? 'bg-zinc-950 text-white' : 'bg-zinc-200 text-zinc-900'} p-0 sm:p-4`}>
      <div className={`w-full max-w-md ${darkMode ? 'bg-[#0D001A] text-white border-zinc-800' : 'bg-[#F4F4F6] text-zinc-900 border-zinc-300'} min-h-screen sm:min-h-[850px] sm:rounded-[48px] shadow-2xl flex flex-col justify-between relative overflow-hidden sm:border-[8px]`}>
        
        {toastMessage && (
          <div className="absolute top-4 left-4 right-4 z-50 bg-[#820AD1] text-white p-3.5 rounded-2xl shadow-2xl flex items-center space-x-3 border border-purple-400/30">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-purple-200" />
            <div className="text-xs font-bold">{toastMessage}</div>
          </div>
        )}

        {/* Cabeçalho */}
        <header className="bg-[#820AD1] text-white p-5 pt-6 rounded-b-3xl shadow-lg relative z-20">
          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold border border-white/30">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-[10px] text-purple-200 block">Olá,</span>
                <h1 className="text-sm font-bold flex items-center gap-1">
                  {userName}
                  <Edit2 className="w-3.5 h-3.5 text-purple-300 cursor-pointer" onClick={openBalanceEditModal} />
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button onClick={() => setDarkMode(!darkMode)} className="p-2 bg-white/10 rounded-full">
                {darkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-purple-200" />}
              </button>
              <button onClick={() => setShowBalance(!showBalance)} className="p-2 bg-white/10 rounded-full">
                {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
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

        {/* Conteúdo Principal */}
        <main className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-24">
          <div className="flex space-x-3 overflow-x-auto py-1 select-none -mx-4 px-4">
            <button onClick={() => setActiveModal('pix')} className="flex flex-col items-center flex-shrink-0">
              <div className="w-14 h-14 bg-zinc-800 rounded-full flex items-center justify-center text-white">
                <QrCode className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold mt-1.5">Área Pix</span>
            </button>

            <button onClick={() => setActiveModal('my_cards')} className="flex flex-col items-center flex-shrink-0">
              <div className="w-14 h-14 bg-zinc-800 rounded-full flex items-center justify-center text-white">
                <CreditCard className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold mt-1.5">Cartões</span>
            </button>
          </div>

          {/* Card de Cartão de Crédito */}
          <div className={`${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'} p-4 rounded-2xl border space-y-3`}>
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-xs">Cartão de crédito</h2>
              <ChevronRight className="w-4 h-4 text-zinc-400" />
            </div>
            <div>
              <span className="text-[11px] text-zinc-400 block">Fatura atual</span>
              <div onClick={openBalanceEditModal} className="text-xl font-black cursor-pointer">
                {showBalance ? formatBRL(creditUsed) : '•••••'}
              </div>
              <p className="text-[10px] text-zinc-400 mt-1">
                Limite disponível: <strong className="text-emerald-500">{formatBRL(adjustedLimit - creditUsed)}</strong>
              </p>
            </div>
          </div>

          {/* Histórico */}
          <div className={`${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'} p-4 rounded-2xl border space-y-3`}>
            <h2 className="font-bold text-xs">Histórico de Atividades</h2>
            <div className="space-y-3">
              {transactions.map(tx => (
                <div key={tx.id} className="flex justify-between items-center border-b border-zinc-800/40 pb-2">
                  <div>
                    <p className="text-xs font-semibold">{tx.title}</p>
                    <span className="text-[10px] text-zinc-400">{tx.date}</span>
                  </div>
                  <span className={`text-xs font-bold ${tx.type === 'pix_received' ? 'text-emerald-500' : 'text-zinc-300'}`}>
                    {tx.type === 'pix_received' ? '+' : '-'}{formatBRL(tx.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Modal Personalizar */}
        {activeModal === 'edit_money' && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className={`${darkMode ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'} w-full max-w-md rounded-3xl p-6 space-y-4`}>
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-base">Personalizar Valores</h3>
                <button onClick={closeModal} className="p-1.5 bg-zinc-800/40 rounded-full"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-3">
                <input type="text" value={customUserNameInput} onChange={(e) => setCustomUserNameInput(e.target.value)} placeholder="Nome" className="w-full p-3 bg-zinc-800/60 rounded-xl text-sm border border-zinc-700" />
                <input type="number" value={customBalanceInput} onChange={(e) => setCustomBalanceInput(e.target.value)} placeholder="Saldo R$" className="w-full p-3 bg-zinc-800/60 rounded-xl text-sm border border-zinc-700" />
                <input type="number" value={customInvoiceInput} onChange={(e) => setCustomInvoiceInput(e.target.value)} placeholder="Fatura R$" className="w-full p-3 bg-zinc-800/60 rounded-xl text-sm border border-zinc-700" />
              </div>
              <button onClick={handleSaveCustomMoney} className="w-full bg-[#820AD1] text-white py-3.5 rounded-full font-bold text-xs">
                Salvar
              </button>
            </div>
          </div>
        )}

        {/* Modal Pix */}
        {activeModal === 'pix' && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className={`${darkMode ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'} w-full max-w-md rounded-3xl p-6 space-y-4`}>
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-base">Área Pix</h3>
                <button onClick={closeModal} className="p-1.5 bg-zinc-800/40 rounded-full"><X className="w-4 h-4" /></button>
              </div>
              <input type="text" placeholder="Chave Pix" value={pixKeyInput} onChange={e => setPixKeyInput(e.target.value)} className="w-full p-3 bg-zinc-800/60 rounded-xl text-sm border border-zinc-700" />
              <input type="number" placeholder="Valor R$" value={amountInput} onChange={e => setAmountInput(e.target.value)} className="w-full p-3 bg-zinc-800/60 rounded-xl text-sm border border-zinc-700" />
              <button onClick={handlePixSend} className="w-full bg-[#820AD1] text-white py-3.5 rounded-full font-bold text-xs">
                Enviar Pix
              </button>
            </div>
          </div>
        )}

        {/* Modal Cartões */}
        {activeModal === 'my_cards' && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className={`${darkMode ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'} w-full max-w-md rounded-3xl p-6 space-y-4`}>
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-base">Meus Cartões</h3>
                <button onClick={closeModal} className="p-1.5 bg-zinc-800/40 rounded-full"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-3">
                {cards.map(card => (
                  <div key={card.id} className={`p-4 rounded-2xl bg-gradient-to-r ${card.color} text-white space-y-2`}>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full">{card.tag}</span>
                      <button onClick={() => toggleLockCard(card.id)}>
                        {card.locked ? <Lock className="w-4 h-4 text-rose-400" /> : <Unlock className="w-4 h-4 text-emerald-400" />}
                      </button>
                    </div>
                    <p className="text-sm font-mono tracking-widest">{card.number}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Barra de Navegação Inferior */}
        <nav className={`${darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-200'} border-t absolute bottom-0 left-0 right-0 max-w-md mx-auto flex justify-around py-3 z-30`}>
          <button onClick={() => setActiveTab('home')} className="flex flex-col items-center text-[#820AD1]">
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-bold mt-1">Início</span>
          </button>
        </nav>

      </div>
    </div>
  );
}
