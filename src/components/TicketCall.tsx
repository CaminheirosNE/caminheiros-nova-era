import React, { useState, useEffect, useCallback } from 'react';
import { TherapySession, Member, Therapy } from '../types';
import { useProtectedRoute } from '../hooks/useProtectedRoute';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

const NOTICE = `Pedimos a gentileza de não entrar nas terapias portando chaves, óculos, carteira e celular. Se estiver utilizando cinto, abrir ou retirar. Retirar os calçados.`;

const THERAPY_CONFIGS = {
  'Conversa Fraterna': { callCount: 1, location: 'Sala de atendimento' },
  'Conversa Aruandeira': { callCount: 1, location: 'Sala de atendimento' },
  'Passe de Macas': { callCount: 3, location: 'Sala de espera' },
  'Reyki': { callCount: 2, location: 'Sala de espera' },
  'Cirurgia Espiritual': { callCount: 2, location: 'Sala de espera' },
  'Limpeza Espiritual': { callCount: 1, location: 'Sala de atendimento' }
};

const TicketCall = () => {
  useProtectedRoute('ticket-call', 3);

  const [selectedTherapy, setSelectedTherapy] = useState<string>('');
  const [therapies, setTherapies] = useState<Therapy[]>([]);
  const [sessions, setSessions] = useState<TherapySession[]>([]);
  const [members, setMembers] = useState<Record<string, Member>>({});
  const [currentCalls, setCurrentCalls] = useState<TherapySession[]>([]);
  const [nextCalls, setNextCalls] = useState<TherapySession[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Atualiza a cada 30 segundos
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [therapiesRes, sessionsRes, membersRes] = await Promise.all([
        fetch('/api/therapies'),
        fetch('/api/therapy-sessions/today'),
        fetch('/api/members')
      ]);

      const [therapiesData, sessionsData, membersData] = await Promise.all([
        therapiesRes.json(),
        sessionsRes.json(),
        membersRes.json()
      ]);

      setTherapies(therapiesData);
      setSessions(sessionsData.sort((a: TherapySession, b: TherapySession) => 
        a.ticketNumber - b.ticketNumber
      ));
      
      const membersMap = membersData.reduce((acc: Record<string, Member>, member: Member) => {
        acc[member.id] = member;
        return acc;
      }, {});
      setMembers(membersMap);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const playCallSound = useCallback(() => {
    if (!soundEnabled) return;
    const audio = new Audio('/sounds/call-sound.mp3');
    audio.play().catch(console.error);
  }, [soundEnabled]);

  const handleTherapySelect = async (therapyName: string) => {
    setSelectedTherapy(therapyName);
    const therapy = therapies.find(t => t.name === therapyName);
    if (!therapy) return;

    const therapyConfig = THERAPY_CONFIGS[therapyName as keyof typeof THERAPY_CONFIGS];
    const uncalledSessions = sessions.filter(s => 
      s.therapyId === therapy.id && !s.called
    );

    setCurrentCalls(uncalledSessions.slice(0, therapyConfig.callCount));
    setNextCalls(uncalledSessions.slice(therapyConfig.callCount));
  };

  const callNext = async () => {
    if (!selectedTherapy || isAnimating || nextCalls.length === 0) return;

    setIsAnimating(true);
    playCallSound();

    const therapy = therapies.find(t => t.name === selectedTherapy);
    if (!therapy) return;

    try {
      const nextCall = nextCalls[0];
      await fetch(`/api/therapy-sessions/${nextCall.id}/call`, { method: 'POST' });

      // Atualiza a lista de chamadas
      const updatedCurrentCalls = [...currentCalls.slice(1), nextCall];
      const updatedNextCalls = nextCalls.slice(1);

      setCurrentCalls(updatedCurrentCalls);
      setNextCalls(updatedNextCalls);

      // Atualiza o estado local das sessões
      setSessions(sessions.map(s => 
        s.id === nextCall.id ? { ...s, called: true } : s
      ));

      setTimeout(() => setIsAnimating(false), 1000);
    } catch (err) {
      console.error('Error calling next ticket:', err);
      setIsAnimating(false);
    }
  };

  const getTherapyConfig = (therapyName: string) => 
    THERAPY_CONFIGS[therapyName as keyof typeof THERAPY_CONFIGS];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Chamada de Senhas</h1>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-full ${
                soundEnabled ? 'bg-green-500' : 'bg-gray-400'
              }`}
            >
              <span className="sr-only">
                {soundEnabled ? 'Desativar Som' : 'Ativar Som'}
              </span>
              {/* Ícone de som */}
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {soundEnabled ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.536 8.464a5 5 0 010 7.072M12 6v12m0 0l-4-4m4 4l4-4"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                  />
                )}
              </svg>
            </button>
          </div>

          <div className="flex flex-wrap gap-4">
            {therapies.map(therapy => (
              <button
                key={therapy.id}
                onClick={() => handleTherapySelect(therapy.name)}
                className={`px-4 py-2 rounded-md ${
                  selectedTherapy === therapy.name
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {therapy.name}
              </button>
            ))}
          </div>
        </div>

        {selectedTherapy && (
          <Card className="bg-white shadow-xl rounded-lg overflow-hidden">
            <CardHeader className="bg-indigo-700 text-white">
              <CardTitle className="text-2xl">{selectedTherapy}</CardTitle>
              <p className="mt-2 text-indigo-100">{NOTICE}</p>
            </CardHeader>

            <CardContent className="p-6">
              <AnimatePresence mode="wait">
                <div key={currentCalls.map(c => c.id).join('-')} className="space-y-8">
                  {currentCalls.map((call, index) => (
                    <motion.div
                      key={call.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="text-center"
                    >
                      <h3 className="text-4xl font-bold text-gray-900">
                        Senha: {call.ticketNumber}
                      </h3>
                      <p className="text-2xl text-gray-600 mt-2">
                        {members[call.memberId]?.name}
                      </p>
                      <p className="text-xl text-gray-500 mt-1">
                        {getTherapyConfig(selectedTherapy).location}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>

              {nextCalls.length > 0 && (
                <div className="mt-8 border-t pt-4">
                  <h4 className="text-lg font-medium text-gray-700 mb-2">
                    Próximas Chamadas:
                  </h4>
                  <div className="space-y-2">
                    {nextCalls.slice(0, 3).map(call => (
                      <div key={call.id} className="text-gray-600">
                        Senha {call.ticketNumber} - {members[call.memberId]?.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8">
                <button
                  onClick={callNext}
                  disabled={isAnimating || nextCalls.length === 0}
                  className={`w-full px-6 py-3 text-lg font-medium rounded-md text-white ${
                    isAnimating || nextCalls.length === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {isAnimating ? 'Chamando...' : 'Chamar Próxima Senha'}
                </button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TicketCall;
