import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import MemberRegistration from '../components/MemberRegistration';
import TherapyScheduling from '../components/TherapyScheduling';
import TicketCall from '../components/TicketCall';
import FinancialControl from '../components/FinancialControl';
import Reports from '../components/Reports';
import EventsControl from '../components/EventsControl';
import Birthdays from '../components/Birthdays';
import MonthlyPayments from '../components/MonthlyPayments';

export default function Home() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  Casa Espiritualista Caminheiros da Nova Era
                </h1>
                <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                  Sistema de Gestão
                </p>
              </div>
              
              <div className="mt-10">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <a href="/members" className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                    <h3 className="text-lg font-medium text-gray-900">Membros</h3>
                    <p className="mt-2 text-sm text-gray-500">Cadastro e gerenciamento de membros</p>
                  </a>
                  
                  <a href="/events" className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                    <h3 className="text-lg font-medium text-gray-900">Eventos</h3>
                    <p className="mt-2 text-sm text-gray-500">Controle de eventos e participações</p>
                  </a>
                  
                  <a href="/birthdays" className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                    <h3 className="text-lg font-medium text-gray-900">Aniversariantes</h3>
                    <p className="mt-2 text-sm text-gray-500">Acompanhamento de aniversários</p>
                  </a>
                  
                  <a href="/therapies" className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                    <h3 className="text-lg font-medium text-gray-900">Terapias</h3>
                    <p className="mt-2 text-sm text-gray-500">Agendamento de terapias</p>
                  </a>
                  
                  <a href="/tickets" className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                    <h3 className="text-lg font-medium text-gray-900">Senhas</h3>
                    <p className="mt-2 text-sm text-gray-500">Chamada de senhas para atendimento</p>
                  </a>
                  
                  <a href="/monthly-payments" className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                    <h3 className="text-lg font-medium text-gray-900">Mensalidades</h3>
                    <p className="mt-2 text-sm text-gray-500">Controle de mensalidades</p>
                  </a>
                  
                  <a href="/financial" className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                    <h3 className="text-lg font-medium text-gray-900">Financeiro</h3>
                    <p className="mt-2 text-sm text-gray-500">Gestão financeira</p>
                  </a>
                  
                  <a href="/reports" className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                    <h3 className="text-lg font-medium text-gray-900">Relatórios</h3>
                    <p className="mt-2 text-sm text-gray-500">Relatórios e análises</p>
                  </a>
                </div>
              </div>
            </div>
          </div>
        } />
        <Route path="/members" element={<MemberRegistration />} />
        <Route path="/events" element={<EventsControl />} />
        <Route path="/birthdays" element={<Birthdays />} />
        <Route path="/therapies" element={<TherapyScheduling />} />
        <Route path="/tickets" element={<TicketCall />} />
        <Route path="/monthly-payments" element={<MonthlyPayments />} />
        <Route path="/financial" element={<FinancialControl />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </Router>
  );
}