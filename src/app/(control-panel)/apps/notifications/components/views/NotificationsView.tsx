'use client';
import NotificationsHeader from '../ui/NotificationsHeader';
import NotificationsTable from '../ui/NotificationsTable';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { styled } from '@mui/material/styles';

const Root = styled(FusePageCarded)(() => ({
	'& .container': {
		maxWidth: '100%!important'
	}
}));

/**
 * The notifications page.
 */
function NotificationsView() {
	return (
		<Root
			header={<NotificationsHeader />}
			content={<NotificationsTable />}
		/>
	);
}

export default NotificationsView;

