import { useCallback, useEffect, useMemo } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSnackbar } from 'notistack';
import { useAssignRoom } from '../../api/hooks/useAssignRoom';
import { Customer } from '../../api/types';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { useApartments } from '../../../room-management/api/hooks/useApartments';
import { useRooms } from '../../../room-management/api/hooks/useRooms';

const schema = z.object({
	apartment_id: z.string().optional(),
	room_id: z.string().min(1, 'Room is required')
});

type FormType = z.infer<typeof schema>;

type AssignRoomDialogProps = {
	open: boolean;
	onClose: () => void;
	customer: Customer | null;
};

function AssignRoomDialog({ open, onClose, customer }: AssignRoomDialogProps) {
	const { enqueueSnackbar } = useSnackbar();
	const assignRoom = useAssignRoom();
	const { data: apartmentsData } = useApartments();
	const { data: roomsData } = useRooms();
	const apartments = apartmentsData?.rows || [];
	const rooms = roomsData?.rows || [];

	const {
		control,
		formState: { errors, isValid },
		handleSubmit,
		reset,
		watch,
		getValues
	} = useForm<FormType>({
		mode: 'onChange',
		defaultValues: {
			apartment_id: '',
			room_id: ''
		},
		resolver: zodResolver(schema)
	});

	const watchedApartmentId = watch('apartment_id');

	// Filter rooms by selected apartment
	const availableRooms = useMemo(() => {
		if (watchedApartmentId) {
			return rooms.filter((room) => room.apartment_id === watchedApartmentId);
		}
		return rooms;
	}, [watchedApartmentId, rooms]);

	// Reset room when apartment changes
	useEffect(() => {
		if (watchedApartmentId) {
			const currentValues = getValues();
			reset({ ...currentValues, room_id: '' }, { keepValues: false });
		}
	}, [watchedApartmentId, reset, getValues]);

	useEffect(() => {
		if (!open) {
			reset({
				apartment_id: '',
				room_id: ''
			});
		}
	}, [open, reset]);

	const onSubmit = useCallback(
		async (formData: FormType) => {
			if (!customer) return;

			try {
				await assignRoom.mutateAsync({
					customerId: customer._id,
					data: {
						room_id: formData.room_id
					}
				});
				onClose();
			} catch (error) {
				console.error('Error assigning room:', error);
			}
		},
		[assignRoom, customer, onClose]
	);

	const handleClose = () => {
		reset();
		onClose();
	};

	if (!open || !customer) {
		return null;
	}

	const hasRoom = !!customer.room_id;
	const currentRoom = customer.room_id?.code;
	const currentApartment = customer.apartment_id?.code;

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			maxWidth="sm"
			fullWidth
		>
			<form onSubmit={handleSubmit(onSubmit)}>
				<DialogTitle>
					<Box className="flex items-center gap-2">
						<FuseSvgIcon>{hasRoom ? 'lucide:move' : 'lucide:door-open'}</FuseSvgIcon>
						<Typography variant="h6">
							{hasRoom ? 'Change Room' : 'Assign Room'}
						</Typography>
					</Box>
				</DialogTitle>

				<DialogContent dividers>
					<Box className="flex flex-col gap-4 py-2">
						<Typography
							variant="body1"
							className="mb-2"
						>
							Customer: <strong>{customer.name}</strong>
						</Typography>

						{hasRoom && (
							<Box className="mb-2 rounded-lg border p-3">
								<Typography
									variant="body2"
									color="text.secondary"
									className="mb-1"
								>
									Current Room:
								</Typography>
								<Box className="flex items-center gap-2">
									{currentApartment && (
										<Chip
											label={currentApartment}
											size="small"
											color="default"
											variant="outlined"
										/>
									)}
									<Chip
										label={currentRoom}
										size="small"
										color="primary"
									/>
								</Box>
							</Box>
						)}

						<Controller
							name="apartment_id"
							control={control}
							render={({ field: { onChange, value } }) => (
								<Autocomplete
									options={apartments}
									getOptionLabel={(option) => option.code}
									value={apartments.find((apt) => apt._id === value) || null}
									onChange={(_, newValue) => {
										onChange(newValue?._id || '');
									}}
									disablePortal
									renderInput={(params) => (
										<TextField
											{...params}
											label="Apartment"
											placeholder="Select apartment"
											variant="outlined"
											error={!!errors.apartment_id}
											helperText={errors.apartment_id?.message}
										/>
									)}
								/>
							)}
						/>

						<Controller
							name="room_id"
							control={control}
							render={({ field: { onChange, value } }) => (
								<FormControl
									fullWidth
									className="w-full"
								>
									<FormLabel htmlFor="room_id">
										Room <span className="text-red-500">*</span>
									</FormLabel>
									<Autocomplete
										options={availableRooms}
										getOptionLabel={(option) => option.code}
										value={availableRooms.find((room) => room._id === value) || null}
										onChange={(_, newValue) => {
											onChange(newValue?._id || '');
										}}
										disabled={!watchedApartmentId && apartments.length > 0}
										disablePortal
										renderInput={(params) => (
											<TextField
												{...params}
												placeholder={
													watchedApartmentId
														? 'Select room'
														: apartments.length > 0
															? 'Select apartment first'
															: 'Select room'
												}
												variant="outlined"
												error={!!errors.room_id}
												helperText={errors.room_id?.message || 'Required'}
												required
											/>
										)}
									/>
								</FormControl>
							)}
						/>

						{watchedApartmentId && !watch('room_id') && availableRooms.length > 0 && (
							<Typography
								variant="caption"
								color="info.main"
								className="mt-1"
							>
								Note: Apartment will be auto-assigned from selected room.
							</Typography>
						)}
					</Box>
				</DialogContent>

				<DialogActions className="border-t px-6 py-4">
					<Button
						onClick={handleClose}
						color="inherit"
						disabled={assignRoom.isPending}
					>
						Cancel
					</Button>
					<Button
						type="submit"
						variant="contained"
						color="primary"
						disabled={assignRoom.isPending || !isValid}
						startIcon={<FuseSvgIcon>{hasRoom ? 'lucide:move' : 'lucide:check'}</FuseSvgIcon>}
					>
						{assignRoom.isPending ? 'Processing...' : hasRoom ? 'Change Room' : 'Assign Room'}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
}

export default AssignRoomDialog;

