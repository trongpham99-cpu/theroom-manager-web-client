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
import { useCreateInvoice } from '../../api/hooks/useCreateInvoice';
import { InvoiceCreateInput } from '../../api/types';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

const schema = z.object({
	room_code: z.string().optional(),
	customer_name: z.string().optional(),
	gender: z.enum(['Nam', 'Nữ', 'N/A']).optional(),
	birth_date: z.string().optional(),
	phone: z.string().min(1, 'Phone is required'),
	contract: z
		.object({
			start_date: z.string().optional(),
			end_date: z.string().optional(),
			duration_months: z.number().optional()
		})
		.optional(),
	deposit_amount: z.number().optional(),
	room_price: z.number().optional(),
	stay_days: z.number().optional(),
	electricity: z
		.object({
			old_index: z.number().optional(),
			new_index: z.number().optional(),
			staff: z.string().optional()
		})
		.optional(),
	water_fee: z.number().optional(),
	management_fee: z.number().optional(),
	old_debt: z.number().optional(),
	deduction: z.number().optional(),
	note: z.string().optional(),
	extra_note: z.string().optional(),
	month: z.number().min(1).max(12).optional(),
	year: z.number().optional()
});

type FormType = z.infer<typeof schema>;

type CreateInvoiceDialogProps = {
	open: boolean;
	onClose: () => void;
};

function CreateInvoiceDialog({ open, onClose }: CreateInvoiceDialogProps) {
	const { enqueueSnackbar } = useSnackbar();
	const createInvoice = useCreateInvoice();

	const {
		control,
		formState: { errors, isValid },
		handleSubmit,
		reset,
		watch
	} = useForm<FormType>({
		mode: 'onChange',
		defaultValues: {
			phone: '',
			gender: 'Nam',
			month: new Date().getMonth() + 1,
			year: new Date().getFullYear(),
			deposit_amount: 0,
			room_price: 0,
			stay_days: 30,
			electricity: {
				old_index: 0,
				new_index: 0,
				staff: ''
			},
			water_fee: 0,
			management_fee: 0,
			old_debt: 0,
			deduction: 0
		},
		resolver: zodResolver(schema)
	});

	const watchedElectricity = watch('electricity');
	const usedKwh = watchedElectricity?.old_index && watchedElectricity?.new_index
		? Math.max(0, watchedElectricity.new_index - watchedElectricity.old_index)
		: 0;
	const electricityPrice = usedKwh * 4000; // 4000đ/kWh

	useEffect(() => {
		if (!open) {
			reset();
		}
	}, [open, reset]);

	const onSubmit = useCallback(
		async (formData: FormType) => {
			try {
				const payload: InvoiceCreateInput = {
					...formData,
					electricity: formData.electricity
						? {
								...formData.electricity,
								old_index: formData.electricity.old_index || 0,
								new_index: formData.electricity.new_index || 0
							}
						: undefined
				};
				await createInvoice.mutateAsync(payload);
				onClose();
			} catch (error) {
				console.error('Error creating invoice:', error);
			}
		},
		[createInvoice, onClose]
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
			maxWidth="md"
			fullWidth
			PaperProps={{
				sx: {
					maxHeight: '90vh'
				}
			}}
		>
			<form onSubmit={handleSubmit(onSubmit)}>
				<DialogTitle>
					<Box className="flex items-center gap-2">
						<FuseSvgIcon>lucide:file-plus</FuseSvgIcon>
						<Typography variant="h6">Create New Invoice</Typography>
					</Box>
				</DialogTitle>

				<DialogContent dividers>
					<Box className="flex flex-col gap-4 py-2">
						{/* Customer Information */}
						<Box>
							<Typography
								variant="subtitle1"
								className="mb-3 font-semibold"
							>
								Customer Information
							</Typography>
							<Grid
								container
								spacing={2}
							>
								<Grid size={6}>
									<Controller
										name="room_code"
										control={control}
										render={({ field }) => (
											<FormControl
												fullWidth
												className="w-full"
											>
												<FormLabel htmlFor="room_code">Room Code</FormLabel>
												<TextField
													{...field}
													id="room_code"
													placeholder="e.g., A101"
													error={!!errors.room_code}
													helperText={errors.room_code?.message}
													variant="outlined"
													fullWidth
													slotProps={{
														input: {
															startAdornment: <FuseSvgIcon color="action">lucide:door-open</FuseSvgIcon>
														}
													}}
												/>
											</FormControl>
										)}
									/>
								</Grid>
								<Grid size={6}>
									<Controller
										name="customer_name"
										control={control}
										render={({ field }) => (
											<FormControl
												fullWidth
												className="w-full"
											>
												<FormLabel htmlFor="customer_name">Customer Name</FormLabel>
												<TextField
													{...field}
													id="customer_name"
													placeholder="Nguyễn Văn A"
													error={!!errors.customer_name}
													helperText={errors.customer_name?.message}
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
								</Grid>
								<Grid size={4}>
									<Controller
										name="phone"
										control={control}
										render={({ field }) => (
											<FormControl
												fullWidth
												className="w-full"
											>
												<FormLabel htmlFor="phone">
													Phone <span className="text-red-500">*</span>
												</FormLabel>
												<TextField
													{...field}
													id="phone"
													placeholder="0901234567"
													error={!!errors.phone}
													helperText={errors.phone?.message}
													variant="outlined"
													fullWidth
													required
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
								<Grid size={4}>
									<Controller
										name="gender"
										control={control}
										render={({ field }) => (
											<FormControl
												fullWidth
												className="w-full"
											>
												<FormLabel htmlFor="gender">Gender</FormLabel>
												<TextField
													{...field}
													id="gender"
													select
													variant="outlined"
													fullWidth
												>
													<MenuItem value="Nam">Nam</MenuItem>
													<MenuItem value="Nữ">Nữ</MenuItem>
													<MenuItem value="N/A">N/A</MenuItem>
												</TextField>
											</FormControl>
										)}
									/>
								</Grid>
								<Grid size={4}>
									<Controller
										name="birth_date"
										control={control}
										render={({ field: { value, onChange } }) => (
											<FormControl
												fullWidth
												className="w-full"
											>
												<FormLabel htmlFor="birth_date">Birth Date</FormLabel>
												<TextField
													type="date"
													value={value || ''}
													onChange={(e) => onChange(e.target.value)}
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

						<Divider />

						{/* Contract Information */}
						<Box>
							<Typography
								variant="subtitle1"
								className="mb-3 font-semibold"
							>
								Contract Information
							</Typography>
							<Grid
								container
								spacing={2}
							>
								<Grid size={4}>
									<Controller
										name="contract.start_date"
										control={control}
										render={({ field }) => (
											<FormControl
												fullWidth
												className="w-full"
											>
												<FormLabel htmlFor="contract_start_date">Start Date</FormLabel>
												<TextField
													{...field}
													type="date"
													id="contract_start_date"
													variant="outlined"
													fullWidth
												/>
											</FormControl>
										)}
									/>
								</Grid>
								<Grid size={4}>
									<Controller
										name="contract.end_date"
										control={control}
										render={({ field }) => (
											<FormControl
												fullWidth
												className="w-full"
											>
												<FormLabel htmlFor="contract_end_date">End Date</FormLabel>
												<TextField
													{...field}
													type="date"
													id="contract_end_date"
													variant="outlined"
													fullWidth
												/>
											</FormControl>
										)}
									/>
								</Grid>
								<Grid size={4}>
									<Controller
										name="contract.duration_months"
										control={control}
										render={({ field }) => (
											<FormControl
												fullWidth
												className="w-full"
											>
												<FormLabel htmlFor="contract_duration">Duration (Months)</FormLabel>
												<TextField
													{...field}
													type="number"
													id="contract_duration"
													value={field.value || ''}
													onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
													variant="outlined"
													fullWidth
												/>
											</FormControl>
										)}
									/>
								</Grid>
							</Grid>
						</Box>

						<Divider />

						{/* Financial Information */}
						<Box>
							<Typography
								variant="subtitle1"
								className="mb-3 font-semibold"
							>
								Financial Information
							</Typography>
							<Grid
								container
								spacing={2}
							>
								<Grid size={4}>
									<Controller
										name="deposit_amount"
										control={control}
										render={({ field }) => (
											<FormControl
												fullWidth
												className="w-full"
											>
												<FormLabel htmlFor="deposit_amount">Deposit Amount</FormLabel>
												<TextField
													{...field}
													type="number"
													id="deposit_amount"
													value={field.value || 0}
													onChange={(e) => field.onChange(Number(e.target.value) || 0)}
													variant="outlined"
													fullWidth
													slotProps={{
														input: {
															startAdornment: <FuseSvgIcon color="action">lucide:wallet</FuseSvgIcon>
														}
													}}
												/>
											</FormControl>
										)}
									/>
								</Grid>
								<Grid size={4}>
									<Controller
										name="room_price"
										control={control}
										render={({ field }) => (
											<FormControl
												fullWidth
												className="w-full"
											>
												<FormLabel htmlFor="room_price">Room Price</FormLabel>
												<TextField
													{...field}
													type="number"
													id="room_price"
													value={field.value || 0}
													onChange={(e) => field.onChange(Number(e.target.value) || 0)}
													variant="outlined"
													fullWidth
													slotProps={{
														input: {
															startAdornment: <FuseSvgIcon color="action">lucide:home</FuseSvgIcon>
														}
													}}
												/>
											</FormControl>
										)}
									/>
								</Grid>
								<Grid size={4}>
									<Controller
										name="stay_days"
										control={control}
										render={({ field }) => (
											<FormControl
												fullWidth
												className="w-full"
											>
												<FormLabel htmlFor="stay_days">Stay Days</FormLabel>
												<TextField
													{...field}
													type="number"
													id="stay_days"
													value={field.value || 30}
													onChange={(e) => field.onChange(Number(e.target.value) || 30)}
													variant="outlined"
													fullWidth
												/>
											</FormControl>
										)}
									/>
								</Grid>
							</Grid>
						</Box>

						<Divider />

						{/* Electricity Information */}
						<Box>
							<Typography
								variant="subtitle1"
								className="mb-3 font-semibold"
							>
								Electricity Information
							</Typography>
							<Grid
								container
								spacing={2}
							>
								<Grid size={4}>
									<Controller
										name="electricity.old_index"
										control={control}
										render={({ field }) => (
											<FormControl
												fullWidth
												className="w-full"
											>
												<FormLabel htmlFor="electricity_old_index">Old Index</FormLabel>
												<TextField
													{...field}
													type="number"
													id="electricity_old_index"
													value={field.value || 0}
													onChange={(e) => field.onChange(Number(e.target.value) || 0)}
													variant="outlined"
													fullWidth
												/>
											</FormControl>
										)}
									/>
								</Grid>
								<Grid size={4}>
									<Controller
										name="electricity.new_index"
										control={control}
										render={({ field }) => (
											<FormControl
												fullWidth
												className="w-full"
											>
												<FormLabel htmlFor="electricity_new_index">New Index</FormLabel>
												<TextField
													{...field}
													type="number"
													id="electricity_new_index"
													value={field.value || 0}
													onChange={(e) => field.onChange(Number(e.target.value) || 0)}
													variant="outlined"
													fullWidth
												/>
											</FormControl>
										)}
									/>
								</Grid>
								<Grid size={4}>
									<Controller
										name="electricity.staff"
										control={control}
										render={({ field }) => (
											<FormControl
												fullWidth
												className="w-full"
											>
												<FormLabel htmlFor="electricity_staff">Staff</FormLabel>
												<TextField
													{...field}
													id="electricity_staff"
													placeholder="Staff name"
													variant="outlined"
													fullWidth
												/>
											</FormControl>
										)}
									/>
								</Grid>
								{usedKwh > 0 && (
									<Grid size={12}>
										<Box
											className="rounded-lg border p-3"
											sx={{ backgroundColor: 'background.default' }}
										>
											<Typography
												variant="body2"
												color="text.secondary"
											>
												Used: <strong>{usedKwh} kWh</strong> × 4,000đ ={' '}
												<strong className="text-primary">{electricityPrice.toLocaleString('vi-VN')}đ</strong>
											</Typography>
										</Box>
									</Grid>
								)}
							</Grid>
						</Box>

						<Divider />

						{/* Fees */}
						<Box>
							<Typography
								variant="subtitle1"
								className="mb-3 font-semibold"
							>
								Fees
							</Typography>
							<Grid
								container
								spacing={2}
							>
								<Grid size={4}>
									<Controller
										name="water_fee"
										control={control}
										render={({ field }) => (
											<FormControl
												fullWidth
												className="w-full"
											>
												<FormLabel htmlFor="water_fee">Water Fee</FormLabel>
												<TextField
													{...field}
													type="number"
													id="water_fee"
													value={field.value || 0}
													onChange={(e) => field.onChange(Number(e.target.value) || 0)}
													variant="outlined"
													fullWidth
													slotProps={{
														input: {
															startAdornment: <FuseSvgIcon color="action">lucide:droplet</FuseSvgIcon>
														}
													}}
												/>
											</FormControl>
										)}
									/>
								</Grid>
								<Grid size={4}>
									<Controller
										name="management_fee"
										control={control}
										render={({ field }) => (
											<FormControl
												fullWidth
												className="w-full"
											>
												<FormLabel htmlFor="management_fee">Management Fee</FormLabel>
												<TextField
													{...field}
													type="number"
													id="management_fee"
													value={field.value || 0}
													onChange={(e) => field.onChange(Number(e.target.value) || 0)}
													variant="outlined"
													fullWidth
													slotProps={{
														input: {
															startAdornment: <FuseSvgIcon color="action">lucide:settings</FuseSvgIcon>
														}
													}}
												/>
											</FormControl>
										)}
									/>
								</Grid>
								<Grid size={4}>
									<Controller
										name="old_debt"
										control={control}
										render={({ field }) => (
											<FormControl
												fullWidth
												className="w-full"
											>
												<FormLabel htmlFor="old_debt">Old Debt</FormLabel>
												<TextField
													{...field}
													type="number"
													id="old_debt"
													value={field.value || 0}
													onChange={(e) => field.onChange(Number(e.target.value) || 0)}
													variant="outlined"
													fullWidth
												/>
											</FormControl>
										)}
									/>
								</Grid>
								<Grid size={4}>
									<Controller
										name="deduction"
										control={control}
										render={({ field }) => (
											<FormControl
												fullWidth
												className="w-full"
											>
												<FormLabel htmlFor="deduction">Deduction</FormLabel>
												<TextField
													{...field}
													type="number"
													id="deduction"
													value={field.value || 0}
													onChange={(e) => field.onChange(Number(e.target.value) || 0)}
													variant="outlined"
													fullWidth
												/>
											</FormControl>
										)}
									/>
								</Grid>
							</Grid>
						</Box>

						<Divider />

						{/* Period & Notes */}
						<Box>
							<Typography
								variant="subtitle1"
								className="mb-3 font-semibold"
							>
								Period & Notes
							</Typography>
							<Grid
								container
								spacing={2}
							>
								<Grid size={4}>
									<Controller
										name="month"
										control={control}
										render={({ field }) => (
											<FormControl
												fullWidth
												className="w-full"
											>
												<FormLabel htmlFor="month">Month</FormLabel>
												<TextField
													{...field}
													type="number"
													id="month"
													inputProps={{ min: 1, max: 12 }}
													value={field.value || new Date().getMonth() + 1}
													onChange={(e) => field.onChange(Number(e.target.value) || 1)}
													variant="outlined"
													fullWidth
												/>
											</FormControl>
										)}
									/>
								</Grid>
								<Grid size={4}>
									<Controller
										name="year"
										control={control}
										render={({ field }) => (
											<FormControl
												fullWidth
												className="w-full"
											>
												<FormLabel htmlFor="year">Year</FormLabel>
												<TextField
													{...field}
													type="number"
													id="year"
													value={field.value || new Date().getFullYear()}
													onChange={(e) => field.onChange(Number(e.target.value) || new Date().getFullYear())}
													variant="outlined"
													fullWidth
												/>
											</FormControl>
										)}
									/>
								</Grid>
								<Grid size={12}>
									<Controller
										name="note"
										control={control}
										render={({ field }) => (
											<FormControl
												fullWidth
												className="w-full"
											>
												<FormLabel htmlFor="note">Note</FormLabel>
												<TextField
													{...field}
													id="note"
													multiline
													rows={2}
													placeholder="Additional notes..."
													variant="outlined"
													fullWidth
												/>
											</FormControl>
										)}
									/>
								</Grid>
							</Grid>
						</Box>
					</Box>
				</DialogContent>

				<DialogActions className="border-t px-6 py-4">
					<Button
						onClick={handleClose}
						color="inherit"
						disabled={createInvoice.isPending}
					>
						Cancel
					</Button>
					<Button
						type="submit"
						variant="contained"
						color="secondary"
						disabled={createInvoice.isPending || !isValid}
						startIcon={<FuseSvgIcon>lucide:check</FuseSvgIcon>}
					>
						{createInvoice.isPending ? 'Creating...' : 'Create Invoice'}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
}

export default CreateInvoiceDialog;

