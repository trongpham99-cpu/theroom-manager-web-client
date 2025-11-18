import { useCallback, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSnackbar } from 'notistack';
import { useCreateCustomer } from '../../api/hooks/useCreateCustomer';
import { CustomerCreateInput } from '../../api/types';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { useApartments } from '../../../room-management/api/hooks/useApartments';
import { useRooms } from '../../../room-management/api/hooks/useRooms';

const schema = z.object({
	uuid: z.string().min(1, 'UUID is required'),
	name: z.string().min(1, 'Name is required'),
	phone: z.string().optional(),
	dob: z.string().optional(),
	room_id: z.string().optional(),
	apartment_id: z.string().optional()
});

type FormType = z.infer<typeof schema>;

type CreateCustomerDialogProps = {
	open: boolean;
	onClose: () => void;
};

function CreateCustomerDialog({ open, onClose }: CreateCustomerDialogProps) {
	const { enqueueSnackbar } = useSnackbar();
	const createCustomer = useCreateCustomer();
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
			uuid: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
			name: '',
			phone: '',
			dob: '',
			room_id: '',
			apartment_id: ''
		},
		resolver: zodResolver(schema)
	});

	const watchedApartmentId = watch('apartment_id');
	const watchedRoomId = watch('room_id');

	// Filter rooms by selected apartment
	const availableRooms = watchedApartmentId
		? rooms.filter((room) => room.apartment_id === watchedApartmentId)
		: rooms;

	useEffect(() => {
		if (!open) {
			reset({
				uuid: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
				name: '',
				phone: '',
				dob: '',
				room_id: '',
				apartment_id: ''
			});
		}
	}, [open, reset]);

	// Reset room when apartment changes
	useEffect(() => {
		if (watchedApartmentId && watchedRoomId) {
			const currentRoom = rooms.find((r) => r._id === watchedRoomId);
			if (currentRoom?.apartment_id !== watchedApartmentId) {
				const currentValues = getValues();
				reset(
					{
						...currentValues,
						apartment_id: watchedApartmentId,
						room_id: ''
					},
					{ keepDefaultValues: false }
				);
			}
		}
	}, [watchedApartmentId, watchedRoomId, rooms, reset, getValues]);

	const onSubmit = useCallback(
		async (formData: FormType) => {
			try {
				const payload: CustomerCreateInput = {
					uuid: formData.uuid,
					name: formData.name,
					phone: formData.phone || undefined,
					dob: formData.dob || undefined,
					room_id: formData.room_id || undefined,
					apartment_id: formData.apartment_id || undefined
				};
				await createCustomer.mutateAsync(payload);
				onClose();
			} catch (error) {
				console.error('Error creating customer:', error);
			}
		},
		[createCustomer, onClose]
	);

	const handleClose = () => {
		reset();
		onClose();
	};

	if (!open) {
		return null;
	}

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
						<FuseSvgIcon>lucide:user-plus</FuseSvgIcon>
						<Typography variant="h6">Create New Customer</Typography>
					</Box>
				</DialogTitle>

				<DialogContent dividers>
					<Box className="flex flex-col gap-4 py-2">
						<Controller
							name="uuid"
							control={control}
							render={({ field }) => (
								<FormControl
									fullWidth
									className="w-full"
								>
									<FormLabel htmlFor="uuid">
										UUID <span className="text-red-500">*</span>
									</FormLabel>
									<TextField
										{...field}
										id="uuid"
										placeholder="Auto-generated UUID"
										error={!!errors.uuid}
										helperText={errors.uuid?.message || 'Unique identifier (auto-generated)'}
										variant="outlined"
										fullWidth
										required
										disabled
										slotProps={{
											input: {
												startAdornment: <FuseSvgIcon color="action">lucide:hash</FuseSvgIcon>
											}
										}}
									/>
								</FormControl>
							)}
						/>

						<Controller
							name="name"
							control={control}
							render={({ field }) => (
								<FormControl
									fullWidth
									className="w-full"
								>
									<FormLabel htmlFor="name">
										Name <span className="text-red-500">*</span>
									</FormLabel>
									<TextField
										{...field}
										id="name"
										placeholder="Nguyễn Văn A"
										error={!!errors.name}
										helperText={errors.name?.message}
										variant="outlined"
										fullWidth
										required
										slotProps={{
											input: {
												startAdornment: <FuseSvgIcon color="action">lucide:user</FuseSvgIcon>
											}
										}}
									/>
								</FormControl>
							)}
						/>

						<Grid
							container
							spacing={2}
						>
							<Grid size={6}>
								<Controller
									name="phone"
									control={control}
									render={({ field }) => (
										<FormControl
											fullWidth
											className="w-full"
										>
											<FormLabel htmlFor="phone">Phone</FormLabel>
											<TextField
												{...field}
												id="phone"
												placeholder="0901234567"
												error={!!errors.phone}
												helperText={errors.phone?.message}
												variant="outlined"
												fullWidth
												slotProps={{
													input: {
														startAdornment: <FuseSvgIcon color="action">lucide:phone</FuseSvgIcon>
													}
												}}
											/>
										</FormControl>
									)}
								/>
							</Grid>
							<Grid size={6}>
								<Controller
									name="dob"
									control={control}
									render={({ field }) => (
										<FormControl
											fullWidth
											className="w-full"
										>
											<FormLabel htmlFor="dob">Date of Birth</FormLabel>
											<TextField
												{...field}
												type="date"
												id="dob"
												error={!!errors.dob}
												helperText={errors.dob?.message}
												variant="outlined"
												fullWidth
												slotProps={{
													input: {
														startAdornment: <FuseSvgIcon color="action">lucide:calendar</FuseSvgIcon>
													}
												}}
											/>
										</FormControl>
									)}
								/>
							</Grid>
						</Grid>

						<Divider className="my-2" />

						<Typography
							variant="subtitle2"
							color="text.secondary"
							className="mb-2"
						>
							Room Assignment (Optional)
						</Typography>

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
											placeholder="Select apartment (optional)"
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
											label="Room"
											placeholder={
												watchedApartmentId
													? 'Select room (optional)'
													: apartments.length > 0
														? 'Select apartment first'
														: 'Select room (optional)'
											}
											variant="outlined"
											error={!!errors.room_id}
											helperText={errors.room_id?.message}
										/>
									)}
								/>
							)}
						/>

						{watchedRoomId && !watchedApartmentId && (
							<Typography
								variant="caption"
								color="warning.main"
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
						disabled={createCustomer.isPending}
					>
						Cancel
					</Button>
					<Button
						type="submit"
						variant="contained"
						color="secondary"
						disabled={createCustomer.isPending || !isValid}
						startIcon={<FuseSvgIcon>lucide:check</FuseSvgIcon>}
					>
						{createCustomer.isPending ? 'Creating...' : 'Create Customer'}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
}

export default CreateCustomerDialog;

