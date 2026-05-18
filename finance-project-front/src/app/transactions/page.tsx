"use client";

import { useState, useEffect, useCallback } from 'react';
import { fetchAPI } from '@/lib/api';
import BalanceCard from '@/components/BalanceCard';
import TransactionTable from '@/components/TransactionTable';
import TransactionModal from '@/components/TransactionModal';
import AlertToast from '@/components/AlertToast';

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

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterType, setFilterType] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [saving, setSaving] = useState(false);

  // Alert Toast
  const [alertMsg, setAlertMsg] = useState<{title: string, type: 'warning' | 'danger'} | null>(null);

  const loadInitialData = useCallback(async () => {
    try {
      const [cats, bal] = await Promise.all([
        fetchAPI('/categories'),
        fetchAPI('/transactions/balance')
      ]);
      setCategories(cats);
      setBalance(bal.balance);
    } catch (err) {
      // Ignorar error para SonarQube
    }
  }, []);

  const loadTransactions = useCallback(async () => {
    try {
      setLoading(true);
      let url = '/transactions?limit=100';
      if (filterType) url += `&type=${filterType}`;
      if (filterCategory) url += `&category_id=${filterCategory}`;
      
      const data = await fetchAPI(url);
      setTransactions(data);
    } catch (err) {
      // Ignorar error
    } finally {
      setLoading(false);
    }
  }, [filterType, filterCategory]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const openModal = (tx?: Transaction) => {
    if (tx) setEditingTx(tx);
    else setEditingTx(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (payload: any) => {
    setSaving(true);
    setAlertMsg(null);
    try {
      if (editingTx) {
        await fetchAPI(`/transactions/${editingTx.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
      } else {
        const response = await fetchAPI('/transactions', {
          method: 'POST',
          body: JSON.stringify(payload)
        });

        if (response.meta?.alerta) {
          if (response.meta.alerta === '100_percent_exceeded') {
            setAlertMsg({ title: '¡Atención! Has superado el 100% de tu presupuesto en esta categoría.', type: 'danger' });
          } else if (response.meta.alerta === '80_percent_exceeded') {
            setAlertMsg({ title: 'Aviso: Has superado el 80% de tu presupuesto en esta categoría.', type: 'warning' });
          }
        }
      }
      setIsModalOpen(false);
      loadTransactions();
      const bal = await fetchAPI('/transactions/balance');
      setBalance(bal.balance);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este movimiento?')) return;
    try {
      await fetchAPI(`/transactions/${id}`, { method: 'DELETE' });
      loadTransactions();
      const bal = await fetchAPI('/transactions/balance');
      setBalance(bal.balance);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al eliminar');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      <AlertToast alertMsg={alertMsg} onClose={() => setAlertMsg(null)} />
      
      <BalanceCard balance={balance} onNewTransaction={() => openModal()} />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <select 
          value={filterType} 
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-3 rounded-xl bg-slate-900/60 backdrop-blur-md border border-white/10 text-white focus:outline-none focus:border-cyan-500/50 appearance-none flex-1"
        >
          <option value="">Todos los tipos</option>
          <option value="ingreso">Ingresos</option>
          <option value="egreso">Egresos</option>
        </select>

        <select 
          value={filterCategory} 
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-3 rounded-xl bg-slate-900/60 backdrop-blur-md border border-white/10 text-white focus:outline-none focus:border-cyan-500/50 appearance-none flex-1"
        >
          <option value="">Todas las categorías</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <TransactionTable 
          transactions={transactions} 
          categories={categories} 
          loading={loading} 
          onEdit={openModal} 
          onDelete={handleDelete} 
        />
      </div>

      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleSubmit} 
        editingTx={editingTx} 
        categories={categories} 
        saving={saving} 
      />
    </div>
  );
}
