import React from 'react';
import { Link } from 'react-router-dom';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <title>Casa Espiritualista Caminheiros da Nova Era</title>
      </head>
      <body>
        <div className="min-h-screen bg-gray-100">
          <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center">
                    <img className="h-8 w-auto" src="/logo.png" alt="Logo" />
                    <span className="ml-2 text-xl font-bold">Caminheiros da Nova Era</span>
                  </div>
                  <div className="hidden md:ml-6 md:flex md:space-x-8">
                    <Link to="/members" className="px-3 py-2 text-gray-900 hover:text-gray-600">Membros</Link>
                    <Link to="/events" className="px-3 py-2 text-gray-900 hover:text-gray-600">Eventos</Link>
                    <Link to="/birthdays" className="px-3 py-2 text-gray-900 hover:text-gray-600">Aniversariantes</Link>
                    <Link to="/therapies" className="px-3 py-2 text-gray-900 hover:text-gray-600">Terapias</Link>
                    <Link to="/tickets" className="px-3 py-2 text-gray-900 hover:text-gray-600">Senhas</Link>
                    <Link to="/monthly-payments" className="px-3 py-2 text-gray-900 hover:text-gray-600">Mensalidades</Link>
                    <Link to="/financial" className="px-3 py-2 text-gray-900 hover:text-gray-600">Financeiro</Link>
                    <Link to="/reports" className="px-3 py-2 text-gray-900 hover:text-gray-600">Relatórios</Link>
                  </div>
                </div>
              </div>
            </div>
          </nav>
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}