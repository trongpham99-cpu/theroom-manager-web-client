import { useUsersAppContext } from '../contexts/UsersAppContext/useUsersAppContext';

export function useSearch() {
	const { searchText, setSearchText } = useUsersAppContext();

	return {
		searchText,
		setSearchText
	};
}

