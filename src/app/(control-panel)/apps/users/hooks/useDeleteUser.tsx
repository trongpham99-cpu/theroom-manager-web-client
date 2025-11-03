import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteUser } from '../UsersApi';
import { useSnackbar } from 'notistack';

/**
 * Hook to delete a user
 */
export const useDeleteUser = () => {
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();

	return useMutation({
		mutationFn: (userId: string) => deleteUser(userId),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ['users'] });
			enqueueSnackbar(data.message || 'User deleted successfully', { variant: 'success' });
		},
		onError: (error: Error) => {
			enqueueSnackbar(error?.message || 'Failed to delete user', { variant: 'error' });
		}
	});
};
