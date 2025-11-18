import { useQuery } from '@tanstack/react-query';
import api from 'src/utils/api';
import { CustomerListParams, CustomerListResponse } from '../types';

type ApiResponse = {
	status: string;
	message: string;
	data: CustomerListResponse;
};

export function useCustomers(params?: CustomerListParams) {
	return useQuery({
		queryKey: ['customers', params],
		queryFn: async () => {
			const searchParams = new URLSearchParams();

			if (params?.page) searchParams.append('page', params.page.toString());
			if (params?.limit) searchParams.append('limit', params.limit.toString());
			if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
			if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);
			if (params?.search) searchParams.append('search', params.search);
			if (params?.room_id) searchParams.append('room_id', params.room_id);
			if (params?.apartment_id) searchParams.append('apartment_id', params.apartment_id);

			const queryString = searchParams.toString();
			const url = queryString ? `customers?${queryString}` : 'customers';

			const response = await api.get(url).json<ApiResponse>();
			return response.data;
		}
	});
}

