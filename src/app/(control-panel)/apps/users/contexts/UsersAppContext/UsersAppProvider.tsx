import { useMemo, useState } from 'react';
import UsersAppContext from './UsersAppContext';

type UsersAppProviderProps = {
	children: React.ReactNode;
};

export function UsersAppProvider(props: UsersAppProviderProps) {
	const { children } = props;
	const [searchText, setSearchText] = useState('');

	const value = useMemo(
		() => ({
			searchText,
			setSearchText
		}),
		[searchText]
	);

	return <UsersAppContext value={value}>{children}</UsersAppContext>;
}

