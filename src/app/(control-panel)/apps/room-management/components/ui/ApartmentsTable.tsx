import { useMemo, useState } from 'react';
import { type MRT_ColumnDef } from 'material-react-table';
import DataTable from 'src/components/data-table/DataTable';
import { Paper, IconButton, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import Typography from '@mui/material/Typography';
import FuseLoading from '@fuse/core/FuseLoading';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useSnackbar } from 'notistack';
import { useFuseDialogContext } from '@fuse/core/FuseDialog/contexts/FuseDialogContext/useFuseDialogContext';
import { Apartment } from '../../api/types';
import { useApartments } from '../../api/hooks/useApartments';
import { useDeleteApartment } from '../../api/hooks/useDeleteApartment';
import EditApartmentDialog from '../dialogs/EditApartmentDialog';

function ApartmentsTable() {
	const { data, isLoading } = useApartments();
	const deleteApartment = useDeleteApartment();
	const { enqueueSnackbar } = useSnackbar();
	const { openDialog } = useFuseDialogContext();
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null);

	const handleEdit = (apartment: Apartment) => {
		setSelectedApartment(apartment);
		setEditDialogOpen(true);
	};

	const handleDelete = (apartment: Apartment) => {
		openDialog({
			id: `confirm-delete-apartment-${apartment._id}`,
			content: ({ handleClose }) => (
				<>
					<DialogTitle>Delete Apartment?</DialogTitle>
					<DialogContent>
						<DialogContentText>
							Are you sure you want to delete <strong>{apartment.code}</strong>?
							<br />
							This action cannot be undone.
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button
							onClick={handleClose}
							color="inherit"
						>
							Cancel
						</Button>
						<Button
							onClick={async () => {
								try {
									await deleteApartment.mutateAsync(apartment._id);
									enqueueSnackbar('Apartment deleted successfully!', { variant: 'success' });
									handleClose();
								} catch (error) {
									enqueueSnackbar('API chưa sẵn sàng. Backend chưa implement DELETE /apartments/:id', {
										variant: 'warning'
									});
									console.error('Error deleting apartment:', error);
									handleClose();
								}
							}}
							variant="contained"
							color="error"
							autoFocus
						>
							Delete
						</Button>
					</DialogActions>
				</>
			)
		});
	};

	const columns = useMemo<MRT_ColumnDef<Apartment>[]>(
		() => [
			{
				accessorKey: 'code',
				header: 'Apartment Code',
				size: 200,
				Cell: ({ row }) => (
					<Typography
						variant="body2"
						className="font-semibold"
					>
						{row.original.code}
					</Typography>
				)
			},
			{
				accessorKey: 'createdAt',
				header: 'Created At',
				size: 180,
				Cell: ({ row }) => (
					<Typography variant="body2">
						{new Date(row.original.createdAt).toLocaleString()}
					</Typography>
				)
			},
			{
				accessorKey: 'updatedAt',
				header: 'Updated At',
				size: 180,
				Cell: ({ row }) => (
					<Typography variant="body2">
						{new Date(row.original.updatedAt).toLocaleString()}
					</Typography>
				)
			}
		],
		[]
	);

	if (isLoading) {
		return <FuseLoading />;
	}

	return (
		<>
			<Paper
				className="shadow-1 flex h-full w-full flex-auto flex-col overflow-hidden rounded-t-lg rounded-b-none"
				elevation={0}
			>
			<DataTable
				data={data?.rows || []}
				columns={columns}
				renderRowActions={({ row }) => (
					<div className="flex items-center gap-1">
						<IconButton
							size="small"
							onClick={() => handleEdit(row.original)}
							color="primary"
						>
							<FuseSvgIcon size={20}>lucide:pencil</FuseSvgIcon>
						</IconButton>
						<IconButton
							size="small"
							onClick={() => handleDelete(row.original)}
							color="error"
						>
							<FuseSvgIcon size={20}>lucide:trash-2</FuseSvgIcon>
						</IconButton>
					</div>
				)}
			/>
			</Paper>

			<EditApartmentDialog
				open={editDialogOpen}
				onClose={() => {
					setEditDialogOpen(false);
					setSelectedApartment(null);
				}}
				apartment={selectedApartment}
			/>
		</>
	);
}

export default ApartmentsTable;

