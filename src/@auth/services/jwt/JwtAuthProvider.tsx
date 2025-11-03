import { useState, useEffect, useCallback, useMemo, useImperativeHandle } from 'react';
import { FuseAuthProviderComponentProps, FuseAuthProviderState } from '@fuse/core/FuseAuthProvider/types/FuseAuthTypes';
import useLocalStorage from '@fuse/hooks/useLocalStorage';
import { authRefreshToken, authSignIn, authSignInWithToken, authSignUp, authUpdateDbUser } from '@auth/authApi';
import { User } from '../../user';
import { removeGlobalHeaders, setGlobalHeaders } from '@/utils/api';
import {
	removeGlobalHeaders as removeGlobalHeadersProd,
	setGlobalHeaders as setGlobalHeadersProd
} from '@/utils/apiProd';
import { isTokenValid } from './utils/jwtUtils';
import JwtAuthContext from '@auth/services/jwt/JwtAuthContext';
import { JwtAuthContextType } from '@auth/services/jwt/JwtAuthContext';
import { HTTPError } from 'ky';

export type JwtSignInPayload = {
	email: string;
	password: string;
};

export type JwtSignUpPayload = {
	name: string;
	email: string;
	password: string;
};

function JwtAuthProvider(props: FuseAuthProviderComponentProps) {
	const { ref, children, onAuthStateChanged } = props;

	const {
		value: tokenStorageValue,
		setValue: setTokenStorageValue,
		removeValue: removeTokenStorageValue
	} = useLocalStorage<string>('jwt_access_token');

	/**
	 * Fuse Auth Provider State
	 */
	const [authState, setAuthState] = useState<FuseAuthProviderState<User>>({
		authStatus: 'configuring',
		isAuthenticated: false,
		user: null
	});

	/**
	 * Watch for changes in the auth state
	 * and pass them to the FuseAuthProvider
	 */
	useEffect(() => {
		if (onAuthStateChanged) {
			onAuthStateChanged(authState);
		}
	}, [authState, onAuthStateChanged]);

	/**
	 * Attempt to auto login with the stored token
	 */
	useEffect(() => {
		const attemptAutoLogin = async () => {
			const accessToken = tokenStorageValue;

			if (isTokenValid(accessToken)) {
				try {
					const response = await authSignInWithToken(accessToken);
					return response.data;
				} catch (error) {
					if (error instanceof HTTPError) {
						console.error('Auto login failed:', error.response.status);
					}

					return false;
				}
			}

			return false;
		};

		if (!authState.isAuthenticated) {
			attemptAutoLogin().then((userData) => {
				if (userData) {
					const authHeader = { Authorization: `Bearer ${tokenStorageValue}` };
					setGlobalHeaders(authHeader);
					setGlobalHeadersProd(authHeader);
					setAuthState({
						authStatus: 'authenticated',
						isAuthenticated: true,
						user: userData
					});
				} else {
					removeTokenStorageValue();
					removeGlobalHeaders(['Authorization']);
					removeGlobalHeadersProd(['Authorization']);
					setAuthState({
						authStatus: 'unauthenticated',
						isAuthenticated: false,
						user: null
					});
				}
			});
		}
		// eslint-disable-next-line
	}, [authState.isAuthenticated]);

	/**
	 * Sign in
	 */
	const signIn: JwtAuthContextType['signIn'] = useCallback(
		async (credentials) => {
			try {
				const session = await authSignIn(credentials);
				setAuthState({
					authStatus: 'authenticated',
					isAuthenticated: true,
					user: session.data.user
				});
				setTokenStorageValue(session.data.tokens.access.token);
				const authHeader = { Authorization: `Bearer ${session.data.tokens.access.token}` };
				setGlobalHeaders(authHeader);
				setGlobalHeadersProd(authHeader);
				return {
					user: session.data.user,
					access_token: session.data.tokens.access.token
				};
			} catch (error) {
				if (error instanceof HTTPError) {
					console.error('Sign in failed:', error.response.status);
				}

				throw error;
			}
		},
		[setTokenStorageValue]
	);

	/**
	 * Sign up
	 */
	const signUp: JwtAuthContextType['signUp'] = useCallback(
		async (data) => {
			try {
				const session = await authSignUp(data);
				setAuthState({
					authStatus: 'authenticated',
					isAuthenticated: true,
					user: session.data.user
				});
				setTokenStorageValue(session.data.tokens.access.token);
				const authHeader = { Authorization: `Bearer ${session.data.tokens.access.token}` };
				setGlobalHeaders(authHeader);
				setGlobalHeadersProd(authHeader);
				return {
					user: session.data.user,
					access_token: session.data.tokens.access.token
				};
			} catch (error) {
				if (error instanceof HTTPError) {
					console.error('Sign up failed:', error.response.status);
				}

				throw error;
			}
		},
		[setTokenStorageValue]
	);

	/**
	 * Sign out
	 */
	const signOut: JwtAuthContextType['signOut'] = useCallback(() => {
		removeTokenStorageValue();
		removeGlobalHeaders(['Authorization']);
		removeGlobalHeadersProd(['Authorization']);
		setAuthState({
			authStatus: 'unauthenticated',
			isAuthenticated: false,
			user: null
		});
	}, [removeTokenStorageValue]);

	/**
	 * Update user
	 */
	const updateUser: JwtAuthContextType['updateUser'] = useCallback(async (_user) => {
		try {
			const response = await authUpdateDbUser(_user);
			return response;
		} catch (error) {
			if (error instanceof HTTPError) {
				console.error('Update user failed:', error.response.status);
			}

			throw error;
		}
	}, []);

	/**
	 * Refresh access token
	 */
	const refreshToken: JwtAuthContextType['refreshToken'] = useCallback(async () => {
		try {
			const response = await authRefreshToken();
			return response;
		} catch (error) {
			if (error instanceof HTTPError) {
				console.error('Token refresh failed:', error.response.status);
			}

			throw error;
		}
	}, []);

	/**
	 * Auth Context Value
	 */
	const authContextValue = useMemo(
		() =>
			({
				...authState,
				signIn,
				signUp,
				signOut,
				updateUser,
				refreshToken
			}) as JwtAuthContextType,
		[authState, signIn, signUp, signOut, updateUser, refreshToken]
	);

	/**
	 * Expose methods to the FuseAuthProvider
	 */
	useImperativeHandle(ref, () => ({
		signOut,
		updateUser
	}));

	/**
	 * Intercept fetch requests to refresh the access token
	 */
	const interceptFetch = useCallback(() => {
		const { fetch: originalFetch } = window;

		window.fetch = async (...args) => {
			const [resource, config] = args;
			try {
				const response = await originalFetch(resource, config);
				const newAccessToken = response.headers.get('New-Access-Token');

				if (newAccessToken) {
					const authHeader = { Authorization: `Bearer ${newAccessToken}` };
					setGlobalHeaders(authHeader);
					setGlobalHeadersProd(authHeader);
					setTokenStorageValue(newAccessToken);
				}

				if (response.status === 401) {
					signOut();
					console.error('Unauthorized request. User was signed out.');
				}

				return response;
			} catch (error) {
				if (error instanceof HTTPError && error.response.status === 401) {
					signOut();
					console.error('Unauthorized request. User was signed out.');
				}

				throw error;
			}
		};
	}, [setTokenStorageValue, signOut]);

	useEffect(() => {
		if (authState.isAuthenticated) {
			interceptFetch();
		}
	}, [authState.isAuthenticated, interceptFetch]);

	return <JwtAuthContext value={authContextValue}>{children}</JwtAuthContext>;
}

export default JwtAuthProvider;
