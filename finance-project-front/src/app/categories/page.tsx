"use client";

import { useState, useEffect, useCallback } from 'react';
import { fetchAPI } from '@/lib/api';
import CategoryCard from '@/components/CategoryCard';
import CategoryModal from '@/components/CategoryModal';

type Category = {
  id: string;
  name: string;
  monthly_budget: number | null;
  gastado?: number;
  porcentaje_uso?: number;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchAPI('/categories');
      const detailedCats = await Promise.all(
        data.map((c: Category) => fetchAPI(`/categories/${c.id}`))
      );
      setCategories(detailedCats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const openModal = (cat?: Category) => {
    if (cat) setEditingCat(cat);
    else setEditingCat(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (payload: any) => {
    setSaving(true);
    try {
      if (editingCat) {
        await fetchAPI(`/categories/${editingCat.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
      } else {
        await fetchAPI('/categories', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      }
      setIsModalOpen(false);
      loadCategories();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta categoría?')) return;
    try {
      await fetchAPI(`/categories/${id}`, { method: 'DELETE' });
      loadCategories();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al eliminar');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="w-12 h-12 rounded-full border-4 border-cyan-500/30 border-t-cyan-500 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Mis Categorías</h1>
          <p className="text-slate-400 mt-1 text-sm">Gestiona tus presupuestos y controla tus gastos</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-xl font-medium transition-all transform active:scale-95 shadow-lg shadow-cyan-500/25 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          Nueva Categoría
        </button>
      </div>

      {error && <div className="p-4 mb-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <CategoryCard key={cat.id} cat={cat} onEdit={openModal} onDelete={handleDelete} />
        ))}
        {categories.length === 0 && (
          <div className="col-span-full py-16 text-center bg-slate-900/30 rounded-3xl border border-dashed border-white/10">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-800 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
            </div>
            <p className="text-slate-400">Aún no tienes categorías creadas.</p>
          </div>
        )}
      </div>

      <CategoryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleSubmit} 
        editingCat={editingCat} 
        saving={saving} 
      />
    </div>
  );
}
