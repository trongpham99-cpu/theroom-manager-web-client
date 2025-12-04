export type Apartment = {
	_id: string;
	name: string;
	code: string;
	address?: string;
	description?: string;
	createdAt: string;
	updatedAt: string;
};

export type Room = {
	_id: string;
	code: string;
	apartment_id: string;
	createdAt: string;
	updatedAt: string;
};

