
export interface Reader {
  id: string;
  name: string;
  email?: string; 
  phone?: string;
  joinedAt: string;
  admissionDate?: string;
  sector?: string;
  wing?: string;
  room?: string;
  bed?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  genre: string;
  description: string;
  status: 'available' | 'loaned';
}

export interface Loan {
  id: string;
  bookId: string;
  readerId: string;
  loanDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'active' | 'returned' | 'overdue';
}

export type View = 'dashboard' | 'books' | 'readers' | 'loans' | 'reports';
