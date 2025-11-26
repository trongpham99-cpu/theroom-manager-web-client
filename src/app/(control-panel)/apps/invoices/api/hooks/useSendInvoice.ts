import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from 'src/utils/api';
import { useSnackbar } from 'notistack';
import { InvoiceSendResponse } from '../types';

type ApiResponse = {
	status: string;
	message: string;
	data: InvoiceSendResponse;
};

export function useSendInvoice() {
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();

	return useMutation({
		mutationFn: async (invoiceId: string) => {
			const response = await api.post(`invoices/${invoiceId}/send`).json<ApiResponse>();
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['invoices'] });
			queryClient.invalidateQueries({ queryKey: ['invoice'] });
			enqueueSnackbar('Invoice sent successfully!', { variant: 'success' });
		},
		onError: (error: any) => {
			const errorMessage = error?.response?.data?.message || error?.message || 'Failed to send invoice';
			enqueueSnackbar(errorMessage, { variant: 'error' });
		}
	});
}

