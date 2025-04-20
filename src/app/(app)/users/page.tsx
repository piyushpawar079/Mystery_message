'use client';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

type Users = {
    _id: string,
    username: string,
    email: string
}

const UserList: React.FC = () => {
    const [users, setUsers] = useState<Users[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/api/get-all-users');
                if (!response.data.success) {
                    throw new Error('Failed to fetch users');
                }
                setUsers(response.data.users);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleSendMessage = (username: string) => {
        if (typeof window !== "undefined") {
            const baseURL = `${window.location.protocol}//${window.location.host}`;
            const profileURL = `${baseURL}/u/${username}`;
            window.open(profileURL, '_blank');
        }
    }

    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (error) return <div className="text-center text-red-500 py-10">Error: {error}</div>;

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-center">All Users</h1>
            <ul className="space-y-6">
                {users.map((user) => (
                    <li key={user._id} className="p-6 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                            <div>
                                <h2 className="text-xl font-semibold text-black">{user.username}</h2>
                                <p className="text-gray-600">{user.email}</p>
                            </div>
                            <button
                                onClick={() => handleSendMessage(user.username)}
                                className="mt-4 md:mt-0 px-5 py-2 bg-black text-white hover:bg-gray-800 transition rounded-md"
                            >
                                Send Message
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;
