
import { User, Book, LibraryTransaction, CanteenItem, CanteenOrder, Fine, AcademicResource, OrderStatus, OrderItem, AdminStat, ChartData } from '../types';

// --- MOCK DATABASE ---

const users: User[] = [
  { id: 'u1', name: 'Alex Johnson', avatarUrl: 'https://i.pravatar.cc/150?u=alex', campus: 'North Campus', role: 'student' },
  { id: 'u2', name: 'Maria Garcia', avatarUrl: 'https://i.pravatar.cc/150?u=maria', campus: 'South Campus', role: 'student' },
  { id: 'a1', name: 'Dr. Evelyn Reed', avatarUrl: 'https://i.pravatar.cc/150?u=evelyn', campus: 'Main Campus', role: 'admin' },
];

const books: Book[] = [
  { id: 'b1', title: 'The Digital Fortress', author: 'Dan Brown', coverUrl: 'https://picsum.photos/seed/df/300/400', campus: 'North Campus', isAvailable: true },
  { id: 'b2', title: 'Structure and Interpretation of Computer Programs', author: 'Harold Abelson', coverUrl: 'https://picsum.photos/seed/sicp/300/400', campus: 'Main Campus', isAvailable: false },
  { id: 'b3', title: 'Clean Code', author: 'Robert C. Martin', coverUrl: 'https://picsum.photos/seed/cc/300/400', campus: 'South Campus', isAvailable: true },
  { id: 'b4', title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', coverUrl: 'https://picsum.photos/seed/ita/300/400', campus: 'North Campus', isAvailable: true },
  { id: 'b5', title: 'Design Patterns', author: 'Erich Gamma', coverUrl: 'https://picsum.photos/seed/dp/300/400', campus: 'Main Campus', isAvailable: false },
];

const libraryTransactions: LibraryTransaction[] = [
  { id: 'lt1', bookId: 'b2', userId: 'u1', issueDate: '2023-10-01', dueDate: '2023-10-15', returnDate: null },
  { id: 'lt2', bookId: 'b5', userId: 'u1', issueDate: '2023-10-05', dueDate: '2023-10-19', returnDate: null },
];

const canteenItems: CanteenItem[] = [
    { id: 'c1', name: 'Veggie Burger', category: 'Main Course', price: 5.99, imageUrl: 'https://picsum.photos/seed/burger/400/300', rating: 4.5 },
    { id: 'c2', name: 'Chicken Pasta', category: 'Main Course', price: 7.50, imageUrl: 'https://picsum.photos/seed/pasta/400/300', rating: 4.8 },
    { id: 'c3', name: 'Iced Coffee', category: 'Beverages', price: 3.00, imageUrl: 'https://picsum.photos/seed/coffee/400/300', rating: 4.7 },
    { id: 'c4', name: 'Caesar Salad', category: 'Salads', price: 4.50, imageUrl: 'https://picsum.photos/seed/salad/400/300', rating: 4.2 },
    { id: 'c5', name: 'Fruit Bowl', category: 'Snacks', price: 3.50, imageUrl: 'https://picsum.photos/seed/fruit/400/300', rating: 4.9 },
    { id: 'c6', name: 'Margherita Pizza', category: 'Main Course', price: 8.99, imageUrl: 'https://picsum.photos/seed/pizza/400/300', rating: 4.6 },
];

const canteenOrders: CanteenOrder[] = [
  { id: 'o1', userId: 'u1', items: [{ item: canteenItems[0], quantity: 1 }, { item: canteenItems[2], quantity: 1 }], total: 8.99, status: OrderStatus.READY, orderDate: new Date().toISOString(), token: 101 },
  { id: 'o2', userId: 'u1', items: [{ item: canteenItems[1], quantity: 2 }], total: 15.00, status: OrderStatus.PREPARING, orderDate: new Date().toISOString(), token: 102 },
];

const fines: Fine[] = [
  { id: 'f1', userId: 'u1', amount: 5.00, reason: 'Late return: Structure and Interpretation of Computer Programs', transactionId: 'lt1', isPaid: false, date: '2023-10-18' },
];

const academicResources: AcademicResource[] = [
    { id: 'ar1', title: 'Advanced React Hooks Notes', type: 'notes', uploader: 'Maria Garcia', campus: 'South Campus', downloadUrl: '#', description: 'Comprehensive notes covering useEffect, useCallback, and custom hooks.' },
    { id: 'ar2', title: 'AI/ML Project Kit: Image Recognition', type: 'project-kit', uploader: 'Admin', campus: 'Main Campus', downloadUrl: '#', description: 'Starter kit with datasets and Python notebooks for an image recognition project.' },
    { id: 'ar3', title: 'Quantum Computing Research Paper', type: 'paper', uploader: 'Dr. Evelyn Reed', campus: 'Main Campus', downloadUrl: '#', description: 'A paper on the latest advancements in quantum entanglement.' },
];

// --- MOCK API FUNCTIONS ---

const mockApiCall = <T,>(data: T, delay = 500): Promise<T> => {
  return new Promise(resolve => setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), delay));
};

export const getCurrentUser = (): Promise<User> => mockApiCall(users[0]);

export const searchBooks = (query: string): Promise<Book[]> => {
  const lowerQuery = query.toLowerCase();
  const results = books.filter(b => b.title.toLowerCase().includes(lowerQuery) || b.author.toLowerCase().includes(lowerQuery));
  return mockApiCall(results);
};

export const getMyBooks = (userId: string): Promise<{ book: Book; transaction: LibraryTransaction }[]> => {
  const userTransactions = libraryTransactions.filter(t => t.userId === userId && !t.returnDate);
  const results = userTransactions.map(t => ({
    book: books.find(b => b.id === t.bookId)!,
    transaction: t,
  }));
  return mockApiCall(results);
};

export const getCanteenMenu = (): Promise<CanteenItem[]> => mockApiCall(canteenItems);

export const placeCanteenOrder = (userId: string, items: OrderItem[]): Promise<CanteenOrder> => {
    const total = items.reduce((sum, orderItem) => sum + orderItem.item.price * orderItem.quantity, 0);
    const newOrder: CanteenOrder = {
        id: `o${canteenOrders.length + 1}`,
        userId,
        items,
        total,
        status: OrderStatus.PENDING,
        orderDate: new Date().toISOString(),
        token: Math.floor(Math.random() * 900) + 100,
    };
    canteenOrders.push(newOrder);
    // Simulate order processing
    setTimeout(() => {
        const order = canteenOrders.find(o => o.id === newOrder.id);
        if (order) order.status = OrderStatus.PREPARING;
    }, 2000);
     setTimeout(() => {
        const order = canteenOrders.find(o => o.id === newOrder.id);
        if (order) order.status = OrderStatus.READY;
    }, 5000);
    return mockApiCall(newOrder, 300);
};

export const getMyOrders = (userId: string): Promise<CanteenOrder[]> => mockApiCall(canteenOrders.filter(o => o.userId === userId).sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()));

export const getMyFines = (userId: string): Promise<Fine[]> => mockApiCall(fines.filter(f => f.userId === userId));

export const getAcademicResources = (): Promise<AcademicResource[]> => mockApiCall(academicResources);

// Admin Analytics
export const getAdminStats = (): Promise<AdminStat[]> => {
    return mockApiCall([
        { label: 'Total Students', value: '12,450', change: 2.5 },
        { label: 'Books Issued Today', value: '312', change: 10 },
        { label: 'Canteen Revenue (Today)', value: '$4,580', change: -1.2 },
        { label: 'Overdue Fines', value: '$875', change: 5 },
    ]);
};

export const getLibraryActivity = (): Promise<ChartData[]> => {
    return mockApiCall([
        { name: 'Mon', value: 240 },
        { name: 'Tue', value: 310 },
        { name: 'Wed', value: 290 },
        { name: 'Thu', value: 350 },
        { name: 'Fri', value: 480 },
        { name: 'Sat', value: 150 },
    ]);
};

export const getCanteenSales = (): Promise<ChartData[]> => {
    return mockApiCall([
        { name: 'Main Course', value: 400 },
        { name: 'Beverages', value: 300 },
        { name: 'Snacks', value: 300 },
        { name: 'Salads', value: 200 },
    ]);
};
