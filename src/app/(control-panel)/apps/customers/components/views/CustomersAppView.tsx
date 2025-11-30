'use client';

import FusePageSimple from '@fuse/core/FusePageSimple';
import { useEffect, useRef, useState } from 'react';
import useParams from '@fuse/hooks/useParams';
import { styled } from '@mui/material/styles';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import useNavigate from '@fuse/hooks/useNavigate';
import CustomersHeader from '../ui/CustomersHeader';
import CustomersTable from '../ui/CustomersTable';
import CustomerView from './CustomerView';
import CreateCustomerDialog from '../dialogs/CreateCustomerDialog';
import { Box } from '@mui/material';
import CustomersAppProvider from '../../contexts/CustomersAppContext/CustomersAppProvider';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .container': {
		maxWidth: '100%!important'
	},
	'& .FusePageSimple-contentWrapper': {
		paddingTop: 2
	},
	'& .FusePageSimple-content': {
		boxShadow: theme.vars.shadows[2]
	}
}));

type CustomersAppProps = {
	children?: React.ReactNode;
};

function CustomersAppView(props: CustomersAppProps) {
	const { children } = props;
	const navigate = useNavigate();
	const routeParams = useParams();
	const pageLayout = useRef(null);
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	const [createDialogOpen, setCreateDialogOpen] = useState(false);
	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
	const [selectedApartment, setSelectedApartment] = useState('all');

	useEffect(() => {
		setRightSidebarOpen(!!routeParams.customerId);
	}, [routeParams]);

	const handleAddClick = () => {
		setCreateDialogOpen(true);
	};

	const handleApartmentChange = (apartmentId: string) => {
		setSelectedApartment(apartmentId);
	};

	return (
		<CustomersAppProvider>
			<>
				<Root
					header={
						<CustomersHeader
							onAddClick={handleAddClick}
							selectedApartment={selectedApartment}
							onApartmentChange={handleApartmentChange}
						/>
					}
					content={<CustomersTable apartmentId={selectedApartment !== 'all' ? selectedApartment : undefined} />}
					ref={pageLayout}
					rightSidebarProps={{
						content: (
							<Box className="flex h-full flex-col">
								{children}
							</Box>
						),
						open: rightSidebarOpen,
						onClose: () => navigate('/apps/customers'),
						width: 800,
						variant: 'temporary'
					}}
					scroll={isMobile ? 'page' : 'content'}
				/>

				<CreateCustomerDialog
					open={createDialogOpen}
					onClose={() => setCreateDialogOpen(false)}
				/>
			</>
		</CustomersAppProvider>
	);
}

export default CustomersAppView;

