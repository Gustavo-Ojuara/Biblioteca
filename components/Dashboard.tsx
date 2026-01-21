
import React from 'react';
import { Book, Reader, Loan } from '../types';
import { BookOpen, Users, ClipboardCheck, AlertCircle, MapPin } from 'lucide-react';

interface Props {
  books: Book[];
  readers: Reader[];
  loans: Loan[];
}

const Dashboard: React.FC<Props> = ({ books, readers, loans }) => {
  const activeLoans = loans.filter(l => l.status === 'active').length;
  const overdueLoans = loans.filter(l => l.status === 'active' && new Date(l.dueDate) < new Date()).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Bem-vindo à BiblioSmart</h1>
        <p className="text-slate-500 mt-2">Visão geral da sua biblioteca hospitalar hoje.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-indigo-50 text-indigo-600 rounded-xl">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Total de Livros</p>
            <p className="text-2xl font-bold">{books.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl">
            <Users size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Leitores Ativos</p>
            <p className="text-2xl font-bold">{readers.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-amber-50 text-amber-600 rounded-xl">
            <ClipboardCheck size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Empréstimos</p>
            <p className="text-2xl font-bold">{activeLoans}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-rose-50 text-rose-600 rounded-xl">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Atrasados</p>
            <p className="text-2xl font-bold">{overdueLoans}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Empréstimos Recentes</h2>
          <div className="space-y-4">
            {loans.length === 0 ? (
              <p className="text-slate-400 text-center py-8">Nenhum empréstimo registrado.</p>
            ) : (
              loans.slice(-5).reverse().map(loan => {
                const book = books.find(b => b.id === loan.bookId);
                const reader = readers.find(r => r.id === loan.readerId);
                return (
                  <div key={loan.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-100 transition-all">
                    <div>
                      <p className="font-semibold text-slate-800">{book?.title || 'Livro Removido'}</p>
                      <p className="text-sm text-slate-500">{reader?.name || 'Leitor Removido'}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      loan.status === 'returned' ? 'bg-emerald-100 text-emerald-700' :
                      new Date(loan.dueDate) < new Date() ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {loan.status === 'returned' ? 'Devolvido' : 
                       new Date(loan.dueDate) < new Date() ? 'Atrasado' : 'Em curso'}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Novos Leitores</h2>
          <div className="space-y-4">
             {readers.length === 0 ? (
               <p className="text-slate-400 text-center py-8">Nenhum leitor cadastrado.</p>
             ) : (
               readers.slice(-5).reverse().map(reader => (
                 <div key={reader.id} className="flex items-center gap-3 p-3">
                   <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                     {reader.name.charAt(0)}
                   </div>
                   <div className="flex-1">
                     <p className="font-semibold text-slate-800">{reader.name}</p>
                     <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                           Internação: {reader.admissionDate ? new Date(reader.admissionDate).toLocaleDateString() : 'N/A'}
                        </span>
                        <span className="text-[10px] text-indigo-500 flex items-center gap-0.5 font-medium">
                           <MapPin size={10} /> {reader.sector} (Q.{reader.room})
                        </span>
                     </div>
                   </div>
                 </div>
               ))
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
