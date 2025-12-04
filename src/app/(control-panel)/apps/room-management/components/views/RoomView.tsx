import useParams from '@fuse/hooks/useParams';
import FuseLoading from '@fuse/core/FuseLoading';
import { useRoom } from '../../api/hooks/useRoom';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import { useState } from 'react';
import EditRoomDialog from '../dialogs/EditRoomDialog';
import useNavigate from '@fuse/hooks/useNavigate';
import { DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useFuseDialogContext } from '@fuse/core/FuseDialog/contexts/FuseDialogContext/useFuseDialogContext';
import { useDeleteRoom } from '../../api/hooks/useDeleteRoom';

function RoomView() {
	const routeParams = useParams<{ roomId: string }>();
	const { roomId } = routeParams;
	const { data: room, isLoading, isError } = useRoom(roomId);
	const navigate = useNavigate();
	const { enqueueSnackbar } = useSnackbar();
	const { openDialog } = useFuseDialogContext();
	const deleteRoom = useDeleteRoom();

	const [editDialogOpen, setEditDialogOpen] = useState(false);

	const handleDelete = () => {
		if (!room) return;

		openDialog({
			id: `confirm-delete-room-${room._id}`,
			content: ({ handleClose }) => (
				<>
					<DialogTitle>Xóa phòng</DialogTitle>
					<DialogContent>
						<DialogContentText>
							Bạn có chắc chắn muốn xóa phòng <strong>{room.code}</strong>?
							<br />
							<br />
							<strong style={{ color: '#d32f2f', fontWeight: 'bold' }}>
								Hành động này không thể hoàn tác.
							</strong>
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button
							onClick={handleClose}
							color="inherit"
						>
							Hủy
						</Button>
						<Button
							onClick={async () => {
								try {
									await deleteRoom.mutateAsync(room._id);
									enqueueSnackbar('Xóa phòng thành công!', { variant: 'success' });
									handleClose();
									navigate('/apps/room-management');
								} catch (error: any) {
									const errorMessage = error?.message || 'Không thể xóa phòng. Vui lòng thử lại.';
									enqueueSnackbar(errorMessage, {
										variant: 'error'
									});
									console.error('Error deleting room:', error);
									handleClose();
								}
							}}
							variant="contained"
							color="error"
							autoFocus
						>
							{deleteRoom.isPending ? 'Đang xóa...' : 'Xóa'}
						</Button>
					</DialogActions>
				</>
			)
		});
	};

	if (isLoading) {
		return <FuseLoading className="min-h-screen" />;
	}

	if (isError || !room) {
		return (
			<Box className="flex h-full items-center justify-center p-8">
				<Typography
					variant="h6"
					color="error"
				>
					Room not found
				</Typography>
			</Box>
		);
	}

	return (
		<>
			<Box className="flex flex-auto flex-col overflow-y-auto">
				{/* Header */}
				<Box className="border-b px-6 py-4">
					<div className="flex items-center justify-between">
						<Box>
							<Typography
								variant="h5"
								className="font-bold"
							>
								{room.code}
							</Typography>
							<Typography
								variant="body2"
								color="text.secondary"
								className="mt-1"
							>
								Phòng #{room._id.slice(-6)}
							</Typography>
						</Box>
						<div className="flex items-center gap-2">
							<Button
								variant="contained"
								color="secondary"
								onClick={() => setEditDialogOpen(true)}
								startIcon={<FuseSvgIcon>lucide:pencil</FuseSvgIcon>}
							>
								Chỉnh sửa
							</Button>
							<Button
								variant="outlined"
								color="error"
								onClick={handleDelete}
								startIcon={<FuseSvgIcon>lucide:trash-2</FuseSvgIcon>}
							>
								Xóa
							</Button>
						</div>
					</div>
				</Box>

				{/* Content */}
				<Box className="flex flex-auto flex-col p-6 sm:p-12">
					{/* Room Information */}
					<Box className="mb-6">
						<Typography
							variant="h6"
							className="mb-4 font-semibold"
						>
							Thông tin phòng
						</Typography>
						<Grid
							container
							spacing={3}
						>
							<Grid size={6}>
								<Typography
									variant="body2"
									color="text.secondary"
									className="mb-1"
								>
									Mã phòng
								</Typography>
								<Typography variant="body1">{room.code}</Typography>
							</Grid>
							<Grid size={6}>
								<Typography
									variant="body2"
									color="text.secondary"
									className="mb-1"
								>
									Toà nhà
								</Typography>
								<Typography variant="body1">{room.apartment_id || '-'}</Typography>
							</Grid>
						</Grid>
					</Box>

					<Divider className="mb-6" />

					{/* Metadata */}
					<Box>
						<Typography
							variant="h6"
							className="mb-4 font-semibold"
						>
							Metadata
						</Typography>
						<Grid
							container
							spacing={3}
						>
							<Grid size={6}>
								<Typography
									variant="body2"
									color="text.secondary"
									className="mb-1"
								>
									Created At
								</Typography>
								<Typography variant="body1">
									{new Date(room.createdAt).toLocaleString('vi-VN')}
								</Typography>
							</Grid>
							<Grid size={6}>
								<Typography
									variant="body2"
									color="text.secondary"
									className="mb-1"
								>
									Updated At
								</Typography>
								<Typography variant="body1">
									{new Date(room.updatedAt).toLocaleString('vi-VN')}
								</Typography>
							</Grid>
						</Grid>
					</Box>
				</Box>
			</Box>

			<EditRoomDialog
				open={editDialogOpen}
				onClose={() => setEditDialogOpen(false)}
				room={room}
			/>
		</>
	);
}

export default RoomView;
