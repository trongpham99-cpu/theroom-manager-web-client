import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from 'src/utils/api';

export const useDeleteApartment = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			await api.delete(`apartments/${id}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['apartments'] });
		}
	});
};

