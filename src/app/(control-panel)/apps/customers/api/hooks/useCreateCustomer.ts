import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from 'src/utils/api';
import { useSnackbar } from 'notistack';
import { CustomerCreateInput, Customer } from '../types';

type ApiResponse = {
	status: string;
	message: string;
	data: Customer;
};

export function useCreateCustomer() {
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();

	return useMutation({
		mutationFn: async (data: CustomerCreateInput) => {
			const response = await api.post('customers', { json: data }).json<ApiResponse>();
			return response.data;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ['customers'] });
			if (data.room_id) {
				enqueueSnackbar('Customer created and assigned to room successfully!', { variant: 'success' });
			} else {
				enqueueSnackbar('Customer created successfully! (No room assigned yet)', { variant: 'success' });
			}
		},
		onError: (error: any) => {
			const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create customer';
			enqueueSnackbar(errorMessage, { variant: 'error' });
		}
	});
}

