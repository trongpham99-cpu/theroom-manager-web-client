import { useMemo, useState, useEffect } from 'react';
import { type MRT_ColumnDef } from 'material-react-table';
import DataTable from 'src/components/data-table/DataTable';
import { Paper, IconButton, Chip, Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import FuseLoading from '@fuse/core/FuseLoading';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Customer } from '../../api/types';
import { useCustomers } from '../../api/hooks/useCustomers';
import { useDeleteCustomer } from '../../api/hooks/useDeleteCustomer';
import { useFuseDialogContext } from '@fuse/core/FuseDialog/contexts/FuseDialogContext/useFuseDialogContext';
import { DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { useSnackbar } from 'notistack';
import useNavigate from '@fuse/hooks/useNavigate';
import { useSearch } from '../../hooks/useSearch';
import { useTranslation } from 'react-i18next';

type CustomersTableProps = {
	onSelectionChange?: (selectedIds: string[]) => void;
	apartmentId?: string;
};

function CustomersTable({ onSelectionChange, apartmentId }: CustomersTableProps) {
	const { t } = useTranslation('customersApp');
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(15);
	const [sortBy, setSortBy] = useState('createdAt');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
	const { searchText } = useSearch();
	const [debouncedSearch, setDebouncedSearch] = useState(searchText);
	const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

	// Debounce search
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearch(searchText);
			setPage(1); // Reset to page 1 when search changes
		}, 300);
		return () => clearTimeout(timer);
	}, [searchText]);

	// Reset page when apartment changes
	useEffect(() => {
		setPage(1);
		setRowSelection({});
	}, [apartmentId]);

	const { data, isLoading, isError, error } = useCustomers({
		page,
		limit,
		sortBy,
		sortOrder,
		search: debouncedSearch || undefined,
		apartment_id: apartmentId
	});

	const deleteCustomer = useDeleteCustomer();
	const { openDialog } = useFuseDialogContext();
	const { enqueueSnackbar } = useSnackbar();
	const navigate = useNavigate();

	useEffect(() => {
		if (onSelectionChange && data?.rows) {
			const selectedIds = Object.keys(rowSelection)
				.filter((key) => rowSelection[key])
				.map((key) => {
					const index = parseInt(key, 10);
					return data.rows[index]?._id;
				})
				.filter(Boolean) as string[];
			onSelectionChange(selectedIds);
		}
	}, [rowSelection, data, onSelectionChange]);

	const handleDelete = (customer: Customer) => {
		openDialog({
			id: `delete-customer-${customer._id}`,
			content: ({ handleClose }) => (
				<>
					<DialogTitle>{t('DELETE_TITLE')}</DialogTitle>
					<DialogContent>
						<DialogContentText>
							{t('DELETE_MESSAGE')} <strong>{customer.name}</strong>?
							<br />
							{t('DELETE_WARNING')}
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button
							onClick={handleClose}
							color="inherit"
						>
							{t('CANCEL')}
						</Button>
						<Button
							onClick={async () => {
								try {
									await deleteCustomer.mutateAsync(customer._id);
									handleClose();
								} catch (error: any) {
									console.error('Error deleting customer:', error);
									handleClose();
								}
							}}
							variant="contained"
							color="error"
							autoFocus
							disabled={deleteCustomer.isPending}
						>
							{deleteCustomer.isPending ? t('DELETING') : t('DELETE')}
						</Button>
					</DialogActions>
				</>
			)
		});
	};

	const columns = useMemo<MRT_ColumnDef<Customer>[]>(
		() => [
			{
				accessorKey: 'name',
				header: t('NAME'),
				size: 200,
				Cell: ({ row }) => (
					<Typography
						variant="body2"
						className="font-semibold"
					>
						{row.original.name}
					</Typography>
				)
			},
			{
				accessorKey: 'phone',
				header: t('PHONE'),
				size: 130,
				Cell: ({ row }) => (
					<Typography variant="body2">
						{row.original.phone || '-'}
					</Typography>
				)
			},
			{
				id: 'room',
				header: t('ROOM'),
				size: 150,
				Cell: ({ row }) => {
					const room = row.original.room_id;
					return room ? (
						<Chip
							label={room.code}
							size="small"
							color="primary"
						/>
					) : (
						<Chip
							label={t('NO_ROOM')}
							size="small"
							color="default"
							variant="outlined"
						/>
					);
				}
			},
			{
				id: 'apartment',
				header: t('APARTMENT'),
				size: 150,
				Cell: ({ row }) => {
					const apartment = row.original.apartment_id;
					return (
						<Typography variant="body2">
							{apartment?.code || '-'}
						</Typography>
					);
				}
			},
			{
				accessorKey: 'createdAt',
				header: t('CREATED_AT'),
				size: 180,
				Cell: ({ row }) => (
					<Typography variant="body2">
						{new Date(row.original.createdAt).toLocaleString('vi-VN')}
					</Typography>
				)
			}
		],
		[t]
	);

	if (isLoading) {
		return <FuseLoading />;
	}

	if (isError) {
		return (
			<Paper
				className="shadow-1 flex h-full w-full flex-auto flex-col items-center justify-center overflow-hidden rounded-t-lg rounded-b-none p-8"
				elevation={0}
			>
				<FuseSvgIcon
					size={64}
					color="error"
					className="mb-4"
				>
					lucide:alert-circle
				</FuseSvgIcon>
				<Typography
					variant="h6"
					color="error"
					className="mb-2"
				>
					{t('FAILED_TO_LOAD')}
				</Typography>
				<Typography
					variant="body2"
					color="text.secondary"
					className="text-center"
				>
					{error instanceof Error ? error.message : t('CHECK_CONNECTION')}
				</Typography>
			</Paper>
		);
	}

	if (!data?.rows || data.rows.length === 0) {
		return (
			<Paper
				className="shadow-1 flex h-full w-full flex-auto flex-col items-center justify-center overflow-hidden rounded-t-lg rounded-b-none p-8"
				elevation={0}
			>
				<FuseSvgIcon
					size={64}
					color="disabled"
					className="mb-4"
				>
					lucide:users
				</FuseSvgIcon>
				<Typography
					variant="h6"
					color="text.secondary"
					className="mb-2"
				>
					{t('NO_CUSTOMERS_FOUND')}
				</Typography>
				<Typography
					variant="body2"
					color="text.secondary"
					className="text-center"
				>
					{t('NO_CUSTOMERS_MESSAGE')}
				</Typography>
			</Paper>
		);
	}

	return (
		<Paper
			className="shadow-1 flex h-full w-full flex-auto flex-col overflow-hidden rounded-t-lg rounded-b-none"
			elevation={0}
		>
			<DataTable
				data={data.rows}
				columns={columns}
				enableRowSelection
				enableGlobalFilter
				enableColumnFilters={false}
				initialState={{
					pagination: {
						pageIndex: page - 1,
						pageSize: limit
					},
					sorting: [
						{
							id: sortBy,
							desc: sortOrder === 'desc'
						}
					]
				}}
				onPaginationChange={(updater) => {
					const newPagination = typeof updater === 'function' ? updater({ pageIndex: page - 1, pageSize: limit }) : updater;
					setPage((newPagination.pageIndex || 0) + 1);
					setLimit(newPagination.pageSize || 15);
				}}
				onSortingChange={(updater) => {
					const newSorting = typeof updater === 'function' ? updater([{ id: sortBy, desc: sortOrder === 'desc' }]) : updater;
					if (newSorting && newSorting.length > 0) {
						setSortBy(newSorting[0].id);
						setSortOrder(newSorting[0].desc ? 'desc' : 'asc');
					}
				}}
				onGlobalFilterChange={() => {}}
				onRowSelectionChange={setRowSelection}
				state={{
					globalFilter: searchText,
					rowSelection
				}}
				manualPagination
				manualSorting
				rowCount={data.total}
				muiTableBodyRowProps={({ row }) => ({
					onClick: () => navigate(`/apps/customers/${row.original._id}`),
					sx: {
						cursor: 'pointer',
						'&:hover': {
							backgroundColor: 'action.hover'
						}
					}
				})}
				renderRowActions={({ row }) => (
					<Box
						className="flex items-center gap-1"
						onClick={(e) => e.stopPropagation()}
					>
						<IconButton
							size="small"
							onClick={() => navigate(`/apps/customers/${row.original._id}/edit`)}
							color="primary"
							title="Edit Customer"
						>
							<FuseSvgIcon size={20}>lucide:pencil</FuseSvgIcon>
						</IconButton>
						<IconButton
							size="small"
							onClick={() => handleDelete(row.original)}
							color="error"
							title="Delete Customer"
						>
							<FuseSvgIcon size={20}>lucide:trash-2</FuseSvgIcon>
						</IconButton>
					</Box>
				)}
			/>
		</Paper>
	);
}

export default CustomersTable;

