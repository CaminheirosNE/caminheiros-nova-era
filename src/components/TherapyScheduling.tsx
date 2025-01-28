import React, { useState, useEffect } from 'react';
import { Member, Therapy, TherapySession } from '../types';
import { useProtectedRoute } from '../hooks/useProtectedRoute';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const THERAPY_TYPES = [
  { id: '1', name: 'Conversa Fraterna', maxTickets: 15 },
  { id: '2', name: 'Conversa Aruandeira', maxTickets: 15 },
  { id: '3', name: 'Passe de Macas', maxTickets: 20 },
  { id: '4', name: 'Reyki', maxTickets: 12 },
  { id: '5', name: 'Cirurgia Espiritual', maxTickets: 10 },
  { id: '6', name: 'Limpeza Espiritual', maxTickets: 15 }
];

const TherapyScheduling = () => {
  useProtectedRoute('therapy-scheduling', 4);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [therapies, setTherapies] = useState<Therapy[]>([]);
  const [memberSessions, setMemberSessions] = useState<TherapySession[]>([]);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedTherapyHistory, setSelectedTherapyHistory] = useState<{
    name: string;
    sessions: TherapySession[];
  } | null>(null);

  useEffect(() => {
    fetchTherapies();
  }, []);

  useEffect(() => {
    if (selectedMember) {
      fetchMemberSessions(selectedMember.id);
    }
  }, [selectedMember]);

  const fetchTherapies = async () => {
    try {
      const response = await fetch('/api/therapies/today');
      const data = await response.json();
      setTherapies(data);
    } catch (err) {
      setError('Erro ao carregar terapias');
    }
  };

  const searchMember = async () => {
    if (!searchTerm.trim()) {
      setError('Digite um código ou nome para buscar');
      return;
    }

    try {
      const response = await fetch(`/api/members/search?term=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();
      
      if (!data) {
        setError('Membro não encontrado');
        setSelectedMember(null);
        return;
      }

      setSelectedMember(data);
      setError('');
    } catch (err) {
      setError('Erro ao buscar membro');
      setSelectedMember(null);
    }
  };

  const fetchMemberSessions = async (memberId: string) => {
    try {
      const response = await fetch(`/api/therapy-sessions/${memberId}`);
      const data = await response.json();
      setMemberSessions(data);
    } catch (err) {
      setError('Erro ao carregar histórico de terapias');
    }
  };

  const scheduleTherapy = async (therapyId: string) => {
    if (!selectedMember) return;

    try {
      const therapy = therapies.find(t => t.id === therapyId);
      if (!therapy) throw new Error('Terapia não encontrada');

      if (therapy.currentTickets.length >= therapy.maxTickets) {
        setError('Número máximo de senhas atingido para esta terapia');
        return;
      }

      // Verificar se o membro já tem agendamento para esta terapia hoje
      const hasAppointmentToday = memberSessions.some(session => {
        const sessionDate = new Date(session.date).toDateString();
        const today = new Date().toDateString();
        return session.therapyId === therapyId && sessionDate === today;
      });

      if (hasAppointmentToday) {
        setError('Membro já possui agendamento para esta terapia hoje');
        return;
      }

      const response = await fetch('/api/therapy-sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memberId: selectedMember.id,
          therapyId,
          date: new Date().toISOString(),
          ticketNumber: therapy.currentTickets.length + 1,
        }),
      });

      if (!response.ok) throw new Error('Erro ao agendar terapia');

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      
      await Promise.all([
        fetchTherapies(),
        fetchMemberSessions(selectedMember.id)
      ]);
      
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao agendar terapia');
    }
  };

  const showTherapyHistory = (therapyId: string) => {
    const therapy = THERAPY_TYPES.find(t => t.id === therapyId);
    if (!therapy) return;

    const sessions = memberSessions
      .filter(session => session.therapyId === therapyId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setSelectedTherapyHistory({
      name: therapy.name,
      sessions
    });
    setShowHistory(true);
  };

  const getSessionCount = (therapyId: string): number => {
    return memberSessions.filter(session => session.therapyId === therapyId).length;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Agendamento de Terapias</h2>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>{error}</AlertTitle>
        </Alert>
      )}

      {success && (
        <Alert className="mb-4">
          <AlertTitle>Terapia agendada com sucesso!</AlertTitle>
        </Alert>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Buscar Membro</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Digite o código ou nome do membro"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <button
              onClick={searchMember}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Buscar
            </button>
          </div>
        </CardContent>
      </Card>

      {selectedMember && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dados do Membro</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Nome</p>
                  <p className="mt-1">{selectedMember.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Código</p>
                  <p className="mt-1">{selectedMember.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Tipo</p>
                  <p className="mt-1">{selectedMember.type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Telefone</p>
                  <p className="mt-1">{selectedMember.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {THERAPY_TYPES.map(therapyType => {
              const therapy = therapies.find(t => t.id === therapyType.id);
              const currentTickets = therapy?.currentTickets.length || 0;
              const sessionCount = getSessionCount(therapyType.id);

              return (
                <Card key={therapyType.id}>
                  <CardHeader>
                    <CardTitle>{therapyType.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Senhas Disponíveis:</span>
                        <span className="font-medium">
                          {therapyType.maxTickets - currentTickets}/{therapyType.maxTickets}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Sessões Realizadas:</span>
                        <button
                          onClick={() => showTherapyHistory(therapyType.id)}
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          {sessionCount}
                        </button>
                      </div>
                      <button
                        onClick={() => scheduleTherapy(therapyType.id)}
                        disabled={currentTickets >= therapyType.maxTickets}
                        className={`w-full px-4 py-2 rounded-md text-white ${
                          currentTickets >= therapyType.maxTickets
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700'
                        }`}
                      >
                        Agendar
                      </button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Histórico de {selectedTherapyHistory?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Senha
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {selectedTherapyHistory?.sessions.map((session, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(session.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {session.ticketNumber}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TherapyScheduling;
