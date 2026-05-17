type Category = {
  id: string;
  name: string;
};

type Transaction = {
  id: string;
  type: string;
  value: number;
  description: string | null;
  category_id: string | null;
  transaction_date: string;
};

type Props = {
  transactions: Transaction[];
  categories: Category[];
  loading: boolean;
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
};

export default function TransactionTable({ transactions, categories, loading, onEdit, onDelete }: Props) {
  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div className="w-10 h-10 rounded-full border-4 border-cyan-500/30 border-t-cyan-500 animate-spin"></div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center p-16">
        <div className="w-16 h-16 mx-auto mb-4 bg-slate-800 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
        </div>
        <p className="text-slate-400">No se encontraron movimientos.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-800/50 border-b border-white/5">
            <th className="p-4 font-semibold text-slate-300 text-sm">Fecha</th>
            <th className="p-4 font-semibold text-slate-300 text-sm">Descripción</th>
            <th className="p-4 font-semibold text-slate-300 text-sm">Categoría</th>
            <th className="p-4 font-semibold text-slate-300 text-sm text-right">Monto</th>
            <th className="p-4 font-semibold text-slate-300 text-sm text-center">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {transactions.map(tx => (
            <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors group">
              <td className="p-4 text-slate-400 text-sm">
                {new Date(tx.transaction_date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </td>
              <td className="p-4 text-white font-medium">
                {tx.description || '-'}
                <div className="text-xs text-slate-500 capitalize md:hidden">{tx.type}</div>
              </td>
              <td className="p-4 text-slate-300">
                {tx.category_id ? categories.find(c => c.id === tx.category_id)?.name || 'Desconocida' : '-'}
              </td>
              <td className={`p-4 text-right font-bold ${tx.type === 'ingreso' ? 'text-emerald-400' : 'text-white'}`}>
                {tx.type === 'ingreso' ? '+' : '-'}${tx.value.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
              </td>
              <td className="p-4 text-center">
                <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => onEdit(tx)} className="p-2 text-slate-400 hover:text-cyan-400 rounded-lg hover:bg-white/5 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  </button>
                  <button onClick={() => onDelete(tx.id)} className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-white/5 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
