import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import api from 'src/utils/api';

export function useDeleteNotifications() {
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();

	return useMutation({
		mutationFn: async (ids: string[]) => {
			// Delete all notifications in parallel
			await Promise.all(ids.map((id) => api.delete(`notifications/${id}`)));
			return { success: true };
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['notifications'] });
			enqueueSnackbar('Notification(s) deleted successfully', { variant: 'success' });
		},
		onError: () => {
			enqueueSnackbar('Failed to delete notification(s)', { variant: 'error' });
		}
	});
}
