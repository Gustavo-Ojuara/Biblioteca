
import React, { useState } from 'react';
import { Book, Loan, Reader } from '../types';
import { BookOpen, Tag, Calendar, Search, FileText, MapPin } from 'lucide-react';

interface Props {
  books: Book[];
  loans: Loan[];
  readers: Reader[];
}

type ReportTab = 'available' | 'genre' | 'returns';

const ReportsManager: React.FC<Props> = ({ books, loans, readers }) => {
  const [activeTab, setActiveTab] = useState<ReportTab>('available');
  const [returnDateFilter, setReturnDateFilter] = useState(new Date().toISOString().split('T')[0]);

  // Available Books Data
  const availableBooks = books.filter(b => b.status === 'available');

  // Genre Breakdown Data
  const genreData = books.reduce((acc, book) => {
    const genre = book.genre || 'Não Categorizado';
    if (!acc[genre]) acc[genre] = [];
    acc[genre].push(book);
    return acc;
  }, {} as Record<string, Book[]>);

  // Returns Data
  const scheduledReturns = loans.filter(loan => {
    if (loan.status !== 'active') return false;
    
    try {
      const loanDateObj = new Date(loan.dueDate);
      const y = loanDateObj.getFullYear();
      const m = String(loanDateObj.getMonth() + 1).padStart(2, '0');
      const d = String(loanDateObj.getDate()).padStart(2, '0');
      const formattedLoanDate = `${y}-${m}-${d}`;
      
      return formattedLoanDate === returnDateFilter;
    } catch (e) {
      return false;
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Centro de Relatórios</h1>
        <p className="text-slate-500">Acompanhe a movimentação e o estado do acervo hospitalar.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-fit">
        <button 
          onClick={() => setActiveTab('available')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'available' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <BookOpen size={16} />
          Disponíveis
        </button>
        <button 
          onClick={() => setActiveTab('genre')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'genre' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Tag size={16} />
          Por Gênero
        </button>
        <button 
          onClick={() => setActiveTab('returns')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'returns' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Calendar size={16} />
          Devoluções
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm min-h-[400px]">
        {/* Available Books Report */}
        {activeTab === 'available' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <FileText className="text-indigo-500" size={20} />
                Livros Disponíveis ({availableBooks.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableBooks.length === 0 ? (
                <p className="col-span-2 text-center text-slate-400 py-10">Não há livros disponíveis no momento.</p>
              ) : (
                availableBooks.map(book => (
                  <div key={book.id} className="p-4 border border-slate-50 rounded-xl bg-slate-50/50 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-slate-800">{book.title}</p>
                      <p className="text-xs text-slate-500">{book.author} • {book.genre}</p>
                    </div>
                    <span className="text-[10px] bg-white border border-slate-100 px-2 py-1 rounded shadow-sm text-slate-400">
                      ID: {book.id.slice(0, 8)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Genre Breakdown Report */}
        {activeTab === 'genre' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold">Acervo por Categoria</h2>
            <div className="space-y-8">
              {Object.entries(genreData).map(([genre, items]) => (
                <div key={genre} className="space-y-3">
                  <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
                    <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs font-bold">{items.length}</span>
                    <h3 className="font-bold text-slate-700 uppercase tracking-wider text-sm">{genre}</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {items.map(item => (
                      <div key={item.id} className="text-sm p-3 rounded-lg border border-slate-100 hover:border-indigo-100 transition-colors">
                        <p className="font-medium text-slate-800 truncate">{item.title}</p>
                        <p className="text-xs text-slate-400">{item.author}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Returns Schedule Report */}
        {activeTab === 'returns' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-lg font-bold">Cronograma de Devoluções</h2>
              <div className="flex items-center gap-3">
                <label className="text-xs font-bold text-slate-400 uppercase">Filtrar Data:</label>
                <input 
                  type="date" 
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={returnDateFilter}
                  onChange={(e) => setReturnDateFilter(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              {scheduledReturns.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <Calendar className="mx-auto text-slate-300 mb-2" size={32} />
                  <p className="text-slate-400">Nenhuma devolução para esta data.</p>
                </div>
              ) : (
                <div className="bg-white border border-slate-100 rounded-xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                      <tr>
                        <th className="px-6 py-3">Livro</th>
                        <th className="px-6 py-3">Leitor & Localização</th>
                        <th className="px-6 py-3">Status Atual</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {scheduledReturns.map(loan => {
                        const book = books.find(b => b.id === loan.bookId);
                        const reader = readers.find(r => r.id === loan.readerId);
                        const isOverdue = new Date(loan.dueDate) < new Date();
                        return (
                          <tr key={loan.id} className="hover:bg-indigo-50/30 transition-colors">
                            <td className="px-6 py-4">
                              <p className="font-semibold text-slate-800 text-sm">{book?.title}</p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-slate-800 font-medium text-sm">{reader?.name}</p>
                              <div className="flex items-center gap-1.5 text-[10px] text-indigo-600 font-semibold mt-1">
                                <MapPin size={10} />
                                {reader?.sector} - {reader?.wing} (Q.{reader?.room} / L.{reader?.bed})
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${isOverdue ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
                                {isOverdue ? 'ATRASADO' : 'EM DIA'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsManager;
