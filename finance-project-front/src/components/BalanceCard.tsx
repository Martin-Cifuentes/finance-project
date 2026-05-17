type Props = {
  balance: number;
  onNewTransaction: () => void;
};

export default function BalanceCard({ balance, onNewTransaction }: Props) {
  return (
    <div className="mb-10 p-8 rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 border border-white/5 relative overflow-hidden shadow-2xl">
      <div className="absolute right-0 top-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <p className="text-slate-400 font-medium tracking-wide text-sm mb-1 uppercase">Balance Actual</p>
          <h2 className={`text-5xl font-black ${balance >= 0 ? 'text-emerald-400' : 'text-red-400'} drop-shadow-lg`}>
            ${balance.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
          </h2>
        </div>
        <button 
          onClick={onNewTransaction}
          className="px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-2xl font-bold transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-cyan-500/25 flex items-center gap-2 w-full md:w-auto justify-center"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          Nuevo Movimiento
        </button>
      </div>
    </div>
  );
}
