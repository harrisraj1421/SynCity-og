export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  campus: string;
  role: 'student' | 'faculty' | 'admin';
}

export interface Wallet {
    userId: string;
    balance: number;
}

export interface WalletTransaction {
    id: string;
    userId: string;
    amount: number;
    type: 'credit' | 'debit';
    description: string;
    date: string;
}


export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  campus: string;
  isAvailable: boolean;
}

export interface LibraryTransaction {
  id: string;
  bookId: string;
  userId: string;
  issueDate: string;
  dueDate: string;
  returnDate: string | null;
}

export interface CanteenItem {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  rating: number;
}

export interface OrderItem {
    item: CanteenItem;
    quantity: number;
}

export enum OrderStatus {
  PENDING = 'Pending',
  PREPARING = 'Preparing',
  READY = 'Ready for Pickup',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

export interface CanteenOrder {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  orderDate: string;
  token: number;
}

export interface Fine {
  id: string;
  userId: string;
  amount: number;
  reason: string;
  transactionId?: string;
  isPaid: boolean;
  date: string;
}

export interface AcademicResource {
    id: string;
    title: string;
    type: 'notes' | 'project-kit' | 'paper';
    uploader: string;
    campus: string;
    downloadUrl: string;
    description: string;
}

export interface AdminStat {
    label: string;
    value: string;
    change: number;
}

export interface ChartData {
    name: string;
    value: number;
    // Fix: Add index signature for compatibility with recharts library
    [key: string]: any;
}