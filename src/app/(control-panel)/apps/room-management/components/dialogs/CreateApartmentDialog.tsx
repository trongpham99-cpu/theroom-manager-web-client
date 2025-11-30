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
	code: string;
};

type CreateApartmentDialogProps = {
	open: boolean;
	onClose: () => void;
};

function CreateApartmentDialog({ open, onClose }: CreateApartmentDialogProps) {
	console.log('🎬 CreateApartmentDialog render - open:', open);
	const { t } = useTranslation('roomManagementApp');
	const { enqueueSnackbar } = useSnackbar();
	const createApartment = useCreateApartment();

	const schema = z.object({
		code: z.string().min(1, t('CODE_REQUIRED'))
	});

	const {
		control,
		formState: { errors },
		handleSubmit,
		reset
	} = useForm<FormType>({
		mode: 'onChange',
		defaultValues: {
			code: ''
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

	console.log('📦 CreateApartmentDialog JSX render - open:', open);

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
					<div className="mt-4">
						<Controller
							name="code"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label={t('CODE')}
									placeholder="e.g., Building A, Tòa A"
									fullWidth
									error={!!errors.code}
									helperText={errors.code?.message}
									variant="outlined"
									autoFocus
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

