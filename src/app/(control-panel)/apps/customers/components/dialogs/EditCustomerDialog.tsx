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
import { useUpdateCustomer } from '../../api/hooks/useUpdateCustomer';
import { CustomerUpdateInput, Customer } from '../../api/types';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const schema = z.object({
	name: z.string().min(1, 'Name is required').optional(),
	phone: z.string().optional(),
	dob: z.string().optional()
});

type FormType = z.infer<typeof schema>;

type EditCustomerDialogProps = {
	open: boolean;
	onClose: () => void;
	customer: Customer | null;
};

function EditCustomerDialog({ open, onClose, customer }: EditCustomerDialogProps) {
	const { enqueueSnackbar } = useSnackbar();
	const updateCustomer = useUpdateCustomer();

	const {
		control,
		formState: { errors, isValid, isDirty },
		handleSubmit,
		reset
	} = useForm<FormType>({
		mode: 'onChange',
		defaultValues: {
			name: '',
			phone: '',
			dob: ''
		},
		resolver: zodResolver(schema)
	});

	useEffect(() => {
		if (customer && open) {
			reset({
				name: customer.name || '',
				phone: customer.phone || '',
				dob: customer.dob ? customer.dob.split('T')[0] : ''
			});
		}
	}, [customer, open, reset]);

	const onSubmit = useCallback(
		async (formData: FormType) => {
			if (!customer) return;

			try {
				const payload: CustomerUpdateInput = {
					name: formData.name || undefined,
					phone: formData.phone || undefined,
					dob: formData.dob || undefined
				};
				await updateCustomer.mutateAsync({ id: customer._id, data: payload });
				onClose();
			} catch (error) {
				console.error('Error updating customer:', error);
			}
		},
		[updateCustomer, customer, onClose]
	);

	const handleClose = () => {
		reset();
		onClose();
	};

	if (!open || !customer) {
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
						<FuseSvgIcon>lucide:pencil</FuseSvgIcon>
						<Typography variant="h6">Edit Customer</Typography>
					</Box>
				</DialogTitle>

				<DialogContent dividers>
					<Box className="flex flex-col gap-4 py-2">
						<Controller
							name="name"
							control={control}
							render={({ field }) => (
								<FormControl
									fullWidth
									className="w-full"
								>
									<FormLabel htmlFor="name">Name</FormLabel>
									<TextField
										{...field}
										id="name"
										placeholder="Nguyễn Văn A"
										error={!!errors.name}
										helperText={errors.name?.message}
										variant="outlined"
										fullWidth
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
					</Box>
				</DialogContent>

				<DialogActions className="border-t px-6 py-4">
					<Button
						onClick={handleClose}
						color="inherit"
						disabled={updateCustomer.isPending}
					>
						Cancel
					</Button>
					<Button
						type="submit"
						variant="contained"
						color="secondary"
						disabled={updateCustomer.isPending || !isValid || !isDirty}
						startIcon={<FuseSvgIcon>lucide:check</FuseSvgIcon>}
					>
						{updateCustomer.isPending ? 'Updating...' : 'Update Customer'}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
}

export default EditCustomerDialog;

