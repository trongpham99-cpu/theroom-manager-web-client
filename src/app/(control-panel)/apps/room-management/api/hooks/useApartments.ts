import { useQuery } from '@tanstack/react-query';
import api from 'src/utils/api';
import { Apartment } from '../types';

type ApiResponse = {
	status: string;
	message: string;
	data: {
		rows: Apartment[];
		total: number;
	};
};

export function useApartments() {
	return useQuery({
		queryKey: ['apartments'],
		queryFn: async () => {
			const response = await api.get('apartments').json<ApiResponse>();
			return response.data;
		}
	});
}

