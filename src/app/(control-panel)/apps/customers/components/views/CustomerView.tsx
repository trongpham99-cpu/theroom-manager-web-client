import useParams from '@fuse/hooks/useParams';
import FuseLoading from '@fuse/core/FuseLoading';
import { useCustomer } from '../../api/hooks/useCustomer';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import { format } from 'date-fns/format';
import { useState } from 'react';
import EditCustomerDialog from '../dialogs/EditCustomerDialog';
import AssignRoomDialog from '../dialogs/AssignRoomDialog';
import useNavigate from '@fuse/hooks/useNavigate';

function CustomerView() {
	const routeParams = useParams<{ customerId: string }>();
	const { customerId } = routeParams;
	const { data: customer, isLoading, isError } = useCustomer(customerId);
	const navigate = useNavigate();

	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [assignRoomDialogOpen, setAssignRoomDialogOpen] = useState(false);

	if (isLoading) {
		return <FuseLoading className="min-h-screen" />;
	}

	if (isError || !customer) {
		return (
			<Box className="flex h-full items-center justify-center p-8">
				<Typography
					variant="h6"
					color="error"
				>
					Customer not found
				</Typography>
			</Box>
		);
	}

	const hasRoom = !!customer.room_id;

	return (
		<>
			<Box className="flex flex-auto flex-col overflow-y-auto">
				{/* Header */}
				<Box className="border-b px-6 py-4">
					<div className="flex items-center justify-between">
						<Box>
							<Typography
								variant="h5"
								className="font-bold"
							>
								{customer.name}
							</Typography>
							<Typography
								variant="body2"
								color="text.secondary"
								className="mt-1 font-mono text-xs"
							>
								UUID: {customer.uuid}
							</Typography>
						</Box>
						<div className="flex items-center gap-2">
							<Button
								variant="outlined"
								color={hasRoom ? 'primary' : 'secondary'}
								onClick={() => setAssignRoomDialogOpen(true)}
								startIcon={<FuseSvgIcon>{hasRoom ? 'lucide:move' : 'lucide:door-open'}</FuseSvgIcon>}
							>
								{hasRoom ? 'Change Room' : 'Assign Room'}
							</Button>
							<Button
								variant="contained"
								color="secondary"
								onClick={() => setEditDialogOpen(true)}
								startIcon={<FuseSvgIcon>lucide:pencil</FuseSvgIcon>}
							>
								Edit
							</Button>
						</div>
					</div>
				</Box>

				{/* Content */}
				<Box className="flex flex-auto flex-col p-6 sm:p-12">
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
									Name
								</Typography>
								<Typography variant="body1">{customer.name}</Typography>
							</Grid>
							<Grid size={6}>
								<Typography
									variant="body2"
									color="text.secondary"
									className="mb-1"
								>
									Phone
								</Typography>
								<Typography variant="body1">{customer.phone || '-'}</Typography>
							</Grid>
							<Grid size={6}>
								<Typography
									variant="body2"
									color="text.secondary"
									className="mb-1"
								>
									Date of Birth
								</Typography>
								<Typography variant="body1">
									{customer.dob ? format(new Date(customer.dob), 'dd/MM/yyyy') : '-'}
								</Typography>
							</Grid>
							<Grid size={6}>
								<Typography
									variant="body2"
									color="text.secondary"
									className="mb-1"
								>
									UUID
								</Typography>
								<Typography
									variant="body1"
									className="font-mono text-xs"
								>
									{customer.uuid}
								</Typography>
							</Grid>
						</Grid>
					</Box>

					<Divider className="mb-6" />

					{/* Room Information */}
					<Box className="mb-6">
						<Typography
							variant="h6"
							className="mb-4 font-semibold"
						>
							Room Information
						</Typography>
						{hasRoom ? (
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
										Room
									</Typography>
									<Chip
										label={customer.room_id?.code || '-'}
										color="primary"
										size="small"
									/>
								</Grid>
								<Grid size={6}>
									<Typography
										variant="body2"
										color="text.secondary"
										className="mb-1"
									>
										Apartment
									</Typography>
									<Chip
										label={customer.apartment_id?.code || '-'}
										color="default"
										size="small"
										variant="outlined"
									/>
								</Grid>
							</Grid>
						) : (
							<Box
								className="rounded-lg border p-4"
								sx={{ backgroundColor: 'background.default' }}
							>
								<Typography
									variant="body2"
									color="text.secondary"
									className="mb-2"
								>
									This customer does not have a room assigned yet.
								</Typography>
								<Button
									variant="outlined"
									color="primary"
									size="small"
									onClick={() => setAssignRoomDialogOpen(true)}
									startIcon={<FuseSvgIcon>lucide:door-open</FuseSvgIcon>}
								>
									Assign Room
								</Button>
							</Box>
						)}
					</Box>

					<Divider className="mb-6" />

					{/* Metadata */}
					<Box>
						<Typography
							variant="h6"
							className="mb-4 font-semibold"
						>
							Metadata
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
									Created At
								</Typography>
								<Typography variant="body1">
									{new Date(customer.createdAt).toLocaleString('vi-VN')}
								</Typography>
							</Grid>
							<Grid size={6}>
								<Typography
									variant="body2"
									color="text.secondary"
									className="mb-1"
								>
									Updated At
								</Typography>
								<Typography variant="body1">
									{new Date(customer.updatedAt).toLocaleString('vi-VN')}
								</Typography>
							</Grid>
						</Grid>
					</Box>
				</Box>
			</Box>

			<EditCustomerDialog
				open={editDialogOpen}
				onClose={() => setEditDialogOpen(false)}
				customer={customer}
			/>

			<AssignRoomDialog
				open={assignRoomDialogOpen}
				onClose={() => setAssignRoomDialogOpen(false)}
				customer={customer}
			/>
		</>
	);
}

export default CustomerView;

