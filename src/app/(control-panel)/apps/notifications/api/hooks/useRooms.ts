import { useQuery } from '@tanstack/react-query';
import api from 'src/utils/api';

type Room = {
	_id: string;
	code: string;
};

type ApiResponse = {
	status: string;
	message: string;
	data: {
		rows: Room[];
		total: number;
	};
};

export function useRooms() {
	return useQuery({
		queryKey: ['rooms'],
		queryFn: async () => {
			const response = await api.get('rooms').json<ApiResponse>();
			return response.data.rows;
		}
	});
}

