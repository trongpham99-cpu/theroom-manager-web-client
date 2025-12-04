import { useQuery } from '@tanstack/react-query';
import api from 'src/utils/api';
import { InvoiceListParams, InvoiceListResponse } from '../types';

type ApiResponse = {
	status: string;
	message: string;
	data: InvoiceListResponse;
};

export function useInvoices(params?: InvoiceListParams) {
	return useQuery({
		queryKey: ['invoices', params],
		queryFn: async () => {
			const searchParams = new URLSearchParams();

			if (params?.page) searchParams.append('page', params.page.toString());
			if (params?.limit) searchParams.append('limit', params.limit.toString());
			if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
			if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);
			if (params?.search) searchParams.append('search', params.search);
			if (params?.month) searchParams.append('month', params.month.toString());
			if (params?.year) searchParams.append('year', params.year.toString());
			if (params?.excludeRecent) searchParams.append('excludeRecent', 'true');
			if (params?.apartmentId) searchParams.append('apartmentId', params.apartmentId);

			const queryString = searchParams.toString();
			const url = queryString ? `invoices?${queryString}` : 'invoices';

			const response = await api.get(url).json<ApiResponse>();
			return response.data;
		}
	});
}

