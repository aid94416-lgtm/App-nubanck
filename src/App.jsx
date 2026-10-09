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
  Moon,
  Plus,
  HelpCircle,
  TrendingDown
} from 'lucide-react';

const INITIAL_BALANCE = 5000.00;
const INITIAL_CREDIT_LIMIT = 10000.00;
const INITIAL_CREDIT_USED = 1250.00;
const PRE_APPROVED_LOAN = 25000.00;

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
  { id: 2, name: 'Viagem dos Sonhos', balance: 2500.00, cdiPercent: 102, goal: 8000 },
  { id: 3, name: 'Novo Computador', balance: 1200.00, cdiPercent: 100, goal: 6000 }
];

const INITIAL_CRYPTO = [
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', balance: 0.005, price: 380000.00, change: +5.4 },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', balance: 0.05, price: 21000.00, change: +2.1 },
  { id: 'nu', name: 'Nucoin', symbol: 'NUC', balance: 2500.00, price: 0.12, change: +24.0 }
];

const SHOPPING_STORES = [
  { id: 1, name: 'Magazine Luiza', category: 'Eletrônicos & Casa', cashback: 8, logoBg: 'bg-blue-600', deal: 'Até 8% de dinheiro de volta' },
  { id: 2, name: 'Casas Bahia', category: 'Eletrodomésticos', cashback: 10, logoBg: 'bg-red-600', deal: 'Cupom R$50 + 10% cashback' },
  { id: 3, name: 'Amazon Brasil', category: 'Livros & Tec', cashback: 6, logoBg: 'bg-amber-500', deal: '6% de retorno direto no app' },
  { id: 4, name: 'iFood', category: 'Delivery', cashback: 7, logoBg: 'bg-rose-600', deal: '7% em todas as refeições' }
];

const INITIAL_TRANSACTIONS = [
  { id: 101, type: 'pix_received', title: 'Pix recebido de Carlos M.', value: 1500.00, date: 'Hoje, 14:32', category: 'Pix' },
  { id: 102, type: 'card_buy', title: 'Supermercado Pão de Açúcar', value: 215.40, date: 'Ontem, 18:45', category: 'Cartão de Crédito' },
  { id: 103, type: 'payment', title: 'Pagamento de Boleto - Enel', value: 128.30, date: '04 Out', category: 'Conta de Luz' },
  { id: 104, type: 'yield', title: 'Rendimento Caixinha Reserva', value: 12.40, date: '01 Out', category: 'Rendimento' }
];

const formatBRL = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

export default function App() {
  const [userName, setUserName] = useState('Natan');
  const [darkMode, setDarkMode] = useState(true);
  const [showBalance, setShowBalance] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [toastMessage, setToastMessage] = useState(null);

  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [creditLimit] = useState(INITIAL_CREDIT_LIMIT);
  const [adjustedLimit, setAdjustedLimit] = useState(INITIAL_CREDIT_LIMIT);
  const [creditUsed, setCreditUsed] = useState(INITIAL_CREDIT_USED);
  const [caixinhas, setCaixinhas] = useState(INITIAL_CAIXINHAS);
  const [cryptoList] = useState(INITIAL_CRYPTO);
  const [cards, setCards] = useState(INITIAL_CARDS);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [preApprovedLoan, setPreApprovedLoan] = useState(PRE_APPROVED_LOAN);

  const [customBalanceInput, setCustomBalanceInput] = useState('');
  const [customLimitInput, setCustomLimitInput] = useState('');
  const [customInvoiceInput, setCustomInvoiceInput] = useState('');
  const [customUserNameInput, setCustomUserNameInput] = useState('Natan');

  const [activeModal, setActiveModal] = useState(null);
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

  const addTransaction = (type, title, value, category) => {
    const newTx = {
      id: Date.now(),
      type,
      title,
      value: parseFloat(value),
      date: 'Hoje, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category
    };
    setTransactions(prev => [newTx, ...prev]);
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
    addTransaction('pix_sent', `Pix enviado para ${pixKeyInput || 'Chave Pix'}`, numVal, 'Pix');
    showToast(`Pix de ${formatBRL(numVal)} enviado com sucesso!`);
    closeModal();
  };

  const handleDepositAccount = () => {
    const numVal = parseFloat(amountInput);
    if (!numVal || numVal <= 0) return;
    setBalance(prev => prev + numVal);
    addTransaction('pix_received', 'Depósito recebido via Pix', numVal, 'Depósito');
    showToast(`Depósito de ${formatBRL(numVal)} realizado!`);
    closeModal();
  };

  const handleTakeLoan = () => {
    const numVal = parseFloat(amountInput);
    if (!numVal || numVal <= 0 || numVal > preApprovedLoan) return;
    setBalance(prev => prev + numVal);
    setPreApprovedLoan(prev => prev - numVal);
    addTransaction('loan', 'Empréstimo Pessoal Contratado', numVal, 'Empréstimo');
    showToast(`Empréstimo de ${formatBRL(numVal)} creditado na conta!`);
    closeModal();
  };

  const handlePayInvoice = () => {
    if (creditUsed <= 0) return showToast('Sua fatura já está zerada!');
    if (balance < creditUsed) return showToast('Saldo insuficiente para quitar a fatura.');
    setBalance(prev => prev - creditUsed);
    setCreditUsed(0);
    addTransaction('payment', 'Pagamento Fatura Cartão', creditUsed, 'Cartão');
    showToast('Fatura quitada com sucesso!');
    closeModal();
  };

  const toggleLockCard = (cardId) => {
    setCards(prev => prev.map(c => c.id === cardId ? { ...c, locked: !c.locked } : c));
  };

  const totalCaixinhasBalance = useMemo(() => caixinhas.reduce((acc, curr) => acc + curr.balance, 0), [caixinhas]);
  const totalCryptoValue = useMemo(() => cryptoList.reduce((acc, item) => acc + (item.balance * item.price), 0), [cryptoList]);

  return (
    <div className={`flex justify-center items-center min-h-screen ${darkMode ? 'bg-zinc-950 text-white' : 'bg-zinc-200 text-zinc-900'} p-0 sm:p-4 transition-colors`}>
      <div className={`w-full max-w-md ${darkMode ? 'bg-[#0D001A] text-white border-zinc-800' : 'bg-[#F4F4F6] text-zinc-900 border-zinc-300'} min-h-screen sm:min-h-[850px] sm:max-h-[900px] sm:rounded-[48px] shadow-2xl flex flex-col justify-between relative overflow-hidden sm:border-[8px]`}>
        
        {/* Toast Alert */}
        {toastMessage && (
          <div className="absolute top-4 left-4 right-4 z-50 bg-[#820AD1] text-white p-3.5 rounded-2xl shadow-2xl flex items-center space-x-3 border border-purple-400/30 animate-bounce">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-purple-200" />
            <div className="text-xs font-bold">{toastMessage}</div>
          </div>
        )}

        {/* Top Header */}
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
                  <Edit2 className="w-3.5 h-3.5 text-purple-300 cursor-pointer hover:text-white" onClick={openBalanceEditModal} />
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button onClick={() => setDarkMode(!darkMode)} className="p-2 bg-white/10 rounded-full hover:bg-white/20">
                {darkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-purple-200" />}
              </button>
              <button onClick={() => setShowBalance(!showBalance)} className="p-2 bg-white/10 rounded-full hover:bg-white/20">
                {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button onClick={() => showToast("Sem notificações no momento")} className="p-2 bg-white/10 rounded-full hover:bg-white/20">
                <Bell className="w-4 h-4" />
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

        {/* Main Body Dynamic Content */}
        <main className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-24">
          {activeTab === 'home' && (
            <>
              {/* Carousel Buttons */}
              <div className="flex space-x-3 overflow-x-auto no-scrollbar py-1 select-none -mx-4 px-4">
                <button onClick={() => setActiveModal('pix')} className="flex flex-col items-center flex-shrink-0 group">
                  <div className="w-14 h-14 bg-zinc-800 rounded-full flex items-center justify-center text-white group-hover:bg-[#820AD1] transition-all">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold mt-1.5">Área Pix</span>
                </button>

                <button onClick={() => setActiveModal('pay')} className="flex flex-col items-center flex-shrink-0 group">
                  <div className="w-14 h-14 bg-zinc-800 rounded-full flex items-center justify-center text-white group-hover:bg-[#820AD1] transition-all">
                    <Barcode className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold mt-1.5">Pagar</span>
                </button>

                <button onClick={() => setActiveModal('pix')} className="flex flex-col items-center flex-shrink-0 group">
                  <div className="w-14 h-14 bg-zinc-800 rounded-full flex items-center justify-center text-white group-hover:bg-[#820AD1] transition-all">
                    <Send className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold mt-1.5">Transferir</span>
                </button>

                <button onClick={() => setActiveModal('deposit')} className="flex flex-col items-center flex-shrink-0 group">
                  <div className="w-14 h-14 bg-zinc-800 rounded-full flex items-center justify-center text-white group-hover:bg-[#820AD1] transition-all">
                    <ArrowDownLeft className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold mt-1.5">Depositar</span>
                </button>

                <button onClick={() => setActiveModal('loan')} className="flex flex-col items-center flex-shrink-0 group">
                  <div className="w-14 h-14 bg-zinc-800 rounded-full flex items-center justify-center text-white group-hover:bg-[#820AD1] transition-all">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold mt-1.5">Pegar Empréstimo</span>
                </button>
              </div>

              {/* Meus Cartões */}
              <button 
                onClick={() => setActiveModal('my_cards')}
                className={`w-full ${darkMode ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800/80' : 'bg-white border-zinc-200 hover:bg-zinc-50'} p-4 rounded-2xl border flex items-center justify-between transition-all`}
              >
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-5 h-5 text-[#820AD1]" />
                  <span className="text-xs font-bold">Meus cartões</span>
                </div>
                <span className="text-[10px] bg-[#820AD1]/10 text-[#820AD1] font-bold px-2 py-1 rounded-full">
                  {cards.length} ativos
                </span>
              </button>

              {/* Cartão de Crédito Box */}
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
                <div className="flex space-x-2 pt-1">
                  <button onClick={handlePayInvoice} className="flex-1 bg-[#820AD1] text-white py-2 rounded-full text-xs font-bold">
                    Pagar fatura
                  </button>
                  <button onClick={openBalanceEditModal} className="flex-1 bg-zinc-800 text-white py-2 rounded-full text-xs font-bold">
                    Ajustar limite
                  </button>
                </div>
              </div>

              {/* Caixinhas Preview */}
              <div className={`${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'} p-4 rounded-2xl border space-y-3`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <PiggyBank className="w-4 h-4 text-[#820AD1]" />
                    <h2 className="font-bold text-xs">Caixinhas</h2>
                  </div>
                  <span className="text-xs font-bold text-[#820AD1]">{formatBRL(totalCaixinhasBalance)}</span>
                </div>
                <p className="text-[11px] text-zinc-400">Guarde dinheiro e renda 100% do CDI com resgate diário.</p>
              </div>

              {/* Investimentos / Cripto */}
              <div className={`${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'} p-4 rounded-2xl border space-y-3`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <h2 className="font-bold text-xs">Cripto & Nucoin</h2>
                  </div>
                  <span className="text-xs font-bold text-emerald-500">{formatBRL(totalCryptoValue)}</span>
                </div>
              </div>

              {/* Histórico de Transações */}
              <div className={`${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'} p-4 rounded-2xl border space-y-3`}>
                <h2 className="font-bold text-xs">Histórico de Atividades</h2>
                <div className="space-y-3 divide-y divide-zinc-800/40">
                  {transactions.slice(0, 4).map(tx => (
                    <div key={tx.id} className="flex justify-between items-center pt-2">
                      <div>
                        <p className="text-xs font-semibold">{tx.title}</p>
                        <span className="text-[10px] text-zinc-400">{tx.date}</span>
                      </div>
                      <span className={`text-xs font-bold ${tx.type === 'pix_received' || tx.type === 'yield' ? 'text-emerald-500' : 'text-zinc-300'}`}>
                        {tx.type === 'pix_received' || tx.type === 'yield' ? '+' : '-'}{formatBRL(tx.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'shop' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold">Shopping Nubank</h2>
              <p className="text-xs text-zinc-400">Compre com cashback direto na sua conta.</p>
              <div className="grid grid-cols-1 gap-3">
                {SHOPPING_STORES.map(store => (
                  <div key={store.id} className={`${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'} p-4 rounded-2xl border flex items-center justify-between`}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 ${store.logoBg} rounded-xl flex items-center justify-center text-white font-bold text-sm`}>
                        {store.name[0]}
                      </div>
                      <div>
                        <h3 className="font-bold text-xs">{store.name}</h3>
                        <span className="text-[10px] text-emerald-500 font-bold">{store.deal}</span>
                      </div>
                    </div>
                    <button onClick={() => showToast(`Cashback ativado na ${store.name}!`)} className="bg-[#820AD1] text-white px-3 py-1.5 rounded-full text-[11px] font-bold">
                      Ativar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* Modal: Editar Valores / Personalizar */}
        {activeModal === 'edit_money' && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className={`${darkMode ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'} w-full max-w-md rounded-3xl p-6 space-y-4`}>
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-base">Personalizar Painel</h3>
                <button onClick={closeModal} className="p-1.5 bg-zinc-800/40 rounded-full"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] text-zinc-400 font-semibold block mb-1">Seu Nome</label>
                  <input type="text" value={customUserNameInput} onChange={(e) => setCustomUserNameInput(e.target.value)} className="w-full p-3 bg-zinc-800/60 rounded-xl text-sm border border-zinc-700" />
                </div>
                <div>
                  <label className="text-[11px] text-zinc-400 font-semibold block mb-1">Saldo em Conta (R$)</label>
                  <input type="number" value={customBalanceInput} onChange={(e) => setCustomBalanceInput(e.target.value)} className="w-full p-3 bg-zinc-800/60 rounded-xl text-sm border border-zinc-700" />
                </div>
                <div>
                  <label className="text-[11px] text-zinc-400 font-semibold block mb-1">Fatura do Cartão (R$)</label>
                  <input type="number" value={customInvoiceInput} onChange={(e) => setCustomInvoiceInput(e.target.value)} className="w-full p-3 bg-zinc-800/60 rounded-xl text-sm border border-zinc-700" />
                </div>
                <div>
                  <label className="text-[11px] text-zinc-400 font-semibold block mb-1">Limite Total (R$)</label>
                  <input type="number" value={customLimitInput} onChange={(e) => setCustomLimitInput(e.target.value)} className="w-full p-3 bg-zinc-800/60 rounded-xl text-sm border border-zinc-700" />
                </div>
              </div>
              <button onClick={handleSaveCustomMoney} className="w-full bg-[#820AD1] text-white py-3.5 rounded-full font-bold text-xs">
                Salvar Alterações
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
              <input type="text" placeholder="Chave Pix (E-mail, CPF, Telefone)" value={pixKeyInput} onChange={e => setPixKeyInput(e.target.value)} className="w-full p-3 bg-zinc-800/60 rounded-xl text-sm border border-zinc-700" />
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
                    <div className="flex justify-between text-[10px]">
                      <span>Validade: {card.expiry}</span>
                      <span>CVV: {card.cvv}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Bar */}
        <nav className={`${darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-200'} border-t absolute bottom-0 left-0 right-0 max-w-md mx-auto flex justify-around py-3 z-30`}>
          <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center ${activeTab === 'home' ? 'text-[#820AD1]' : 'text-zinc-500'}`}>
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-bold mt-1">Início</span>
          </button>
          <button onClick={() => setActiveTab('shop')} className={`flex flex-col items-center ${activeTab === 'shop' ? 'text-[#820AD1]' : 'text-zinc-500'}`}>
            <ShoppingBag className="w-5 h-5" />
            <span className="text-[10px] font-bold mt-1">Shopping</span>
          </button>
        </nav>

      </div>
    </div>
  );
}
