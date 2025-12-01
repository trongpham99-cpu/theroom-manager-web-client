import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from 'src/utils/api';
import { HTTPError } from 'ky';

type DeleteResponse = {
	status: 'success' | 'fail';
	message: string;
	data?: {
		deleted_id: string;
		deleted_code: string;
	};
};

export const useDeleteRoom = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			try {
				const response = await api.delete(`rooms/${id}`).json<DeleteResponse>();
				
				// Check if API returned fail status
				if (response.status === 'fail') {
					throw new Error(response.message || 'Failed to delete room');
				}
				
				return response;
			} catch (error) {
				if (error instanceof HTTPError) {
					const errorData = await error.response.json().catch(() => ({}));
					const errorMessage = errorData?.message || error.message || 'Failed to delete room';
					throw new Error(errorMessage);
				}
				throw error;
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['rooms'] });
		}
	});
};

