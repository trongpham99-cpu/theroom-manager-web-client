'use client';

import FusePageSimple from '@fuse/core/FusePageSimple';
import { useEffect, useRef, useState } from 'react';
import useParams from '@fuse/hooks/useParams';
import { styled } from '@mui/material/styles';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import useNavigate from '@fuse/hooks/useNavigate';
import UsersHeader from '../ui/UsersHeader';
import UsersList from '../ui/user-list/UsersList';
import UsersSidebarContent from '../ui/UsersSidebarContent';
import { UsersAppProvider } from '../../contexts/UsersAppContext/UsersAppProvider';

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

type UsersAppViewProps = {
	children?: React.ReactNode;
};

/**
 * The Users App View.
 */
function UsersAppView(props: UsersAppViewProps) {
	const { children } = props;
	const navigate = useNavigate();
	const routeParams = useParams();

	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
	const pageLayout = useRef(null);
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	useEffect(() => {
		setRightSidebarOpen(!!routeParams.userId);
	}, [routeParams]);

	return (
		<Root
			header={<UsersHeader />}
			content={<UsersList />}
			ref={pageLayout}
			rightSidebarProps={{
				content: <UsersSidebarContent>{children}</UsersSidebarContent>,
				open: rightSidebarOpen,
				onClose: () => navigate('/apps/users'),
				width: 640,
				variant: 'temporary'
			}}
			scroll={isMobile ? 'page' : 'content'}
		/>
	);
}

function UsersAppWrapper(props: { children?: React.ReactNode }) {
	return (
		<UsersAppProvider>
			<UsersAppView {...props} />
		</UsersAppProvider>
	);
}

export default UsersAppWrapper;
