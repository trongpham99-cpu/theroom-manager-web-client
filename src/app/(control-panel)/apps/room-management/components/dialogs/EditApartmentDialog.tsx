import { useCallback, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import { useUpdateApartment } from '../../api/hooks/useUpdateApartment';
import { Apartment } from '../../api/types';

type FormType = {
	name: string;
	code: string;
	address: string;
	description: string;
};

type EditApartmentDialogProps = {
	open: boolean;
	onClose: () => void;
	apartment: Apartment | null;
};

function EditApartmentDialog({ open, onClose, apartment }: EditApartmentDialogProps) {
	const { t } = useTranslation('roomManagementApp');
	const { enqueueSnackbar } = useSnackbar();
	const updateApartment = useUpdateApartment();

	const schema = z.object({
		name: z.string().optional(),
		code: z.string().optional(),
		address: z.string().optional(),
		description: z.string().optional()
	});

	const {
		control,
		formState: { errors },
		handleSubmit,
		reset
	} = useForm<FormType>({
		mode: 'onChange',
		defaultValues: {
			name: '',
			code: '',
			address: '',
			description: ''
		},
		resolver: zodResolver(schema)
	});

	useEffect(() => {
		if (apartment) {
			reset({
				name: apartment.name,
				code: apartment.code,
				address: apartment.address || '',
				description: apartment.description || ''
			});
		}
	}, [apartment, reset]);

	const onSubmit = useCallback(
		async (formData: FormType) => {
			if (!apartment) return;

			try {
				await updateApartment.mutateAsync({
					id: apartment._id,
					...formData
				});
				enqueueSnackbar('Apartment updated successfully!', { variant: 'success' });
				reset();
				onClose();
			} catch (error) {
				enqueueSnackbar('Failed to update apartment. Please try again.', {
					variant: 'error'
				});
				console.error('Error updating apartment:', error);
			}
		},
		[apartment, updateApartment, enqueueSnackbar, onClose, reset]
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
				<DialogTitle>{t('EDIT_APARTMENT_TITLE')}</DialogTitle>

				<DialogContent>
					<div className="mt-4 flex flex-col gap-4">
						<Controller
							name="name"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Tên toà nhà"
									placeholder="VD: Toà nhà A"
									fullWidth
									error={!!errors.name}
									helperText={errors.name?.message}
									variant="outlined"
									autoFocus
									disabled={updateApartment.isPending}
								/>
							)}
						/>
						<Controller
							name="code"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label={t('CODE')}
									placeholder="VD: A1, BLD-A"
									fullWidth
									error={!!errors.code}
									helperText={errors.code?.message}
									variant="outlined"
									disabled={updateApartment.isPending}
								/>
							)}
						/>
						<Controller
							name="address"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Địa chỉ"
									placeholder="VD: 123 Đường ABC, Quận 1"
									fullWidth
									error={!!errors.address}
									helperText={errors.address?.message}
									variant="outlined"
									disabled={updateApartment.isPending}
								/>
							)}
						/>
						<Controller
							name="description"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Mô tả / Ghi chú"
									placeholder="Thông tin bổ sung..."
									fullWidth
									multiline
									rows={3}
									error={!!errors.description}
									helperText={errors.description?.message}
									variant="outlined"
									disabled={updateApartment.isPending}
								/>
							)}
						/>
					</div>
				</DialogContent>

				<DialogActions>
					<Button
						onClick={handleClose}
						color="inherit"
						disabled={updateApartment.isPending}
					>
						{t('CANCEL')}
					</Button>
					<Button
						type="submit"
						variant="contained"
						color="secondary"
						disabled={updateApartment.isPending}
					>
						{updateApartment.isPending ? t('SAVING') : t('SAVE')}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
}

export default EditApartmentDialog;

