
import React, { useState, useEffect, useCallback } from 'react';
import * as api from '../services/apiService';
import { Book, LibraryTransaction } from '../types';
import Spinner from '../components/common/Spinner';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface LibraryProps {
    userId: string;
}

const BookCard: React.FC<{ book: Book }> = ({ book }) => (
    <div className="bg-dark-card border border-dark-border rounded-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
        <img src={book.coverUrl} alt={book.title} className="w-full h-56 object-cover" />
        <div className="p-4">
            <h3 className="font-bold text-lg text-dark-text-primary truncate">{book.title}</h3>
            <p className="text-sm text-dark-text-secondary">{book.author}</p>
            <div className="mt-4 flex justify-between items-center">
                <span className="text-xs bg-gray-700 px-2 py-1 rounded">{book.campus}</span>
                <span className={`text-sm font-semibold ${book.isAvailable ? 'text-green-400' : 'text-red-400'}`}>
                    {book.isAvailable ? 'Available' : 'Issued'}
                </span>
            </div>
        </div>
    </div>
);

const MyBookCard: React.FC<{ item: { book: Book; transaction: LibraryTransaction } }> = ({ item }) => (
    <div className="flex items-center bg-dark-card p-4 rounded-lg border border-dark-border space-x-4">
        <img src={item.book.coverUrl} alt={item.book.title} className="w-16 h-24 object-cover rounded" />
        <div className="flex-1">
            <h4 className="font-semibold text-dark-text-primary">{item.book.title}</h4>
            <p className="text-sm text-dark-text-secondary">{item.book.author}</p>
        </div>
        <div>
            <p className="text-sm text-dark-text-secondary">Due Date</p>
            <p className="font-bold text-lg text-yellow-400">{new Date(item.transaction.dueDate).toLocaleDateString()}</p>
        </div>
    </div>
);


const Library: React.FC<LibraryProps> = ({ userId }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Book[]>([]);
    const [myBooks, setMyBooks] = useState<{ book: Book; transaction: LibraryTransaction }[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = useCallback(() => {
        setIsLoading(true);
        api.getBooks(searchQuery).then(results => {
            setSearchResults(results);
            setIsLoading(false);
        });
    }, [searchQuery]);

    useEffect(() => {
        api.getIssuedBooks(userId).then(setMyBooks);
        // Initial search to show some books
        handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);
    
    const onSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSearch();
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold mb-4">My Books</h2>
                <div className="space-y-4">
                    {myBooks.length > 0 ? myBooks.map(item => <MyBookCard key={item.transaction.id} item={item} />)
                        : <p className="text-dark-text-secondary">You have no books currently issued.</p>}
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-4">Search Library</h2>
                <form onSubmit={onSearchSubmit} className="flex items-center bg-dark-card border border-dark-border rounded-lg p-2 mb-6">
                    <MagnifyingGlassIcon className="h-5 w-5 text-dark-text-secondary mx-2" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for title, author..."
                        className="w-full bg-transparent focus:outline-none text-dark-text-primary"
                    />
                    <button type="submit" className="bg-brand-primary text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                        Search
                    </button>
                </form>

                {isLoading ? <Spinner /> : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {searchResults.map(book => <BookCard key={book.id} book={book} />)}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Library;