'use client';
import { useState } from 'react';
import NotificationsHeader from '../ui/NotificationsHeader';
import NotificationsTable from '../ui/NotificationsTable';
import CreateNotificationDialog from '../dialogs/CreateNotificationDialog';
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
	const [openDialog, setOpenDialog] = useState(false);

	return (
		<>
			<Root
				header={<NotificationsHeader onAddClick={() => setOpenDialog(true)} />}
				content={<NotificationsTable />}
			/>

			<CreateNotificationDialog
				open={openDialog}
				onClose={() => setOpenDialog(false)}
			/>
		</>
	);
}

export default NotificationsView;
