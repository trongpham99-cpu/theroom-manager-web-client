import { useMemo } from 'react';
import { useGetUsers } from './useGetUsers';
import { useSearch } from './useSearch';

export function useFilteredUsers() {
	const { searchText } = useSearch();
	const { data, isLoading, isError } = useGetUsers(1, 1000); // Get all users for filtering

	const filteredData = useMemo(() => {
		if (!data?.data) {
			return [];
		}

		if (!searchText) {
			return data.data;
		}

		const lowerSearchText = searchText.toLowerCase();
		return data.data.filter((user) => {
			return (
				user.name?.toLowerCase().includes(lowerSearchText) ||
				user.email?.toLowerCase().includes(lowerSearchText) ||
				user.role?.toLowerCase().includes(lowerSearchText)
			);
		});
	}, [data, searchText]);

	return {
		data: filteredData,
		isLoading,
		isError
	};
}

