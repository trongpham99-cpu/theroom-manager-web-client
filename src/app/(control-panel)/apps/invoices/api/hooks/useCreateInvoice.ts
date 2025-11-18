import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from 'src/utils/api';
import { useSnackbar } from 'notistack';
import { InvoiceCreateInput, Invoice } from '../types';

type ApiResponse = {
	status: string;
	message: string;
	data: Invoice;
};

export function useCreateInvoice() {
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();

	return useMutation({
		mutationFn: async (data: InvoiceCreateInput) => {
			const response = await api.post('invoices', { json: data }).json<ApiResponse>();
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['invoices'] });
			enqueueSnackbar('Invoice created successfully!', { variant: 'success' });
		},
		onError: (error: any) => {
			const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create invoice';
			enqueueSnackbar(errorMessage, { variant: 'error' });
		}
	});
}

