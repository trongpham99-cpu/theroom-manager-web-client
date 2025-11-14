import { createContext } from 'react';

export type UsersAppContextType = {
	searchText: string;
	setSearchText: (text: string) => void;
};

const UsersAppContext = createContext<UsersAppContextType>({
	searchText: '',
	setSearchText: () => {}
});

export default UsersAppContext;

