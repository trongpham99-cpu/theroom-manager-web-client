import { useQuery } from '@tanstack/react-query';
import api from 'src/utils/api';
import { Invoice } from '../types';

type ApiResponse = {
	status: string;
	message: string;
	data: Invoice;
};

export function useInvoice(id?: string) {
	return useQuery({
		queryKey: ['invoice', id],
		queryFn: async () => {
			if (!id) throw new Error('Invoice ID is required');
			const response = await api.get(`invoices/${id}`).json<ApiResponse>();
			return response.data;
		},
		enabled: !!id
	});
}

