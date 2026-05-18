import { useState, useEffect } from 'react';

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
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: any) => Promise<void>;
  editingTx: Transaction | null;
  categories: Category[];
  saving: boolean;
};

export default function TransactionModal({ isOpen, onClose, onSubmit, editingTx, categories, saving }: Props) {
  const [formData, setFormData] = useState({
    type: 'egreso',
    value: '',
    description: '',
    category_id: '',
    date: ''
  });

  useEffect(() => {
    if (editingTx) {
      setFormData({
        type: editingTx.type,
        value: String(editingTx.value),
        description: editingTx.description || '',
        category_id: editingTx.category_id || '',
        date: editingTx.transaction_date.substring(0, 16)
      });
    } else {
      setFormData({
        type: 'egreso',
        value: '',
        description: '',
        category_id: '',
        date: new Date().toISOString().substring(0, 16)
      });
    }
  }, [editingTx, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      type: formData.type,
      value: parseFloat(formData.value),
      description: formData.description || null,
      category_id: formData.category_id || null,
      date: new Date(formData.date).toISOString()
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === 'Escape' || e.key === 'Enter') onClose();
        }}
        role="button"
        tabIndex={0}
        aria-label="Cerrar modal"
      ></div>
      <div className="relative bg-slate-900 border border-slate-700 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden transform transition-all">
        <div className="p-8">
          <h3 className="text-2xl font-bold text-white mb-6">{editingTx ? 'Editar Movimiento' : 'Nuevo Movimiento'}</h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Tipo</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 appearance-none"
                >
                  <option value="egreso">Egreso</option>
                  <option value="ingreso">Ingreso</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Monto ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={formData.value}
                  onChange={(e) => setFormData({...formData, value: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Categoría</label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 appearance-none"
              >
                <option value="">-- Sin categoría --</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Descripción</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                placeholder="Ej. Compra de supermercado"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Fecha y Hora</label>
              <input
                type="datetime-local"
                required
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>

            <div className="flex gap-3 pt-4 border-t border-white/5">
              <button type="button" onClick={onClose} className="flex-1 px-4 py-3.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors font-medium">
                Cancelar
              </button>
              <button type="submit" disabled={saving} className="flex-1 px-4 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-xl font-medium transition-all shadow-lg shadow-cyan-500/25">
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
