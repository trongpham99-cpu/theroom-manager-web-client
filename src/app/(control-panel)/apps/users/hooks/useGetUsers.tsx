import { useQuery } from '@tanstack/react-query';
import { getUsers, UsersResponse } from '../UsersApi';

/**
 * Hook to get all users with pagination
 */
export const useGetUsers = (page = 1, limit = 10) => {
	return useQuery<UsersResponse>({
		queryKey: ['users', page, limit],
		queryFn: () => getUsers(page, limit)
	});
};
