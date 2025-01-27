import React, { useState, useEffect } from 'react';
import { Member } from '../types';
import { useProtectedRoute } from '../hooks/useProtectedRoute';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const Birthdays = () => {
  useProtectedRoute('birthdays', 3);
  const [members, setMembers] = useState<Member[]>([]);
  const [customMessage, setCustomMessage] = useState<string>(
    'Feliz aniversário! Que seu dia seja repleto de alegria e bênçãos!'
  );

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/members');
      const data = await response.json();
      setMembers(data);
    } catch (err) {
      console.error('Error fetching members:', err);
    }
  };

  const getBirthdayMembers = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();

    const monthBirthdays = members.filter(member => {
      const birthDate = new Date(member.birthDate);
      return birthDate.getMonth() === currentMonth;
    });

    const todayBirthdays = monthBirthdays.filter(member => {
      const birthDate = new Date(member.birthDate);
      return birthDate.getDate() === currentDay;
    });

    return {
      month: monthBirthdays.sort((a, b) => {
        const dateA = new Date(a.birthDate);
        const dateB = new Date(b.birthDate);
        return dateA.getDate() - dateB.getDate();
      }),
      today: todayBirthdays
    };
  };

  const formatPhoneNumber = (phone: string) => {
    return phone.replace(/\D/g, '');
  };

  const getWhatsAppLink = (phone: string, name: string) => {
    const formattedPhone = formatPhoneNumber(phone);
    const message = encodeURIComponent(customMessage);
    return `https://wa.me/${formattedPhone}?text=${message}`;
  };

  const { month: monthBirthdays, today: todayBirthdays } = getBirthdayMembers();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Aniversariantes</h2>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Mensagem Personalizada</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            value={customMessage}
            onChange={e => setCustomMessage(e.target.value)}
            className="w-full p-2 border rounded-md"
            rows={3}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Aniversariantes do Dia</CardTitle>
          </CardHeader>
          <CardContent>
            {todayBirthdays.length > 0 ? (
              <ul className="space-y-4">
                {todayBirthdays.map(member => (
                  <li
                    key={member.id}
                    className="flex items-center justify-between p-2 border rounded"
                  >
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.phone}</p>
                    </div>
                    <a
                      href={getWhatsAppLink(member.phone, member.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      WhatsApp
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Nenhum aniversariante hoje</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Aniversariantes do Mês</CardTitle>
          </CardHeader>
          <CardContent>
            {monthBirthdays.length > 0 ? (
              <ul className="space-y-4">
                {monthBirthdays.map(member => {
                  const birthDate = new Date(member.birthDate);
                  return (
                    <li
                      key={member.id}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-gray-500">
                          Dia {birthDate.getDate()}
                        </p>
                      </div>
                      <a
                        href={getWhatsAppLink(member.phone, member.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        WhatsApp
                      </a>
                    </li>
                  )})}
              </ul>
            ) : (
              <p className="text-gray-500">Nenhum aniversariante este mês</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Birthdays;
