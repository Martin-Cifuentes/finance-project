import { useState, useEffect } from 'react';

type Category = {
  id: string;
  name: string;
  monthly_budget: number | null;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: any) => Promise<void>;
  editingCat: Category | null;
  saving: boolean;
};

export default function CategoryModal({ isOpen, onClose, onSubmit, editingCat, saving }: Props) {
  const [formData, setFormData] = useState({ name: '', monthly_budget: '' });

  useEffect(() => {
    if (editingCat) {
      setFormData({ name: editingCat.name, monthly_budget: editingCat.monthly_budget ? String(editingCat.monthly_budget) : '' });
    } else {
      setFormData({ name: '', monthly_budget: '' });
    }
  }, [editingCat, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      monthly_budget: formData.monthly_budget ? parseFloat(formData.monthly_budget) : null
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
      <div className="relative bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden transform transition-all">
        <div className="p-6">
          <h3 className="text-2xl font-bold text-white mb-6">{editingCat ? 'Editar Categoría' : 'Nueva Categoría'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Nombre</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                placeholder="Ej. Alimentación"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Presupuesto Mensual (Opcional)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.monthly_budget}
                onChange={(e) => setFormData({...formData, monthly_budget: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                placeholder="0.00"
              />
            </div>
            <div className="flex gap-3 mt-8">
              <button type="button" onClick={onClose} className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors">
                Cancelar
              </button>
              <button type="submit" disabled={saving} className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-xl font-medium transition-all shadow-lg shadow-cyan-500/25">
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
