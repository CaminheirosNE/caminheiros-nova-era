import React, { useState, useEffect } from 'react';
import { Member, Event, MonthlyPayment, FinancialTransaction } from '../types';
import { useProtectedRoute } from '../hooks/useProtectedRoute';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Reports = () => {
  useProtectedRoute('reports', 3);

  const [members, setMembers] = useState<Member[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [payments, setPayments] = useState<MonthlyPayment[]>([]);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'year'>('month');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
    end: new Date().toISOString()
  });

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const fetchData = async () => {
    try {
      const [membersRes, eventsRes, paymentsRes, transactionsRes] = await Promise.all([
        fetch('/api/members'),
        fetch(`/api/events?start=${dateRange.start}&end=${dateRange.end}`),
        fetch(`/api/monthly-payments?start=${dateRange.start}&end=${dateRange.end}`),
        fetch(`/api/transactions?start=${dateRange.start}&end=${dateRange.end}`)
      ]);

      const [membersData, eventsData, paymentsData, transactionsData] = await Promise.all([
        membersRes.json(),
        eventsRes.json(),
        paymentsRes.json(),
        transactionsRes.json()
      ]);

      setMembers(membersData);
      setEvents(eventsData);
      setPayments(paymentsData);
      setTransactions(transactionsData);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const getMembershipStats = () => {
    const total = members.length;
    const workers = members.filter(m => m.type === 'Trabalhador').length;
    const consultants = total - workers;
    const males = members.filter(m => m.gender === 'M').length;
    const females = total - males;

    const ageGroups = members.reduce((acc: Record<string, number>, member) => {
      const age = new Date().getFullYear() - new Date(member.birthDate).getFullYear();
      const group = age < 18 ? '<18' :
                   age < 30 ? '18-29' :
                   age < 45 ? '30-44' :
                   age < 60 ? '45-59' : '60+';
      acc[group] = (acc[group] || 0) + 1;
      return acc;
    }, {});

    return {
      total,
      workers,
      consultants,
      males,
      females,
      ageGroups,
      memberTypeData: [
        { name: 'Trabalhadores', value: workers },
        { name: 'Consulentes', value: consultants }
      ],
      genderData: [
        { name: 'Masculino', value: males },
        { name: 'Feminino', value: females }
      ]
    };
  };

  const getEventStats = () => {
    const eventParticipation = events.map(event => ({
      name: event.title,
      participants: event.participants.length
    }));

    const workerParticipation = members
      .filter(m => m.type === 'Trabalhador')
      .map(worker => ({
        name: worker.name,
        events: events.filter(e => e.participants.includes(worker.id)).length,
        percentage: Math.round(
          (events.filter(e => e.participants.includes(worker.id)).length / events.length) * 100
        )
      }))
      .sort((a, b) => b.events - a.events);

    return {
      eventParticipation,
      workerParticipation,
      totalEvents: events.length,
      averageParticipation: Math.round(
        eventParticipation.reduce((acc, curr) => acc + curr.participants, 0) / events.length
      )
    };
  };

  const getFinancialStats = () => {
    const monthlyData = transactions.reduce((acc: Record<string, { income: number; expenses: number }>, transaction) => {
      const month = new Date(transaction.date).toLocaleString('default', { month: 'short' });
      if (!acc[month]) {
        acc[month] = { income: 0, expenses: 0 };
      }
      if (transaction.type === 'income') {
        acc[month].income += transaction.amount;
      } else {
        acc[month].expenses += transaction.amount;
      }
      return acc;
    }, {});

    const monthlyPaymentsData = payments.reduce((acc: Record<string, number>, payment) => {
      if (payment.paid) {
        const month = new Date(payment.paymentDate!).toLocaleString('default', { month: 'short' });
        acc[month] = (acc[month] || 0) + payment.amount;
      }
      return acc;
    }, {});

    const chartData = Object.entries(monthlyData).map(([month, data]) => ({
      month,
      income: data.income + (monthlyPaymentsData[month] || 0),
      expenses: data.expenses,
      balance: data.income + (monthlyPaymentsData[month] || 0) - data.expenses
    }));

    const totals = {
      income: transactions.filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0) +
        payments.filter(p => p.paid)
        .reduce((sum, p) => sum + p.amount, 0),
      expenses: transactions.filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0),
      pendingPayments: payments.filter(p => !p.paid)
        .reduce((sum, p) => sum + p.amount, 0)
    };

    return {
      chartData,
      totals
    };
  };

  const memberStats = getMembershipStats();
  const eventStats = getEventStats();
  const financialStats = getFinancialStats();

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Relatórios</h2>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Período
        </label>
        <div className="flex gap-4">
          <input
            type="date"
            value={dateRange.start.split('T')[0]}
            onChange={e => setDateRange({ ...dateRange, start: new Date(e.target.value).toISOString() })}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <input
            type="date"
            value={dateRange.end.split('T')[0]}
            onChange={e => setDateRange({ ...dateRange, end: new Date(e.target.value).toISOString() })}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <Tabs defaultValue="members" className="w-full">
        <TabsList>
          <TabsTrigger value="members">Membros</TabsTrigger>
          <TabsTrigger value="events">Eventos</TabsTrigger>
          <TabsTrigger value="financial">Financeiro</TabsTrigger>
        </TabsList>

        <TabsContent value="members">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Membros</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={memberStats.memberTypeData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label
                      >
                        {memberStats.memberTypeData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4">
                  <p>Total de Membros: {memberStats.total}</p>
                  <p>Trabalhadores: {memberStats.workers}</p>
                  <p>Consulentes: {memberStats.consultants}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Gênero</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={memberStats.genderData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label
                      >
                        {memberStats.genderData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4">
                  <p>Masculino: {memberStats.males}</p>
                  <p>Feminino: {memberStats.females}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Distribuição por Faixa Etária</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={Object.entries(memberStats.ageGroups).map(([range, value]) => ({
                        range,
                        value
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="range" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="events">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Participação por Evento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={eventStats.eventParticipation}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="participants" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4">
                  <p>Total de Eventos: {eventStats.totalEvents}</p>
                  <p>Média de Participantes: {eventStats.averageParticipation}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Participação por Trabalhador</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nome
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Eventos
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          %
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {eventStats.workerParticipation.map((worker, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {worker.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                            {worker.events}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                            {worker.percentage}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Balanço Financeiro</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64
