import useParams from '@fuse/hooks/useParams';
import FuseLoading from '@fuse/core/FuseLoading';
import { useInvoice } from '../../api/hooks/useInvoice';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import { format } from 'date-fns/format';
import useNavigate from '@fuse/hooks/useNavigate';

const getStatusLabel = (status: number) => {
	const labels: Record<number, { label: string; color: 'default' | 'primary' | 'success' | 'error' | 'warning' }> = {
		1: { label: 'Pending', color: 'default' },
		2: { label: 'Sent', color: 'success' },
		3: { label: 'Paid', color: 'primary' },
		4: { label: 'Failed', color: 'error' }
	};
	return labels[status] || { label: 'Unknown', color: 'default' };
};

function InvoiceView() {
	const routeParams = useParams<{ invoiceId: string }>();
	const { invoiceId } = routeParams;
	const { data: invoice, isLoading, isError } = useInvoice(invoiceId);
	const navigate = useNavigate();

	if (isLoading) {
		return <FuseLoading className="min-h-screen" />;
	}

	if (isError || !invoice) {
		return (
			<Box className="flex h-full items-center justify-center p-8">
				<Typography
					variant="h6"
					color="error"
				>
					Invoice not found
				</Typography>
			</Box>
		);
	}

	const statusInfo = getStatusLabel(invoice.invoice_status);

	return (
		<Box className="flex flex-auto flex-col overflow-y-auto p-6 sm:p-12">
			{/* Header */}
			<Box className="mb-6">
				<div className="flex items-center justify-between">
					<Box>
						<Typography
							variant="h4"
							className="font-bold"
						>
							Invoice Details
						</Typography>
						<Typography
							variant="body2"
							color="text.secondary"
							className="mt-1"
						>
							ID: {invoice._id}
						</Typography>
					</Box>
					<div className="flex items-center gap-2">
						<Chip
							label={statusInfo.label}
							color={statusInfo.color}
							size="medium"
						/>
						<Button
							variant="contained"
							color="secondary"
							startIcon={<FuseSvgIcon>lucide:file-text</FuseSvgIcon>}
							onClick={() => navigate(`/pages/invoice/compact?id=${invoice._id}`)}
						>
							Xem hoá đơn
						</Button>
					</div>
				</div>
			</Box>

			<Divider className="mb-6" />

			{/* Customer Information */}
			<Box className="mb-6">
				<Typography
					variant="h6"
					className="mb-4 font-semibold"
				>
					Customer Information
				</Typography>
				<Grid
					container
					spacing={3}
				>
					<Grid size={6}>
						<Typography
							variant="body2"
							color="text.secondary"
							className="mb-1"
						>
							Room Code
						</Typography>
						<Typography variant="body1">{invoice.room_code || '-'}</Typography>
					</Grid>
					<Grid size={6}>
						<Typography
							variant="body2"
							color="text.secondary"
							className="mb-1"
						>
							Customer Name
						</Typography>
						<Typography variant="body1">{invoice.customer_name || '-'}</Typography>
					</Grid>
					<Grid size={4}>
						<Typography
							variant="body2"
							color="text.secondary"
							className="mb-1"
						>
							Phone
						</Typography>
						<Typography variant="body1">{invoice.phone || '-'}</Typography>
					</Grid>
					<Grid size={4}>
						<Typography
							variant="body2"
							color="text.secondary"
							className="mb-1"
						>
							Gender
						</Typography>
						<Typography variant="body1">{invoice.gender || '-'}</Typography>
					</Grid>
					<Grid size={4}>
						<Typography
							variant="body2"
							color="text.secondary"
							className="mb-1"
						>
							Birth Date
						</Typography>
						<Typography variant="body1">
							{invoice.birth_date ? format(new Date(invoice.birth_date), 'dd/MM/yyyy') : '-'}
						</Typography>
					</Grid>
				</Grid>
			</Box>

			<Divider className="mb-6" />

			{/* Contract Information */}
			{invoice.contract && (
				<>
					<Box className="mb-6">
						<Typography
							variant="h6"
							className="mb-4 font-semibold"
						>
							Contract Information
						</Typography>
						<Grid
							container
							spacing={3}
						>
							<Grid size={4}>
								<Typography
									variant="body2"
									color="text.secondary"
									className="mb-1"
								>
									Start Date
								</Typography>
								<Typography variant="body1">
									{invoice.contract.start_date
										? format(new Date(invoice.contract.start_date), 'dd/MM/yyyy')
										: '-'}
								</Typography>
							</Grid>
							<Grid size={4}>
								<Typography
									variant="body2"
									color="text.secondary"
									className="mb-1"
								>
									End Date
								</Typography>
								<Typography variant="body1">
									{invoice.contract.end_date
										? format(new Date(invoice.contract.end_date), 'dd/MM/yyyy')
										: '-'}
								</Typography>
							</Grid>
							<Grid size={4}>
								<Typography
									variant="body2"
									color="text.secondary"
									className="mb-1"
								>
									Duration (Months)
								</Typography>
								<Typography variant="body1">{invoice.contract.duration_months || '-'}</Typography>
							</Grid>
						</Grid>
					</Box>
					<Divider className="mb-6" />
				</>
			)}

			{/* Financial Information */}
			<Box className="mb-6">
				<Typography
					variant="h6"
					className="mb-4 font-semibold"
				>
					Financial Information
				</Typography>
				<Grid
					container
					spacing={3}
				>
					<Grid size={4}>
						<Typography
							variant="body2"
							color="text.secondary"
							className="mb-1"
						>
							Deposit Amount
						</Typography>
						<Typography variant="body1">
							{invoice.deposit_amount?.toLocaleString('vi-VN')}đ
						</Typography>
					</Grid>
					<Grid size={4}>
						<Typography
							variant="body2"
							color="text.secondary"
							className="mb-1"
						>
							Room Price
						</Typography>
						<Typography variant="body1">{invoice.room_price?.toLocaleString('vi-VN')}đ</Typography>
					</Grid>
					<Grid size={4}>
						<Typography
							variant="body2"
							color="text.secondary"
							className="mb-1"
						>
							Stay Days
						</Typography>
						<Typography variant="body1">{invoice.stay_days || '-'}</Typography>
					</Grid>
					<Grid size={4}>
						<Typography
							variant="body2"
							color="text.secondary"
							className="mb-1"
						>
							Actual Room Fee
						</Typography>
						<Typography variant="body1">
							{invoice.actual_room_fee?.toLocaleString('vi-VN')}đ
						</Typography>
					</Grid>
				</Grid>
			</Box>

			<Divider className="mb-6" />

			{/* Electricity Information */}
			{invoice.electricity && (
				<>
					<Box className="mb-6">
						<Typography
							variant="h6"
							className="mb-4 font-semibold"
						>
							Electricity Information
						</Typography>
						<Grid
							container
							spacing={3}
						>
							<Grid size={3}>
								<Typography
									variant="body2"
									color="text.secondary"
									className="mb-1"
								>
									Old Index
								</Typography>
								<Typography variant="body1">{invoice.electricity.old_index || 0}</Typography>
							</Grid>
							<Grid size={3}>
								<Typography
									variant="body2"
									color="text.secondary"
									className="mb-1"
								>
									New Index
								</Typography>
								<Typography variant="body1">{invoice.electricity.new_index || 0}</Typography>
							</Grid>
							<Grid size={3}>
								<Typography
									variant="body2"
									color="text.secondary"
									className="mb-1"
								>
									Used (kWh)
								</Typography>
								<Typography variant="body1">{invoice.electricity.used_kwh || 0}</Typography>
							</Grid>
							<Grid size={3}>
								<Typography
									variant="body2"
									color="text.secondary"
									className="mb-1"
								>
									Price
								</Typography>
								<Typography
									variant="body1"
									className="font-semibold text-primary"
								>
									{invoice.electricity.price?.toLocaleString('vi-VN')}đ
								</Typography>
							</Grid>
							<Grid size={12}>
								<Typography
									variant="body2"
									color="text.secondary"
									className="mb-1"
								>
									Staff
								</Typography>
								<Typography variant="body1">{invoice.electricity.staff || '-'}</Typography>
							</Grid>
						</Grid>
					</Box>
					<Divider className="mb-6" />
				</>
			)}

			{/* Fees */}
			<Box className="mb-6">
				<Typography
					variant="h6"
					className="mb-4 font-semibold"
				>
					Fees
				</Typography>
				<Grid
					container
					spacing={3}
				>
					<Grid size={4}>
						<Typography
							variant="body2"
							color="text.secondary"
							className="mb-1"
						>
							Water Fee
						</Typography>
						<Typography variant="body1">{invoice.water_fee?.toLocaleString('vi-VN')}đ</Typography>
					</Grid>
					<Grid size={4}>
						<Typography
							variant="body2"
							color="text.secondary"
							className="mb-1"
						>
							Management Fee
						</Typography>
						<Typography variant="body1">{invoice.management_fee?.toLocaleString('vi-VN')}đ</Typography>
					</Grid>
					<Grid size={4}>
						<Typography
							variant="body2"
							color="text.secondary"
							className="mb-1"
						>
							Old Debt
						</Typography>
						<Typography variant="body1">{invoice.old_debt?.toLocaleString('vi-VN')}đ</Typography>
					</Grid>
					<Grid size={4}>
						<Typography
							variant="body2"
							color="text.secondary"
							className="mb-1"
						>
							Deduction
						</Typography>
						<Typography variant="body1">{invoice.deduction?.toLocaleString('vi-VN')}đ</Typography>
					</Grid>
				</Grid>
			</Box>

			<Divider className="mb-6" />

			{/* Summary */}
			<Box
				className="mb-6 rounded-lg border p-4"
				sx={{ backgroundColor: 'background.default' }}
			>
				<Typography
					variant="h6"
					className="mb-4 font-semibold"
				>
					Summary
				</Typography>
				<Grid
					container
					spacing={3}
				>
					<Grid size={4}>
						<Typography
							variant="body2"
							color="text.secondary"
							className="mb-1"
						>
							Total Amount
						</Typography>
						<Typography
							variant="h5"
							className="font-bold text-primary"
						>
							{invoice.total_amount?.toLocaleString('vi-VN')}đ
						</Typography>
					</Grid>
					<Grid size={4}>
						<Typography
							variant="body2"
							color="text.secondary"
							className="mb-1"
						>
							Amount Paid
						</Typography>
						<Typography variant="h6">{invoice.amount_paid?.toLocaleString('vi-VN')}đ</Typography>
					</Grid>
					<Grid size={4}>
						<Typography
							variant="body2"
							color="text.secondary"
							className="mb-1"
						>
							Remaining Amount
						</Typography>
						<Typography
							variant="h6"
							className="font-semibold"
						>
							{invoice.remaining_amount?.toLocaleString('vi-VN')}đ
						</Typography>
					</Grid>
					<Grid size={6}>
						<Typography
							variant="body2"
							color="text.secondary"
							className="mb-1"
						>
							Period
						</Typography>
						<Typography variant="body1">
							{invoice.month && invoice.year ? `${invoice.month}/${invoice.year}` : '-'}
						</Typography>
					</Grid>
					<Grid size={6}>
						<Typography
							variant="body2"
							color="text.secondary"
							className="mb-1"
						>
							Status Message
						</Typography>
						<Typography variant="body1">{invoice.invoice_message || '-'}</Typography>
					</Grid>
				</Grid>
			</Box>

			{/* Notes */}
			{(invoice.note || invoice.extra_note) && (
				<>
					<Divider className="mb-6" />
					<Box>
						<Typography
							variant="h6"
							className="mb-4 font-semibold"
						>
							Notes
						</Typography>
						{invoice.note && (
							<Box className="mb-3">
								<Typography
									variant="body2"
									color="text.secondary"
									className="mb-1"
								>
									Note
								</Typography>
								<Typography variant="body1">{invoice.note}</Typography>
							</Box>
						)}
						{invoice.extra_note && (
							<Box>
								<Typography
									variant="body2"
									color="text.secondary"
									className="mb-1"
								>
									Extra Note
								</Typography>
								<Typography variant="body1">{invoice.extra_note}</Typography>
							</Box>
						)}
					</Box>
				</>
			)}
		</Box>
	);
}

export default InvoiceView;

