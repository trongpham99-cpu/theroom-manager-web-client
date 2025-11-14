import { useQuery } from '@tanstack/react-query';
import api from 'src/utils/api';
import { Notification } from '../types';

type ApiResponse = {
	status: string;
	message: string;
	data: {
		rows: Notification[];
		total: number;
	};
};

export function useNotifications() {
	return useQuery({
		queryKey: ['notifications'],
		queryFn: async () => {
			const response = await api.get('notifications').json<ApiResponse>();
			return response.data.rows;
		}
	});
}

