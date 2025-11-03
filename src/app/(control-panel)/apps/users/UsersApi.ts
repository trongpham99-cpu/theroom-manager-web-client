import api from '@/utils/apiProd';

export type UserType = {
	id: string;
	name: string;
	email: string;
	role: string;
	isEmailVerified: boolean;
	photoURL: string;
	settings?: Record<string, unknown>;
	shortcuts?: string[];
};

export type UsersResponse = {
	status: string;
	message: string;
	data: UserType[];
	meta: {
		pagination: {
			page: number;
			limit: number;
			totalPages: number;
			totalResults: number;
			hasNextPage: boolean;
			hasPrevPage: boolean;
		};
	};
};

export type UserResponse = {
	status: string;
	message: string;
	data: UserType;
};

/**
 * Get all users with pagination
 */
export async function getUsers(page = 1, limit = 10): Promise<UsersResponse> {
	return api.get(`v1/users?page=${page}&limit=${limit}`).json();
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string): Promise<UserResponse> {
	return api.get(`v1/users/${userId}`).json();
}

/**
 * Create new user
 */
export async function createUser(userData: Partial<UserType>): Promise<UserResponse> {
	return api
		.post('v1/users', {
			json: userData
		})
		.json();
}

/**
 * Update user
 */
export async function updateUser(userId: string, userData: Partial<UserType>): Promise<UserResponse> {
	return api
		.patch(`v1/users/${userId}`, {
			json: userData
		})
		.json();
}

/**
 * Delete user
 */
export async function deleteUser(userId: string): Promise<{ status: string; message: string }> {
	return api.delete(`v1/users/${userId}`).json();
}
