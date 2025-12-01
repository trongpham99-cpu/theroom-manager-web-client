import { createContext } from 'react';

export type CustomersAppContextType = {
	searchText: string;
	setSearchText: (text: string) => void;
};

export const CustomersAppContext = createContext<CustomersAppContextType | null>(null);

