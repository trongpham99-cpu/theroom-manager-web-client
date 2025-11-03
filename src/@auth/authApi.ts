import { User } from '@auth/user';
import UserModel from '@auth/user/models/UserModel';
import { PartialDeep } from 'type-fest';
import api from '@/utils/apiProd';

export type AuthResponse = {
	status: string;
	message: string;
	data: {
		user: User;
		tokens: {
			access: {
				token: string;
				expires: string;
			};
			refresh: {
				token: string;
				expires: string;
			};
		};
	};
};

export type AuthWithTokenResponse = {
	status: string;
	message: string;
	data: User;
};

/**
 * Refreshes the access token
 */
export async function authRefreshToken(): Promise<Response> {
	return api.post('v1/auth/refresh', {
		retry: 0 // Don't retry refresh token requests
	});
}

/**
 * Sign in with token
 */
export async function authSignInWithToken(accessToken: string): Promise<AuthWithTokenResponse> {
	return api
		.get('v1/auth/me', {
			headers: { Authorization: `Bearer ${accessToken}` }
		})
		.json();
}

/**
 * Sign in
 */
export async function authSignIn(credentials: { email: string; password: string }): Promise<AuthResponse> {
	return api
		.post('v1/auth/login', {
			json: credentials
		})
		.json();
}

/**
 * Sign up
 */
export async function authSignUp(data: { name: string; email: string; password: string }): Promise<AuthResponse> {
	return api
		.post('v1/auth/register', {
			json: data
		})
		.json();
}

/**
 * Get user by id
 */
export async function authGetDbUser(userId: string): Promise<User> {
	return api.get(`v1/auth/user/${userId}`).json();
}

/**
 * Get user by email
 */
export async function authGetDbUserByEmail(email: string): Promise<User> {
	return api.get(`v1/auth/user-by-email/${email}`).json();
}

/**
 * Update user
 */
export function authUpdateDbUser(user: PartialDeep<User>): Promise<Response> {
	return api.put(`v1/auth/user/${user.id}`, {
		json: UserModel(user)
	});
}

/**
 * Create user
 */
export async function authCreateDbUser(user: PartialDeep<User>): Promise<User> {
	return api
		.post('v1/users', {
			json: UserModel(user)
		})
		.json();
}
