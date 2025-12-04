import { useQuery } from '@tanstack/react-query';
import api from 'src/utils/api';
import { Apartment } from '../types';

type ApiResponse = {
	status: string;
	message: string;
	data: Apartment;
};

export function useApartment(apartmentId: string) {
	return useQuery({
		queryKey: ['apartment', apartmentId],
		queryFn: async () => {
			const response = await api.get(`apartments/${apartmentId}`).json<ApiResponse>();
			return response.data;
		},
		enabled: !!apartmentId
	});
}
