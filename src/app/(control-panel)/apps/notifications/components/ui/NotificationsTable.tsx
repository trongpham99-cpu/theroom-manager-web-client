import { useMemo } from 'react';
import { type MRT_ColumnDef } from 'material-react-table';
import DataTable from 'src/components/data-table/DataTable';
import { ListItemIcon, MenuItem, Paper } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FuseLoading from '@fuse/core/FuseLoading';
import { Notification } from '../../api/types';
import { useDeleteNotifications } from '../../api/hooks/useDeleteNotifications';
import { useNotifications } from '../../api/hooks/useNotifications';

function NotificationsTable() {
	const { data: notifications, isLoading } = useNotifications();
	const { mutate: deleteNotifications } = useDeleteNotifications();

	const columns = useMemo<MRT_ColumnDef<Notification>[]>(
		() => [
			{
				accessorKey: 'title',
				header: 'Title',
				size: 250,
				Cell: ({ row }) => (
					<Typography
						variant="body2"
						className="font-semibold"
					>
						{row.original.title}
					</Typography>
				)
			},
			{
				accessorKey: 'content',
				header: 'Content',
				Cell: ({ row }) => (
					<Typography
						variant="body2"
						className="truncate max-w-md"
					>
						{row.original.content}
					</Typography>
				)
			},
			{
				id: 'rooms',
				header: 'Rooms',
				size: 150,
				Cell: ({ row }) => {
					const rooms = row.original.room_ids || [];
					return (
						<Typography
							variant="body2"
							className="truncate"
						>
							{rooms.length > 0 ? rooms.map((r) => r.code).join(', ') : '-'}
						</Typography>
					);
				}
			},
			{
				id: 'apartments',
				header: 'Apartments',
				size: 150,
				Cell: ({ row }) => {
					const apartments = row.original.apartment_ids || [];
					return (
						<Typography
							variant="body2"
							className="truncate"
						>
							{apartments.length > 0 ? apartments.map((a) => a.code).join(', ') : '-'}
						</Typography>
					);
				}
			},
			{
				accessorKey: 'createdAt',
				header: 'Created At',
				size: 180,
				Cell: ({ row }) => (
					<Typography variant="body2">
						{new Date(row.original.createdAt).toLocaleString()}
					</Typography>
				)
			}
		],
		[]
	);

	if (isLoading) {
		return <FuseLoading />;
	}

	return (
		<Paper
			className="shadow-1 flex h-full w-full flex-auto flex-col overflow-hidden rounded-t-lg rounded-b-none"
			elevation={0}
		>
			<DataTable
				data={notifications || []}
				columns={columns}
				renderRowActionMenuItems={({ closeMenu, row, table }) => [
					<MenuItem
						key={0}
						onClick={() => {
							deleteNotifications([row.original._id]);
							closeMenu();
							table.resetRowSelection();
						}}
					>
						<ListItemIcon>
							<FuseSvgIcon>lucide:trash</FuseSvgIcon>
						</ListItemIcon>
						Delete
					</MenuItem>
				]}
				renderTopToolbarCustomActions={({ table }) => {
					const { rowSelection } = table.getState();

					if (Object.keys(rowSelection).length === 0) {
						return null;
					}

					return (
						<Button
							variant="contained"
							size="small"
							onClick={() => {
								const selectedRows = table.getSelectedRowModel().rows;
								deleteNotifications(selectedRows.map((row) => row.original._id));
								table.resetRowSelection();
							}}
							className="flex min-w-9 shrink ltr:mr-2 rtl:ml-2"
							color="secondary"
						>
							<FuseSvgIcon>lucide:trash</FuseSvgIcon>
							<span className="mx-2 hidden sm:flex">Delete selected items</span>
						</Button>
					);
				}}
			/>
		</Paper>
	);
}

export default NotificationsTable;

