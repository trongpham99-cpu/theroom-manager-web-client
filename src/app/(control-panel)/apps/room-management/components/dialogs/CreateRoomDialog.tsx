import { useCallback } from 'react';
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
import { useApartments } from '../../api/hooks/useApartments';
import { useCreateRoom } from '../../api/hooks/useCreateRoom';

const schema = z.object({
	code: z.string().min(1, 'Code is required'),
	apartment_id: z.string().min(1, 'Apartment is required')
});

type FormType = z.infer<typeof schema>;

type CreateRoomDialogProps = {
	open: boolean;
	onClose: () => void;
};

function CreateRoomDialog({ open, onClose }: CreateRoomDialogProps) {
	const { enqueueSnackbar } = useSnackbar();
	const { data: apartmentsData } = useApartments();
	const apartments = apartmentsData?.rows || [];
	const createRoom = useCreateRoom();

	const {
		control,
		formState: { errors },
		handleSubmit,
		reset
	} = useForm<FormType>({
		mode: 'onChange',
		defaultValues: {
			code: '',
			apartment_id: ''
		},
		resolver: zodResolver(schema)
	});

	const onSubmit = useCallback(
		async (formData: FormType) => {
			try {
				await createRoom.mutateAsync(formData);
				enqueueSnackbar('Room created successfully!', { variant: 'success' });
				reset();
				onClose();
			} catch (error) {
				enqueueSnackbar('Failed to create room. Please try again.', { variant: 'error' });
				console.error('Error creating room:', error);
			}
		},
		[createRoom, enqueueSnackbar, onClose, reset]
	);

	const handleClose = () => {
		reset();
		onClose();
	};

	console.log('📦 CreateRoomDialog JSX render - open:', open);

	if (!open) {
		return null;
	}

	return (
		<Dialog
			open={true}
			onClose={handleClose}
			maxWidth="sm"
			fullWidth
		>
			<form onSubmit={handleSubmit(onSubmit)}>
				<DialogTitle>Create New Room</DialogTitle>

				<DialogContent>
					<div className="mt-4 space-y-4">
						<Controller
							name="code"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Room Code"
									placeholder="e.g., A101, B203"
									fullWidth
									error={!!errors.code}
									helperText={errors.code?.message}
									variant="outlined"
									autoFocus
									disabled={createRoom.isPending}
								/>
							)}
						/>

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
									disabled={createRoom.isPending}
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
					</div>
				</DialogContent>

				<DialogActions>
					<Button
						onClick={handleClose}
						color="inherit"
						disabled={createRoom.isPending}
					>
						Cancel
					</Button>
					<Button
						type="submit"
						variant="contained"
						color="secondary"
						disabled={createRoom.isPending}
					>
						{createRoom.isPending ? 'Creating...' : 'Create'}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
}

export default CreateRoomDialog;

