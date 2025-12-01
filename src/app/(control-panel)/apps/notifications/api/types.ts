export type Notification = {
	_id: string;
	title: string;
	content: string;
	room_ids?: Array<{
		_id: string;
		code: string;
	}>;
	apartment_ids?: Array<{
		_id: string;
		code: string;
	}>;
	logs?: Record<string, any>[];
	createdAt: string;
	updatedAt: string;
};

export type NotificationCreateInput = {
	templateData: {
		notification_title: string;
		notification_body: string;
	};
	apartmentIds?: string[];
	roomIds?: string[];
};

