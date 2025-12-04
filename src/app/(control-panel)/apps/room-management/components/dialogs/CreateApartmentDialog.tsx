import { useCallback } from 'react';
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
import { useCreateApartment } from '../../api/hooks/useCreateApartment';

type FormType = {
	name: string;
	code: string;
	address: string;
	description: string;
};

type CreateApartmentDialogProps = {
	open: boolean;
	onClose: () => void;
};

function CreateApartmentDialog({ open, onClose }: CreateApartmentDialogProps) {
	const { t } = useTranslation('roomManagementApp');
	const { enqueueSnackbar } = useSnackbar();
	const createApartment = useCreateApartment();

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

	const onSubmit = useCallback(
		async (formData: FormType) => {
			try {
				await createApartment.mutateAsync(formData);
				enqueueSnackbar('Apartment created successfully!', { variant: 'success' });
				reset();
				onClose();
			} catch (error) {
				enqueueSnackbar('Failed to create apartment. Please try again.', { variant: 'error' });
				console.error('Error creating apartment:', error);
			}
		},
		[createApartment, enqueueSnackbar, onClose, reset]
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
				<DialogTitle>{t('CREATE_APARTMENT')}</DialogTitle>

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
									disabled={createApartment.isPending}
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
									disabled={createApartment.isPending}
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
									disabled={createApartment.isPending}
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
									disabled={createApartment.isPending}
								/>
							)}
						/>
					</div>
				</DialogContent>

				<DialogActions>
					<Button
						onClick={handleClose}
						color="inherit"
						disabled={createApartment.isPending}
					>
						{t('CANCEL')}
					</Button>
					<Button
						type="submit"
						variant="contained"
						color="secondary"
						disabled={createApartment.isPending}
					>
						{createApartment.isPending ? t('CREATING') : t('CREATE')}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
}

export default CreateApartmentDialog;

