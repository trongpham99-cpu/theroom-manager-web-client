import { useQuery } from '@tanstack/react-query';
import api from 'src/utils/api';
import { Customer } from '../types';

type ApiResponse = {
	status: string;
	message: string;
	data: Customer;
};

export function useCustomer(id?: string) {
	return useQuery({
		queryKey: ['customer', id],
		queryFn: async () => {
			if (!id) throw new Error('Customer ID is required');
			const response = await api.get(`customers/${id}`).json<ApiResponse>();
			return response.data;
		},
		enabled: !!id
	});
}

