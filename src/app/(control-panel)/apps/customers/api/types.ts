export type Customer = {
	_id: string;
	uuid: string;
	name: string;
	phone?: string;
	dob?: string;
	room_id?: {
		_id: string;
		code: string;
	} | null;
	apartment_id?: {
		_id: string;
		code: string;
	} | null;
	createdAt: string;
	updatedAt: string;
};

export type CustomerCreateInput = {
	uuid: string;
	name: string;
	phone?: string;
	dob?: string;
	room_id?: string;
	apartment_id?: string;
};

export type CustomerUpdateInput = {
	name?: string;
	phone?: string;
	dob?: string;
	room_id?: string;
	apartment_id?: string;
};

export type CustomerListParams = {
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: 'asc' | 'desc';
	search?: string;
	room_id?: string;
	apartment_id?: string;
};

export type CustomerListResponse = {
	rows: Customer[];
	total: number;
	page: number;
	limit: number;
};

export type AssignRoomInput = {
	room_id: string;
};

