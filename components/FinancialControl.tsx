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
          <TabsTrigger value="add">Nova Transação</TabsTrigger>
          <TabsTrigger value="list">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="add">
          <form onSubmit={handleAddTransaction} className="space-y-4 bg-white p-6 rounded-lg shadow">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tipo
              </label>
              <select
                value={newTransaction.type}
                onChange={e => setNewTransaction({ ...newTransaction, type: e.target.value as 'income' | 'expense' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="income">Entrada</option>
                <option value="expense">Saída</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Descrição
              </label>
              <input
                type="text"
                required
                value={newTransaction.description || ''}
                onChange={e => setNewTransaction({ ...newTransaction, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Valor
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={newTransaction.amount || ''}
                onChange={e => setNewTransaction({ ...newTransaction, amount: parseFloat(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Adicionar
            </button>
          </form>
        </TabsContent>

        <TabsContent value="list">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Histórico de Transações</h3>
            <div className="space-y-4">
              {transactions.map(transaction => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border rounded-md"
                >
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                      R$ {transaction.amount.toFixed(2)}
                    </span>
                    <button
                      onClick={() => deleteTransaction(transaction.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialControl;
