import { useQuery } from '@tanstack/react-query';
import api from 'src/utils/api';
import { InvoiceReportItem } from '../types';

type ApiResponse = {
	status: string;
	message: string;
	data: InvoiceReportItem[];
};

export function useInvoiceReport(month: number, year: number) {
	return useQuery({
		queryKey: ['invoice-report', month, year],
		queryFn: async () => {
			const response = await api.get(`invoices/report?month=${month}&year=${year}`).json<ApiResponse>();
			return response.data;
		},
		enabled: month >= 1 && month <= 12 && year > 0
	});
}

