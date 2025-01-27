import React, { useState, useEffect } from 'react';
import { Member, MonthlyPayment } from '../types';
import { useProtectedRoute } from '../hooks/useProtectedRoute';
import { Alert, AlertTitle } from '@/components/ui/alert';

const MonthlyPayments = () => {
  useProtectedRoute('monthly-payments', 4);
  const [members, setMembers] = useState<Member[]>([]);
  const [payments, setPayments] = useState<MonthlyPayment[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [defaultAmount, setDefaultAmount] = useState(50);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchData();
  }, [selectedMonth]);

  const fetchData = async () => {
    try {
      const [membersRes, paymentsRes] = await Promise.all([
        fetch('/api/members?type=Trabalhador'),
        fetch(`/api/monthly-payments?month=${selectedMonth}`)
      ]);
      
      const [membersData, paymentsData] = await Promise.all([
        membersRes.json(),
        paymentsRes.json()
      ]);

      setMembers(membersData);
      setPayments(paymentsData);
    } catch (err) {
      setError('Erro ao carregar dados');
    }
  };

  const handlePayment = async (memberId: string, paid: boolean) => {
    try {
      const response = await fetch('/api/monthly-payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId,
          month: selectedMonth,
          paid,
          amount: defaultAmount
        }),
      });

      if (!response.ok) throw new Error('Erro ao registrar pagamento');

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao registrar pagamento');
    }
  };

  const getPaymentStatus = (memberId: string) => {
    return payments.find(p => p.memberId === memberId && p.month === selectedMonth)?.paid || false;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Controle de Mensalidades</h2>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>{error}</AlertTitle>
        </Alert>
      )}

      {success && (
        <Alert className="mb-4">
          <AlertTitle>Pagamento registrado com sucesso!</AlertTitle>
        </Alert>
      )}

      <div className="mb-6 space-y-4">
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mês de Referência
            </label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Valor Padrão
            </label>
            <input
              type="number"
              value={defaultAmount}
              onChange={(e) => setDefaultAmount(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {members.map((member) => (
              <tr key={member.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {member.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    getPaymentStatus(member.id)
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {getPaymentStatus(member.id) ? 'Pago' : 'Pendente'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handlePayment(member.id, !getPaymentStatus(member.id))}
                    className={`inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md ${
                      getPaymentStatus(member.id)
                        ? 'text-red-700 bg-red-100 hover:bg-red-200'
                        : 'text-green-700 bg-green-100 hover:bg-green-200'
                    }`}
                  >
                    {getPaymentStatus(member.id) ? 'Desfazer' : 'Marcar como Pago'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Resumo</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Total de Membros:</p>
            <p className="text-lg font-medium">{members.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Pagamentos Realizados:</p>
            <p className="text-lg font-medium">
              {payments.filter(p => p.paid).length} / {members.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyPayments;
