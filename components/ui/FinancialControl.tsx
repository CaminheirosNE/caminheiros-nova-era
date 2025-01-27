import React, { useState, useEffect } from 'react';
import { FinancialTransaction, MonthlyPayment } from '../types';
import { useProtectedRoute } from '../hooks/useProtectedRoute';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const FinancialControl = () => {
  useProtectedRoute('financial-control', 4);

  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [monthlyPayments, setMonthlyPayments] = useState<MonthlyPayment[]>([]);
  const [newTransaction, setNewTransaction] = useState<Partial<FinancialTransaction>>({
    type: 'income'
  });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [transactionsRes, paymentsRes] = await Promise.all([
        fetch('/api/transactions'),
        fetch('/api/monthly-payments')
      ]);
      
      const [transactionsData, paymentsData] = await Promise.all([
        transactionsRes.json(),
        paymentsRes.json()
      ]);

      setTransactions(transactionsData);
      setMonthlyPayments(paymentsData);
    } catch (err) {
      setError('Erro ao carregar dados financeiros');
    }
  };

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newTransaction,
          date: new Date().toISOString()
        }),
      });

      if (!response.ok) throw new Error('Erro ao adicionar transação');

      setSuccess(true);
      setNewTransaction({ type: 'income' });
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar transação');
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      setError('Erro ao excluir transação');
    }
  };

  const calculateBalance = () => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyPaymentsTotal = monthlyPayments
      .filter(p => p.paid)
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      income: income + monthlyPaymentsTotal,
      expenses,
      balance: income + monthlyPaymentsTotal - expenses
    };
  };

  const { income, expenses, balance } = calculateBalance();

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Controle Financeiro</h2>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>{error}</AlertTitle>
        </Alert>
      )}

      {success && (
        <Alert className="mb-4">
          <AlertTitle>Transação adicionada com sucesso!</AlertTitle>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-green-100 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-green-800">Entradas</h3>
          <p className="text-2xl font-bold text-green-900">
            R$ {income.toFixed(2)}
          </p>
        </div>
        <div className="bg-red-100 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-red-800">Saídas</h3>
          <p className="text-2xl font-bold text-red-900">
            R$ {expenses.toFixed(2)}
          </p>
        </div>
        <div className="bg-blue-100 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-blue-800">Saldo</h3>
          <p className="text-2xl font-bold text-blue-900">
            R$ {balance.toFixed(2)}
          </p>
        </div>
      </div>

      <Tabs defaultValue="add" className="w-full">
        <TabsList>
          <TabsTrigger
