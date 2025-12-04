import useParams from '@fuse/hooks/useParams';
import FuseLoading from '@fuse/core/FuseLoading';
import { useApartment } from '../../api/hooks/useApartment';
import { useRooms } from '../../api/hooks/useRooms';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import { useState, useMemo } from 'react';
import EditApartmentDialog from '../dialogs/EditApartmentDialog';
import useNavigate from '@fuse/hooks/useNavigate';
import { Paper, Chip, Accordion, AccordionSummary, AccordionDetails, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { Room } from '../../api/types';
import { useSnackbar } from 'notistack';
import { useFuseDialogContext } from '@fuse/core/FuseDialog/contexts/FuseDialogContext/useFuseDialogContext';
import { useDeleteApartment } from '../../api/hooks/useDeleteApartment';

function ApartmentView() {
	const routeParams = useParams<{ apartmentId: string }>();
	const { apartmentId } = routeParams;
	const { data: apartment, isLoading: isLoadingApartment, isError: isErrorApartment } = useApartment(apartmentId);
	const { data: roomsData, isLoading: isLoadingRooms } = useRooms();
	const navigate = useNavigate();
	const { enqueueSnackbar } = useSnackbar();
	const { openDialog } = useFuseDialogContext();
	const deleteApartment = useDeleteApartment();

	const [editDialogOpen, setEditDialogOpen] = useState(false);

	const handleDelete = () => {
		if (!apartment) return;

		openDialog({
			id: `confirm-delete-apartment-${apartment._id}`,
			content: ({ handleClose }) => (
				<>
					<DialogTitle>Xóa toà nhà</DialogTitle>
					<DialogContent>
						<DialogContentText>
							Bạn có chắc chắn muốn xóa toà nhà <strong>{apartment.code}</strong>?
							<br />
							<br />
							<strong style={{ color: '#d32f2f', fontWeight: 'bold' }}>
								Tất cả phòng trong toà nhà cũng sẽ bị xóa.
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
									await deleteApartment.mutateAsync(apartment._id);
									enqueueSnackbar('Xóa toà nhà thành công!', { variant: 'success' });
									handleClose();
									navigate('/apps/room-management');
								} catch (error: any) {
									const errorMessage = error?.message || 'Không thể xóa toà nhà. Vui lòng thử lại.';
									enqueueSnackbar(errorMessage, {
										variant: 'error'
									});
									console.error('Error deleting apartment:', error);
									handleClose();
								}
							}}
							variant="contained"
							color="error"
							autoFocus
						>
							{deleteApartment.isPending ? 'Đang xóa...' : 'Xóa'}
						</Button>
					</DialogActions>
				</>
			)
		});
	};

	// Filter rooms by apartment_id
	const apartmentRooms = useMemo(() => {
		if (!roomsData?.rows || !apartmentId) return [];
		return roomsData.rows.filter((room) => room.apartment_id === apartmentId);
	}, [roomsData, apartmentId]);

	// Calculate available rooms (rooms without customers - this would need customer data)
	const availableRooms = apartmentRooms.length; // Placeholder - will calculate properly later

	if (isLoadingApartment || isLoadingRooms) {
		return <FuseLoading className="min-h-screen" />;
	}

	if (isErrorApartment || !apartment) {
		return (
			<Box className="flex h-full items-center justify-center p-8">
				<Typography
					variant="h6"
					color="error"
				>
					Apartment not found
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
								{apartment.name}
							</Typography>
							<Typography
								variant="body2"
								color="text.secondary"
								className="mt-1"
							>
								{apartment.code}
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
					{/* Apartment Information */}
					<Box className="mb-6">
						<Typography
							variant="h6"
							className="mb-4 font-semibold"
						>
							Thông tin toà nhà
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
									Tên toà nhà
								</Typography>
								<Typography variant="body1">{apartment.name}</Typography>
							</Grid>
							<Grid size={6}>
								<Typography
									variant="body2"
									color="text.secondary"
									className="mb-1"
								>
									Mã toà nhà
								</Typography>
								<Typography variant="body1">{apartment.code}</Typography>
							</Grid>
							<Grid size={12}>
								<Typography
									variant="body2"
									color="text.secondary"
									className="mb-1"
								>
									Địa chỉ
								</Typography>
								<Typography variant="body1">{apartment.address || '-'}</Typography>
							</Grid>
							<Grid size={6}>
								<Typography
									variant="body2"
									color="text.secondary"
									className="mb-1"
								>
									Tổng số phòng
								</Typography>
								<Chip
									label={apartmentRooms.length}
									color="primary"
									size="small"
								/>
							</Grid>
							<Grid size={6}>
								<Typography
									variant="body2"
									color="text.secondary"
									className="mb-1"
								>
									Số phòng trống
								</Typography>
								<Chip
									label={availableRooms}
									color="success"
									size="small"
								/>
							</Grid>
							<Grid size={12}>
								<Typography
									variant="body2"
									color="text.secondary"
									className="mb-1"
								>
									Mô tả / Ghi chú
								</Typography>
								<Typography variant="body1">{apartment.description || '-'}</Typography>
							</Grid>
						</Grid>
					</Box>

					<Divider className="mb-6" />

					{/* Rooms List Dropdown */}
					<Box className="mb-6">
						<Typography
							variant="body1"
							className="mb-2 font-semibold flex items-center gap-2"
						>
							<FuseSvgIcon size={20}>lucide:door-open</FuseSvgIcon>
							Danh sách phòng ({apartmentRooms.length})
						</Typography>
						<Box
							sx={{
								maxHeight: '200px',
								overflowY: 'auto',
								border: 1,
								borderColor: 'divider',
								borderRadius: 1,
								padding: 2
							}}
						>
							{apartmentRooms.length > 0 ? (
								<Box className="flex flex-col gap-1.5">
									{apartmentRooms.map((room) => (
										<Box
											key={room._id}
											sx={{
												padding: '6px 10px',
												border: 1,
												borderColor: 'divider',
												borderRadius: 1,
												backgroundColor: 'background.default'
											}}
										>
											<Typography
												variant="body2"
												className="font-semibold"
											>
												{room.code}
											</Typography>
											<Typography
												variant="caption"
												color="text.secondary"
											>
												{new Date(room.createdAt).toLocaleDateString('vi-VN')}
											</Typography>
										</Box>
									))}
								</Box>
							) : (
								<Typography
									variant="body2"
									color="text.secondary"
								>
									Chưa có phòng nào trong toà nhà này.
								</Typography>
							)}
						</Box>
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
									{new Date(apartment.createdAt).toLocaleString('vi-VN')}
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
									{new Date(apartment.updatedAt).toLocaleString('vi-VN')}
								</Typography>
							</Grid>
						</Grid>
					</Box>
				</Box>
			</Box>

			<EditApartmentDialog
				open={editDialogOpen}
				onClose={() => setEditDialogOpen(false)}
				apartment={apartment}
			/>
		</>
	);
}

export default ApartmentView;
