import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from 'src/utils/api';
import { useSnackbar } from 'notistack';
import { HTTPError } from 'ky';

type DeleteResponse = {
	status: 'success' | 'fail';
	message: string;
	data?: {
		deleted_id: string;
		deleted_name: string;
	};
};

export function useDeleteCustomer() {
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();

	return useMutation({
		mutationFn: async (id: string) => {
			try {
				const response = await api.delete(`customers/${id}`).json<DeleteResponse>();

				if (response.status === 'fail') {
					throw new Error(response.message || 'Failed to delete customer');
				}

				return response;
			} catch (error) {
				if (error instanceof HTTPError) {
					const errorData = await error.response.json().catch(() => ({}));
					const errorMessage = errorData?.message || error.message || 'Failed to delete customer';
					throw new Error(errorMessage);
				}
				throw error;
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['customers'] });
			enqueueSnackbar('Customer deleted successfully!', { variant: 'success' });
		},
		onError: (error: any) => {
			const errorMessage = error?.message || 'Failed to delete customer. Please try again.';
			enqueueSnackbar(errorMessage, { variant: 'error' });
		}
	});
}

