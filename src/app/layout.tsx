import React from 'react';
import Link from 'next/link';
import '../../styles/globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <title>Casa Espiritualista Caminheiros da Nova Era</title>
        <meta name="description" content="Sistema de Gestão da Casa Espiritualista" />
      </head>
      <body>
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Link href="/" className="text-xl font-bold">Caminheiros da Nova Era</Link>
                </div>
                <div className="hidden md:ml-6 md:flex md:space-x-8">
                  <Link href="/membros" className="px-3 py-2 text-gray-900 hover:text-gray-600">Membros</Link>
                  <Link href="/eventos" className="px-3 py-2 text-gray-900 hover:text-gray-600">Eventos</Link>
                  <Link href="/aniversariantes" className="px-3 py-2 text-gray-900 hover:text-gray-600">Aniversariantes</Link>
                  <Link href="/terapias" className="px-3 py-2 text-gray-900 hover:text-gray-600">Terapias</Link>
                  <Link href="/senhas" className="px-3 py-2 text-gray-900 hover:text-gray-600">Senhas</Link>
                  <Link href="/mensalidades" className="px-3 py-2 text-gray-900 hover:text-gray-600">Mensalidades</Link>
                  <Link href="/financeiro" className="px-3 py-2 text-gray-900 hover:text-gray-600">Financeiro</Link>
                  <Link href="/relatorios" className="px-3 py-2 text-gray-900 hover:text-gray-600">Relatórios</Link>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
