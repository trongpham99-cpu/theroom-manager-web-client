import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from 'src/utils/api';
import { useSnackbar } from 'notistack';
import { CustomerUpdateInput, Customer } from '../types';

type ApiResponse = {
	status: string;
	message: string;
	data: Customer;
};

export function useUpdateCustomer() {
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();

	return useMutation({
		mutationFn: async ({ id, data }: { id: string; data: CustomerUpdateInput }) => {
			const response = await api.patch(`customers/${id}`, { json: data }).json<ApiResponse>();
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['customers'] });
			queryClient.invalidateQueries({ queryKey: ['customer'] });
			enqueueSnackbar('Customer updated successfully!', { variant: 'success' });
		},
		onError: (error: any) => {
			const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update customer';
			enqueueSnackbar(errorMessage, { variant: 'error' });
		}
	});
}

