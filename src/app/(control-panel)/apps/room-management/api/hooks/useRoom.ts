import { useQuery } from '@tanstack/react-query';
import { api } from 'src/utils/api';
import { Room } from '../types';

type ApiResponse = {
	status: string;
	message: string;
	data: Room;
};

export function useRoom(roomId: string) {
	return useQuery({
		queryKey: ['room', roomId],
		queryFn: async () => {
			const response = await api.get(`rooms/${roomId}`).json<ApiResponse>();
			return response.data;
		},
		enabled: !!roomId
	});
}
