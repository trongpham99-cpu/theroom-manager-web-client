export type Apartment = {
	_id: string;
	code: string;
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

