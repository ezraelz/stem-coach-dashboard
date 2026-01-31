import { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import type { UsersProps } from '../types/userTypes';

const useUsers = () => {
  const { Id } = useParams<{ Id: string }>();

  const [users, setUsers] = useState<UsersProps[]>([]);
  const [user, setUser] = useState<UsersProps | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.get<UsersProps[]>('/users/');
      setUsers(data);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addUser = useCallback(async (userData: Partial<UsersProps>) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.post<UsersProps>('/users/', userData);
      setUsers(prev => [...prev, data]);
    } catch {
      setError('Failed to add user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUser = useCallback(
    async (userId: number, updatedData: Partial<UsersProps>) => {
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await api.put<UsersProps>(
          `/profile/${userId}/`,
          updatedData
        );
        setUsers(prev =>
          prev.map(user => (user.id === userId ? data : user))
        );
      } catch {
        setError('Failed to update user');
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const userDetail = useCallback(async () => {
    if (!Id) return;

    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get<UsersProps>(`/profile/${Id}/`);
      setUser(res.data);
    } catch {
      setError('Failed to fetch user data');
    } finally {
      setIsLoading(false);
    }
  }, [Id]);

  const deleteUser = useCallback(async (userId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.delete(`/profile/${userId}/`);
      setUsers(prev => prev.filter(user => user.id !== userId));
    } catch {
      setError('Failed to delete user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    users,
    user,
    isLoading,
    error,
    fetchUsers,
    addUser,
    updateUser,
    userDetail,
    deleteUser,
  };
};

export default useUsers;
