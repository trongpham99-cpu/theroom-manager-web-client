import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from 'src/utils/api';

type UpdateRoomInput = {
	id: string;
	code: string;
	apartment_id: string;
};

type RoomResponse = {
	status: string;
	message: string;
	data: {
		_id: string;
		code: string;
		apartment_id: string;
		createdAt: string;
		updatedAt: string;
		__v: number;
	};
};

export const useUpdateRoom = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ id, code, apartment_id }: UpdateRoomInput) => {
			const response = await api.put(`rooms/${id}`, { json: { code, apartment_id } }).json<RoomResponse>();
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['rooms'] });
		}
	});
};

