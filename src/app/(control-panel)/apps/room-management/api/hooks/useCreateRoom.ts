import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from 'src/utils/api';

type CreateRoomInput = {
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

export const useCreateRoom = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: CreateRoomInput) => {
			const response = await api.post('rooms', { json: data }).json<RoomResponse>();
			return response.data;
		},
		onSuccess: () => {
			// Invalidate rooms query to refetch the list
			queryClient.invalidateQueries({ queryKey: ['rooms'] });
		}
	});
};

