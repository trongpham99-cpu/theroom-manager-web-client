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
import { useTranslation } from 'react-i18next';
import { useApartments } from '../../api/hooks/useApartments';
import { useUpdateRoom } from '../../api/hooks/useUpdateRoom';
import { Room } from '../../api/types';

type FormType = {
	code: string;
	apartment_id: string;
};

type EditRoomDialogProps = {
	open: boolean;
	onClose: () => void;
	room: Room | null;
};

function EditRoomDialog({ open, onClose, room }: EditRoomDialogProps) {
	const { t } = useTranslation('roomManagementApp');
	const { enqueueSnackbar } = useSnackbar();
	const { data: apartmentsData } = useApartments();
	const apartments = apartmentsData?.rows || [];
	const updateRoom = useUpdateRoom();

	const schema = z.object({
		code: z.string().min(1, t('CODE_REQUIRED')),
		apartment_id: z.string().min(1, t('APARTMENT_REQUIRED'))
	});

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

	useEffect(() => {
		if (room) {
			reset({
				code: room.code,
				apartment_id: room.apartment_id
			});
		}
	}, [room, reset]);

	const onSubmit = useCallback(
		async (formData: FormType) => {
			if (!room) return;

			try {
				await updateRoom.mutateAsync({
					id: room._id,
					code: formData.code,
					apartment_id: formData.apartment_id
				});
				enqueueSnackbar('Room updated successfully!', { variant: 'success' });
				reset();
				onClose();
			} catch (error) {
				enqueueSnackbar('API chưa sẵn sàng. Backend chưa implement PUT /rooms/:id', { 
					variant: 'warning' 
				});
				console.error('Error updating room:', error);
			}
		},
		[room, updateRoom, enqueueSnackbar, onClose, reset]
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
			open={true}
			onClose={handleClose}
			maxWidth="sm"
			fullWidth
		>
			<form onSubmit={handleSubmit(onSubmit)}>
				<DialogTitle>{t('EDIT_ROOM_TITLE')}</DialogTitle>

				<DialogContent>
					<div className="mt-4 space-y-4">
						<Controller
							name="code"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label={t('CODE')}
									placeholder="e.g., A101, B203"
									fullWidth
									error={!!errors.code}
									helperText={errors.code?.message}
									variant="outlined"
									autoFocus
									disabled={updateRoom.isPending}
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
									disabled={updateRoom.isPending}
									disablePortal
									renderInput={(params) => (
										<TextField
											{...params}
											label={t('APARTMENT')}
											placeholder={t('SELECT_APARTMENT')}
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
						disabled={updateRoom.isPending}
					>
						{t('CANCEL')}
					</Button>
					<Button
						type="submit"
						variant="contained"
						color="secondary"
						disabled={updateRoom.isPending}
					>
						{updateRoom.isPending ? t('SAVING') : t('SAVE')}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
}

export default EditRoomDialog;

