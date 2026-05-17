type Category = {
  id: string;
  name: string;
  monthly_budget: number | null;
  gastado?: number;
  porcentaje_uso?: number;
};

type Props = {
  cat: Category;
  onEdit: (cat: Category) => void;
  onDelete: (id: string) => void;
};

export default function CategoryCard({ cat, onEdit, onDelete }: Props) {
  const isOverBudget = (cat.porcentaje_uso || 0) >= 100;
  const isWarning = (cat.porcentaje_uso || 0) >= 80 && !isOverBudget;

  return (
    <div className="bg-slate-900/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all hover:shadow-2xl hover:shadow-black/50 group">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-white">{cat.name}</h3>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(cat)} className="p-1.5 text-slate-400 hover:text-cyan-400 rounded-lg hover:bg-white/5 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
          </button>
          <button onClick={() => onDelete(cat.id)} className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-white/5 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
        </div>
      </div>

      {cat.monthly_budget ? (
        <>
          <div className="flex justify-between items-end mb-2">
            <div>
              <p className="text-sm text-slate-400">Gastado</p>
              <p className={`text-2xl font-bold ${isOverBudget ? 'text-red-400' : 'text-white'}`}>
                ${cat.gastado?.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400">Presupuesto</p>
              <p className="text-lg font-medium text-slate-300">${cat.monthly_budget.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Progreso mensual</span>
              <span className={isOverBudget ? 'text-red-400 font-bold' : isWarning ? 'text-amber-400' : 'text-cyan-400'}>
                {cat.porcentaje_uso?.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div 
                className={`h-2 rounded-full transition-all duration-1000 ${isOverBudget ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-gradient-to-r from-cyan-500 to-blue-500'}`}
                style={{ width: `${Math.min(cat.porcentaje_uso || 0, 100)}%` }}
              ></div>
            </div>
          </div>
        </>
      ) : (
        <div className="py-4 text-center border-t border-dashed border-white/10 mt-2">
          <span className="text-slate-400 text-sm">Sin límite de presupuesto</span>
        </div>
      )}
    </div>
  );
}
