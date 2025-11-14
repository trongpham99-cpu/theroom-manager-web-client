import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from 'src/utils/api';

export const useDeleteRoom = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			await api.delete(`rooms/${id}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['rooms'] });
		}
	});
};

