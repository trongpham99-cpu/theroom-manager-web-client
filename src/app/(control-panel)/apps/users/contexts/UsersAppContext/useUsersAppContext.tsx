import { useContext } from 'react';
import UsersAppContext from './UsersAppContext';

export function useUsersAppContext() {
	const context = useContext(UsersAppContext);

	if (!context) {
		throw new Error('useUsersAppContext must be used within UsersAppProvider');
	}

	return context;
}

