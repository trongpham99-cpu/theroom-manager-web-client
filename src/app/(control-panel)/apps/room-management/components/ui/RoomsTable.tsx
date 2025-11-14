import { useMemo, useState } from 'react';
import { type MRT_ColumnDef } from 'material-react-table';
import DataTable from 'src/components/data-table/DataTable';
import { Paper, IconButton, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import Typography from '@mui/material/Typography';
import FuseLoading from '@fuse/core/FuseLoading';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useSnackbar } from 'notistack';
import { useFuseDialogContext } from '@fuse/core/FuseDialog/contexts/FuseDialogContext/useFuseDialogContext';
import { Room } from '../../api/types';
import { useRooms } from '../../api/hooks/useRooms';
import { useApartments } from '../../api/hooks/useApartments';
import { useDeleteRoom } from '../../api/hooks/useDeleteRoom';
import EditRoomDialog from '../dialogs/EditRoomDialog';

function RoomsTable() {
	const { data: roomsData, isLoading: roomsLoading } = useRooms();
	const { data: apartmentsData, isLoading: apartmentsLoading } = useApartments();
	const deleteRoom = useDeleteRoom();
	const { enqueueSnackbar } = useSnackbar();
	const { openDialog } = useFuseDialogContext();
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

	// Create a lookup map for apartments
	const apartmentsMap = useMemo(() => {
		if (!apartmentsData?.rows) return {};
		return apartmentsData.rows.reduce((acc, apt) => {
			acc[apt._id] = apt.code;
			return acc;
		}, {} as Record<string, string>);
	}, [apartmentsData]);

	const handleEdit = (room: Room) => {
		setSelectedRoom(room);
		setEditDialogOpen(true);
	};

	const handleDelete = (room: Room) => {
		openDialog({
			id: `confirm-delete-room-${room._id}`,
			content: ({ handleClose }) => (
				<>
					<DialogTitle>Delete Room?</DialogTitle>
					<DialogContent>
						<DialogContentText>
							Are you sure you want to delete room <strong>{room.code}</strong>?
							<br />
							This action cannot be undone.
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button
							onClick={handleClose}
							color="inherit"
						>
							Cancel
						</Button>
						<Button
							onClick={async () => {
								try {
									await deleteRoom.mutateAsync(room._id);
									enqueueSnackbar('Room deleted successfully!', { variant: 'success' });
									handleClose();
								} catch (error) {
									enqueueSnackbar('API chưa sẵn sàng. Backend chưa implement DELETE /rooms/:id', {
										variant: 'warning'
									});
									console.error('Error deleting room:', error);
									handleClose();
								}
							}}
							variant="contained"
							color="error"
							autoFocus
						>
							Delete
						</Button>
					</DialogActions>
				</>
			)
		});
	};

	const columns = useMemo<MRT_ColumnDef<Room>[]>(
		() => [
			{
				accessorKey: 'code',
				header: 'Room Code',
				size: 200,
				Cell: ({ row }) => (
					<Typography
						variant="body2"
						className="font-semibold"
					>
						{row.original.code}
					</Typography>
				)
			},
			{
				accessorKey: 'apartment_id',
				header: 'Apartment',
				size: 200,
				Cell: ({ row }) => (
					<Typography variant="body2">
						{apartmentsMap[row.original.apartment_id] || row.original.apartment_id}
					</Typography>
				)
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
			},
			{
				accessorKey: 'updatedAt',
				header: 'Updated At',
				size: 180,
				Cell: ({ row }) => (
					<Typography variant="body2">
						{new Date(row.original.updatedAt).toLocaleString()}
					</Typography>
				)
			}
		],
		[apartmentsMap]
	);

	if (roomsLoading || apartmentsLoading) {
		return <FuseLoading />;
	}

	return (
		<>
			<Paper
				className="shadow-1 flex h-full w-full flex-auto flex-col overflow-hidden rounded-t-lg rounded-b-none"
				elevation={0}
			>
			<DataTable
				data={roomsData?.rows || []}
				columns={columns}
				renderRowActions={({ row }) => (
					<div className="flex items-center gap-1">
						<IconButton
							size="small"
							onClick={() => handleEdit(row.original)}
							color="primary"
						>
							<FuseSvgIcon size={20}>lucide:pencil</FuseSvgIcon>
						</IconButton>
						<IconButton
							size="small"
							onClick={() => handleDelete(row.original)}
							color="error"
						>
							<FuseSvgIcon size={20}>lucide:trash-2</FuseSvgIcon>
						</IconButton>
					</div>
				)}
			/>
			</Paper>

			<EditRoomDialog
				open={editDialogOpen}
				onClose={() => {
					setEditDialogOpen(false);
					setSelectedRoom(null);
				}}
				room={selectedRoom}
			/>
		</>
	);
}

export default RoomsTable;

