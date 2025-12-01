import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import PageBreadcrumb from 'src/components/PageBreadcrumb';
import { useDeleteNotifications } from '../../api/hooks/useDeleteNotifications';
import { useGetAllNotifications } from '../../api/hooks/useGetAllNotifications';

type NotificationsAppHeaderProps = {
	onAddClick: () => void;
};

/**
 * The Notifications app header.
 */
function NotificationsAppHeader({ onAddClick }: NotificationsAppHeaderProps) {
	const { data: notifications } = useGetAllNotifications();
	const { mutate: deleteNotifications } = useDeleteNotifications();

	function handleDismissAll() {
		deleteNotifications(notifications.map((notification) => notification.id));
	}

	return (
		<div className="container flex w-full">
			<div className="flex min-w-0 flex-auto flex-col p-4 pb-0 sm:flex-row sm:items-center md:p-6">
				<div className="flex flex-auto flex-col">
					<PageBreadcrumb className="mb-2" />

					<Typography className="mb-1 text-3xl leading-none font-extrabold tracking-tight">
						Notifications
					</Typography>
					<Typography
						className="font-medium tracking-tight"
						color="text.secondary"
					>
						Lists all notifications
					</Typography>
				</div>
				<div className="mt-3 flex items-center gap-2 sm:mx-2 sm:mt-0">
					<Button
						className="whitespace-nowrap"
						onClick={onAddClick}
						variant="contained"
						color="secondary"
						startIcon={<FuseSvgIcon>lucide:plus</FuseSvgIcon>}
					>
						New Notification
					</Button>

					<Button
						className="whitespace-nowrap"
						variant="outlined"
						color="inherit"
						onClick={handleDismissAll}
						startIcon={<FuseSvgIcon>lucide:bell-off</FuseSvgIcon>}
					>
						Dismiss All
					</Button>
				</div>
			</div>
		</div>
	);
}

export default NotificationsAppHeader;
