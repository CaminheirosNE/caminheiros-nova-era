'use client';

import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
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
            <Link href="/membros" className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-medium text-gray-900">Membros</h3>
              <p className="mt-2 text-sm text-gray-500">Cadastro e gerenciamento de membros</p>
            </Link>
            
            <Link href="/eventos" className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-medium text-gray-900">Eventos</h3>
              <p className="mt-2 text-sm text-gray-500">Controle de eventos e participações</p>
            </Link>
            
            <Link href="/aniversariantes" className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-medium text-gray-900">Aniversariantes</h3>
              <p className="mt-2 text-sm text-gray-500">Acompanhamento de aniversários</p>
            </Link>
            
            <Link href="/terapias" className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-medium text-gray-900">Terapias</h3>
              <p className="mt-2 text-sm text-gray-500">Agendamento de terapias</p>
            </Link>
            
            <Link href="/senhas" className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-medium text-gray-900">Senhas</h3>
              <p className="mt-2 text-sm text-gray-500">Chamada de senhas para atendimento</p>
            </Link>
            
            <Link href="/mensalidades" className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-medium text-gray-900">Mensalidades</h3>
              <p className="mt-2 text-sm text-gray-500">Controle de mensalidades</p>
            </Link>
            
            <Link href="/financeiro" className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-medium text-gray-900">Financeiro</h3>
              <p className="mt-2 text-sm text-gray-500">Gestão financeira</p>
            </Link>
            
            <Link href="/relatorios" className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-medium text-gray-900">Relatórios</h3>
              <p className="mt-2 text-sm text-gray-500">Relatórios e análises</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
