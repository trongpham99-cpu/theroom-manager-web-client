export type Invoice = {
	_id: string;
	room_code: string;
	customer_name: string;
	gender: 'Nam' | 'Nữ' | 'N/A';
	birth_date?: string;
	phone: string;
	contract?: {
		start_date?: string;
		end_date?: string;
		duration_months?: number;
	};
	deposit_amount?: number;
	room_price?: number;
	stay_days?: number;
	actual_room_fee?: number;
	electricity?: {
		old_index?: number;
		new_index?: number;
		used_kwh?: number;
		price?: number;
		staff?: string;
	};
	water_usage?: number;
	water_fee?: number;
	management_fee?: number;
	old_debt?: number;
	deduction?: number;
	total_amount: number;
	amount_paid?: number;
	remaining_amount?: number;
	note?: string;
	extra_note?: string;
	invoice_status: 1 | 2 | 3 | 4; // 1: pending, 2: sent, 3: paid, 4: failed
	invoice_message?: string;
	month?: number;
	year?: number;
	history?: Array<{
		status: number;
		message: string;
		created_at: string;
	}>;
	createdAt: string;
	updatedAt: string;
};

export type InvoiceCreateInput = {
	room_code?: string;
	customer_name?: string;
	gender?: 'Nam' | 'Nữ' | 'N/A';
	birth_date?: string;
	phone: string;
	contract?: {
		start_date?: string;
		end_date?: string;
		duration_months?: number;
	};
	deposit_amount?: number;
	room_price?: number;
	stay_days?: number;
	electricity?: {
		old_index?: number;
		new_index?: number;
		staff?: string;
	};
	water_fee?: number;
	management_fee?: number;
	old_debt?: number;
	deduction?: number;
	note?: string;
	extra_note?: string;
	month?: number;
	year?: number;
};

export type InvoiceListParams = {
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: 'asc' | 'desc';
	search?: string;
	month?: number;
	year?: number;
	excludeRecent?: boolean; // Exclude current and last month
	apartmentId?: string;
};

export type InvoiceListResponse = {
	rows: Invoice[];
	total: number;
};

export type InvoiceSendResponse = {
	invoiceId: string;
	zaloRes?: {
		success: boolean;
		message?: string;
	};
	status?: number;
	message?: string;
};

export type InvoiceReportItem = {
	customer_name: string;
	phone: string;
	room_code: string;
	room_price: number;
	actual_room_fee: number;
	electricity_fee: number;
	water_fee: number;
	management_fee: number;
	total_amount: number;
	amount_paid: number;
	remaining_amount: number;
	invoice_status: number;
	invoice_message?: string;
	latest_send_status?: number;
	latest_send_message?: string;
	latest_send_time?: string;
};

