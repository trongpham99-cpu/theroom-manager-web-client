import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from 'src/utils/api';

type CreateApartmentInput = {
	code: string;
};

type ApartmentResponse = {
	status: string;
	message: string;
	data: {
		_id: string;
		code: string;
		createdAt: string;
		updatedAt: string;
		__v: number;
	};
};

export const useCreateApartment = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: CreateApartmentInput) => {
			const response = await api.post('apartments', { json: data }).json<ApartmentResponse>();
			return response.data;
		},
		onSuccess: () => {
			// Invalidate apartments query to refetch the list
			queryClient.invalidateQueries({ queryKey: ['apartments'] });
		}
	});
};

