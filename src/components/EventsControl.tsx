import React, { useState, useEffect } from 'react';
import { Event, Member } from '../types';
import { useProtectedRoute } from '../hooks/useProtectedRoute';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const EventsControl = () => {
  useProtectedRoute('events-control', 4);
  const [events, setEvents] = useState<Event[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({});
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [dateFilter, setDateFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);

  useEffect(() => {
    fetchData();
  }, [dateFilter]);

  const fetchData = async () => {
    try {
      const [eventsRes, membersRes] = await Promise.all([
        fetch(dateFilter ? `/api/events?date=${dateFilter}` : '/api/events'),
        fetch('/api/members?type=Trabalhador')
      ]);
      
      const [eventsData, membersData] = await Promise.all([
        eventsRes.json(),
        membersRes.json()
      ]);

      setEvents(eventsData);
      setMembers(membersData);
    } catch (err) {
      setError('Erro ao carregar dados');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!newEvent.title || !newEvent.date) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newEvent,
          participants: [],
          createdAt: new Date().toISOString()
        }),
      });

      if (!response.ok) throw new Error('Erro ao criar evento');

      setSuccess(true);
      setNewEvent({});
      fetchData();
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar evento');
    }
  };

  const handleParticipation = async (eventId: string, memberId: string) => {
    try {
      const event = events.find(e => e.id === eventId);
      if (!event) return;

      const isParticipating = event.participants.includes(memberId);
      const updatedParticipants = isParticipating
        ? event.participants.filter(id => id !== memberId)
        : [...event.participants, memberId];

      const response = await fetch(`/api/events/${eventId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participants: updatedParticipants }),
      });

      if (!response.ok) throw new Error('Erro ao atualizar participação');

      fetchData();
    } catch (err) {
      setError('Erro ao atualizar participação');
    }
  };

  const confirmDelete = (event: Event) => {
    setEventToDelete(event);
    setShowDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (!eventToDelete) return;

    try {
      const response = await fetch(`/api/events/${eventToDelete.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Erro ao excluir evento');

      fetchData();
      setShowDeleteDialog(false);
      setEventToDelete(null);
    } catch (err) {
      setError('Erro ao excluir evento');
    }
  };

  const filteredEvents = events.filter(event => {
    const searchLower = searchTerm.toLowerCase();
    return event.title.toLowerCase().includes(searchLower) ||
           event.description?.toLowerCase().includes(searchLower);
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Controle de Eventos</h2>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>{error}</AlertTitle>
        </Alert>
      )}

      {success && (
        <Alert className="mb-4">
          <AlertTitle>Evento criado com sucesso!</AlertTitle>
        </Alert>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Novo Evento</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nome do Evento
              </label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={newEvent.title || ''}
                onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Data
              </label>
              <input
                type="datetime-local"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={newEvent.date || ''}
                onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Descrição
              </label>
              <textarea
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                rows={3}
                value={newEvent.description || ''}
                onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Criar Evento
            </button>
          </form>
        </CardContent>
      </Card>

      <div className="mb-6 flex gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar eventos..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <input
          type="date"
          value={dateFilter}
          onChange={e => setDateFilter(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div className="space-y-4">
        {filteredEvents.map(event => (
          <Card key={event.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{event.title}</CardTitle>
                  <p className="text-sm text-gray-500">
                    {format(new Date(event.date), "PPPp", { locale: ptBR })}
                  </p>
                </div>
                <button
                  onClick={() => confirmDelete(event)}
                  className="text-red-600 hover:text-red-800"
                >
                  Excluir
                </button>
              </div>
            </CardHeader>
            <CardContent>
              {event.description && (
                <p className="text-gray-700 mb-4">{event.description}</p>
              )}
              <div className="space-y-2">
                <h4 className="font-medium">Participantes ({event.participants.length}):</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {members.map(member => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <span>{member.name}</span>
                      <button
                        onClick={() => handleParticipation(event.id, member.id)}
                        className={`px-3 py-1 rounded text-sm font-medium ${
                          event.participants.includes(member.id)
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {event.participants.includes(member.id)
                          ? 'Confirmado'
                          : 'Confirmar'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <p>
            Tem certeza que deseja excluir o evento "{eventToDelete?.title}"?
            Esta ação não pode ser desfeita.
          </p>
          <DialogFooter className="flex space-x-4">
            <button
              onClick={() => setShowDeleteDialog(false)}
              className="px-4 py-2 text-gray-700 border rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Excluir
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventsControl;
