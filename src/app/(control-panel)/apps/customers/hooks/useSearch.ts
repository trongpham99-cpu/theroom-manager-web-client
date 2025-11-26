import { useContext, useState } from 'react';
import { CustomersAppContext } from '../contexts/CustomersAppContext/CustomersAppContext';

export function useSearch() {
	const context = useContext(CustomersAppContext);

	if (!context) {
		throw new Error('useSearch must be used within CustomersAppProvider');
	}

	const { searchText, setSearchText } = context;

	return {
		searchText,
		setSearchText
	};
}

