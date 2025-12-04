import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from 'src/utils/api';

type UpdateApartmentInput = {
	id: string;
	name?: string;
	code?: string;
	address?: string;
	description?: string;
};

type ApartmentResponse = {
	status: string;
	message: string;
	data: {
		_id: string;
		name: string;
		code: string;
		address?: string;
		description?: string;
		createdAt: string;
		updatedAt: string;
		__v: number;
	};
};

export const useUpdateApartment = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ id, ...data }: UpdateApartmentInput) => {
			const response = await api.put(`apartments/${id}`, { json: data }).json<ApartmentResponse>();
			return response.data;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ['apartments'] });
			queryClient.invalidateQueries({ queryKey: ['apartment', data._id] });
		}
	});
};

