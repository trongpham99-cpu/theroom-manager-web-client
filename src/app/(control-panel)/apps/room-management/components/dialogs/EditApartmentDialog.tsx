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
import { useUpdateApartment } from '../../api/hooks/useUpdateApartment';
import { Apartment } from '../../api/types';

const schema = z.object({
	code: z.string().min(1, 'Code is required')
});

type FormType = z.infer<typeof schema>;

type EditApartmentDialogProps = {
	open: boolean;
	onClose: () => void;
	apartment: Apartment | null;
};

function EditApartmentDialog({ open, onClose, apartment }: EditApartmentDialogProps) {
	const { enqueueSnackbar } = useSnackbar();
	const updateApartment = useUpdateApartment();

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

	useEffect(() => {
		if (apartment) {
			reset({ code: apartment.code });
		}
	}, [apartment, reset]);

	const onSubmit = useCallback(
		async (formData: FormType) => {
			if (!apartment) return;

			try {
				await updateApartment.mutateAsync({
					id: apartment._id,
					code: formData.code
				});
				enqueueSnackbar('Apartment updated successfully!', { variant: 'success' });
				reset();
				onClose();
			} catch (error) {
				enqueueSnackbar('API chưa sẵn sàng. Backend chưa implement PUT /apartments/:id', { 
					variant: 'warning' 
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
				<DialogTitle>Edit Apartment</DialogTitle>

				<DialogContent>
					<div className="mt-4">
						<Controller
							name="code"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Apartment Code"
									placeholder="e.g., Building A, Tòa A"
									fullWidth
									error={!!errors.code}
									helperText={errors.code?.message}
									variant="outlined"
									autoFocus
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
						Cancel
					</Button>
					<Button
						type="submit"
						variant="contained"
						color="secondary"
						disabled={updateApartment.isPending}
					>
						{updateApartment.isPending ? 'Updating...' : 'Update'}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
}

export default EditApartmentDialog;

