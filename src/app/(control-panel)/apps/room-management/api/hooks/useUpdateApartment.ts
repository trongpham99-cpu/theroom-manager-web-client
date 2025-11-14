import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from 'src/utils/api';

type UpdateApartmentInput = {
	id: string;
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

export const useUpdateApartment = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ id, code }: UpdateApartmentInput) => {
			const response = await api.put(`apartments/${id}`, { json: { code } }).json<ApartmentResponse>();
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['apartments'] });
		}
	});
};

