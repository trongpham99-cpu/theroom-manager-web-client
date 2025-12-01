import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from 'src/utils/api';
import { useSnackbar } from 'notistack';
import { InvoiceSendResponse } from '../types';

type ApiResponse = {
	status: string;
	message: string;
	data: InvoiceSendResponse[];
};

export function useSendManyInvoices() {
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();

	return useMutation({
		mutationFn: async (invoiceIds: string[]) => {
			const response = await api.post('invoices/send-many', { json: { invoiceIds } }).json<ApiResponse>();
			return response.data;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ['invoices'] });
			const successCount = data.filter((item) => item.status === 2).length;
			const totalCount = data.length;
			enqueueSnackbar(`Sent ${successCount}/${totalCount} invoices successfully!`, { variant: 'success' });
		},
		onError: (error: any) => {
			const errorMessage = error?.response?.data?.message || error?.message || 'Failed to send invoices';
			enqueueSnackbar(errorMessage, { variant: 'error' });
		}
	});
}

