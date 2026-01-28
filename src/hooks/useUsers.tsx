import { useState } from 'react'
import api from '../services/api';
import type { UsersProps } from '../pages/admin/users/userTypes';

const useUsers = () => {
    const [ users, setUsers ] = useState<UsersProps[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [refetch, setRefetch] = useState<boolean>(false);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/users/');
            setUsers(response.data);
        } catch {
            console.error('Failed to fetch users');
            setError('Failed to fetch users');
        } finally {
            setIsLoading(false);
        }
    }

    const addUser = async (userData: Partial<UsersProps>) => {
        try {
            const response = await api.post('/users/', userData);
            setUsers([...users, response.data]);
        } catch {
            console.error('Failed to add user');
            setError('Failed to add user');
        }
    }

    const updateUser = async (userId: number, updatedData: Partial<UsersProps>) => {
        try {
            const response = await api.put(`/users/${userId}/`, updatedData);
            setUsers(users.map(user => user.id === userId ? response.data : user));
        } catch {
            console.error('Failed to update user');
            setError('Failed to update user');
        }
    }

    const deleteUser = async (userId: number) => {
        try {
            await api.delete(`/users/${userId}/`);
            setUsers(users.filter(user => user.id !== userId));
        } catch {
            console.error('Failed to delete user');
            setError('Failed to delete user');
        }
    }


  return {
    users,
    isLoading,
    error,
    refetch,
    fetchUsers,
    addUser,
    updateUser,
    deleteUser
  }
}
export default useUsers