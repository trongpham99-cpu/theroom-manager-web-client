import { useState, useCallback } from 'react';
import { CustomersAppContext } from './CustomersAppContext';

type CustomersAppProviderProps = {
	children: React.ReactNode;
};

function CustomersAppProvider({ children }: CustomersAppProviderProps) {
	const [searchText, setSearchTextState] = useState('');

	const setSearchText = useCallback((text: string) => {
		setSearchTextState(text);
	}, []);

	return (
		<CustomersAppContext.Provider
			value={{
				searchText,
				setSearchText
			}}
		>
			{children}
		</CustomersAppContext.Provider>
	);
}

export default CustomersAppProvider;

