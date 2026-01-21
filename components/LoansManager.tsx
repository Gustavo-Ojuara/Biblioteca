
import React, { useState } from 'react';
import { Loan, Book, Reader } from '../types';
import { Plus, X, Search, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface Props {
  loans: Loan[];
  setLoans: React.Dispatch<React.SetStateAction<Loan[]>>;
  books: Book[];
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
  readers: Reader[];
}

const LoansManager: React.FC<Props> = ({ loans, setLoans, books, setBooks, readers }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedReader, setSelectedReader] = useState('');
  const [dueDate, setDueDate] = useState('');

  const availableBooks = books.filter(b => b.status === 'available');

  const handleCreateLoan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBook || !selectedReader || !dueDate) return;

    // Fix: Usar o formato ISO mas garantir que a data não mude por causa do fuso horário
    // Adicionamos 'T12:00:00' para que o objeto Date aponte para o meio-dia do dia escolhido
    const normalizedDueDate = new Date(dueDate + 'T12:00:00').toISOString();

    const newLoan: Loan = {
      id: crypto.randomUUID(),
      bookId: selectedBook,
      readerId: selectedReader,
      loanDate: new Date().toISOString(),
      dueDate: normalizedDueDate,
      status: 'active'
    };

    setLoans([...loans, newLoan]);
    setBooks(books.map(b => b.id === selectedBook ? { ...b, status: 'loaned' } : b));
    
    // Reset form
    setSelectedBook('');
    setSelectedReader('');
    setDueDate('');
    setIsModalOpen(false);
  };

  const handleReturn = (loan: Loan) => {
    setLoans(loans.map(l => l.id === loan.id ? { ...l, status: 'returned', returnDate: new Date().toISOString() } : l));
    setBooks(books.map(b => b.id === loan.bookId ? { ...b, status: 'available' } : b));
  };

  const getStatusLabel = (loan: Loan) => {
    if (loan.status === 'returned') return { label: 'Devolvido', color: 'bg-emerald-100 text-emerald-700', icon: <CheckCircle size={14} /> };
    
    // Comparação de atraso também normalizada para o dia atual
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const loanDueDate = new Date(loan.dueDate);
    
    if (loanDueDate < today) return { label: 'Atrasado', color: 'bg-rose-100 text-rose-700', icon: <AlertTriangle size={14} /> };
    return { label: 'Em Curso', color: 'bg-amber-100 text-amber-700', icon: <Clock size={14} /> };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Controle de Empréstimos</h1>
          <p className="text-slate-500">Registre saídas e acompanhe prazos de devolução.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Novo Empréstimo
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Livro / Leitor</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Data Saída</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Prazo</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loans.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">Nenhum empréstimo registrado.</td>
              </tr>
            ) : (
              loans.slice().reverse().map(loan => {
                const book = books.find(b => b.id === loan.bookId);
                const reader = readers.find(r => r.id === loan.readerId);
                const status = getStatusLabel(loan);
                return (
                  <tr key={loan.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-slate-800">{book?.title || 'Livro Removido'}</p>
                        <p className="text-xs text-slate-500">{reader?.name || 'Leitor Removido'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(loan.loanDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                      {new Date(loan.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1.5 w-fit text-xs px-2.5 py-1 rounded-full font-bold ${status.color}`}>
                        {status.icon}
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {loan.status === 'active' && (
                        <button 
                          onClick={() => handleReturn(loan)}
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                        >
                          Marcar como Devolvido
                        </button>
                      )}
                      {loan.status === 'returned' && (
                        <span className="text-xs text-slate-400 italic">
                          Devolvido em {new Date(loan.returnDate!).toLocaleDateString()}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-6">Registrar Empréstimo</h2>
            <form onSubmit={handleCreateLoan} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Livro Disponível</label>
                <select 
                  required 
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 bg-white"
                  value={selectedBook}
                  onChange={e => setSelectedBook(e.target.value)}
                >
                  <option value="">Selecione um livro...</option>
                  {availableBooks.map(b => (
                    <option key={b.id} value={b.id}>{b.title} ({b.author})</option>
                  ))}
                </select>
                {availableBooks.length === 0 && <p className="text-xs text-rose-500 mt-1">Nenhum livro disponível no momento.</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Leitor</label>
                <select 
                  required 
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 bg-white"
                  value={selectedReader}
                  onChange={e => setSelectedReader(e.target.value)}
                >
                  <option value="">Selecione o leitor...</option>
                  {readers.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Data de Devolução (Prazo)</label>
                <input 
                  type="date" 
                  required 
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
                  value={dueDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setDueDate(e.target.value)}
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">Cancelar</button>
                <button 
                  type="submit" 
                  disabled={availableBooks.length === 0}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  Confirmar Empréstimo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoansManager;
