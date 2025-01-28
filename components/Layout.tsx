import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Link from 'next/link';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <img className="h-8 w-auto" src="/logo.png" alt="Logo" />
                <span className="ml-2 text-xl font-bold text-gray-900">Caminheiros da Nova Era</span>
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/members"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('/members')}`}
                >
                  Membros
                </Link>
                <Link
                  to="/events"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('/events')}`}
                >
                  Eventos
                </Link>
                <Link
                  to="/birthdays"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('/birthdays')}`}
                >
                  Aniversariantes
                </Link>
                <Link
                  to="/therapies"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('/therapies')}`}
                >
                  Terapias
                </Link>
                <Link
                  to="/tickets"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('/tickets')}`}
                >
                  Senhas
                </Link>
                <Link
                  to="/monthly-payments"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('/monthly-payments')}`}
                >
                  Mensalidades
                </Link>
                <Link
                  to="/financial"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('/financial')}`}
                >
                  Financeiro
                </Link>
                <Link
                  to="/reports"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('/reports')}`}
                >
                  Relatórios
                </Link>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="ml-3 relative">
                <span className="text-sm text-gray-500">
                  Bem-vindo(a), Administrador
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/members"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive('/members').replace('border-b-2', 'border-l-4')
              }`}
            >
              Membros
            </Link>
            <Link
              to="/events"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive('/events').replace('border-b-2', 'border-l-4')
              }`}
            >
              Eventos
            </Link>
            <Link
              to="/birthdays"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive('/birthdays').replace('border-b-2', 'border-l-4')
              }`}
            >
              Aniversariantes
            </Link>
            <Link
              to="/therapies"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive('/therapies').replace('border-b-2', 'border-l-4')
              }`}
            >
              Terapias
            </Link>
            <Link
              to="/tickets"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive('/tickets').replace('border-b-2', 'border-l-4')
              }`}
            >
              Senhas
            </Link>
            <Link
              to="/monthly-payments"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive('/monthly-payments').replace('border-b-2', 'border-l-4')
              }`}
            >
              Mensalidades
            </Link>
            <Link
              to="/financial"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive('/financial').replace('border-b-2', 'border-l-4')
              }`}
            >
              Financeiro
            </Link>
            <Link
              to="/reports"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive('/reports').replace('border-b-2', 'border-l-4')
              }`}
            >
              Relatórios
            </Link>
          </div>
        </div>
      </nav>

      <main className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
