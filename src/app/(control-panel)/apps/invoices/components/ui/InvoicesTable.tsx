import { useMemo, useState, useEffect } from 'react';
import { type MRT_ColumnDef } from 'material-react-table';
import DataTable from 'src/components/data-table/DataTable';
import { Paper, IconButton, Chip, Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import FuseLoading from '@fuse/core/FuseLoading';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Invoice } from '../../api/types';
import { useInvoices } from '../../api/hooks/useInvoices';
import { useSendInvoice } from '../../api/hooks/useSendInvoice';
import { useFuseDialogContext } from '@fuse/core/FuseDialog/contexts/FuseDialogContext/useFuseDialogContext';
import { DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { useSnackbar } from 'notistack';
import useNavigate from '@fuse/hooks/useNavigate';
import { useTranslation } from 'react-i18next';

const getStatusConfig = (status: number) => {
	const configs: Record<number, { key: string; color: 'default' | 'primary' | 'success' | 'error' | 'warning' | 'info' | 'secondary'; sx?: object }> = {
		1: { key: 'STATUS_PENDING', color: 'default' },
		2: { key: 'STATUS_SENT', color: 'secondary' },
		3: { key: 'STATUS_PAID', color: 'success' },
		4: {
			key: 'STATUS_FAILED',
			color: 'error',
			sx: {
				backgroundColor: '#d32f2f',
				color: '#fff',
				fontWeight: 600,
				'&:hover': {
					backgroundColor: '#b71c1c'
				}
			}
		}
	};
	return configs[status] || { key: 'STATUS_UNKNOWN', color: 'default' };
};

type InvoicesTableProps = {
	onSelectionChange?: (selectedIds: string[]) => void;
	month?: number;
	year?: number;
	excludeRecent?: boolean;
};

function InvoicesTable({ onSelectionChange, month, year, excludeRecent }: InvoicesTableProps) {
	const { t } = useTranslation('invoicesApp');
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(15);
	const [sortBy, setSortBy] = useState('createdAt');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
	const [search, setSearch] = useState('');
	const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

	// Reset page to 1 when period changes (independent state for each tab)
	useEffect(() => {
		setPage(1);
		setRowSelection({});
	}, [month, year, excludeRecent]);

	const { data, isLoading, isError, error } = useInvoices({
		page,
		limit,
		sortBy,
		sortOrder,
		search: search || undefined,
		month,
		year,
		excludeRecent
	});

	const sendInvoice = useSendInvoice();
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

	const handleSend = (invoice: Invoice) => {
		openDialog({
			id: `send-invoice-${invoice._id}`,
			content: ({ handleClose }) => (
				<>
					<DialogTitle>{t('SEND_INVOICE_TITLE')}</DialogTitle>
					<DialogContent>
						<DialogContentText>
							{t('SEND_INVOICE_MESSAGE')} <strong>{invoice.customer_name}</strong> ({invoice.room_code})?
							<br />
							{t('SEND_VIA_ZALO')}
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
									await sendInvoice.mutateAsync(invoice._id);
									handleClose();
								} catch (error: any) {
									console.error('Error sending invoice:', error);
									handleClose();
								}
							}}
							variant="contained"
							color="primary"
							autoFocus
							disabled={sendInvoice.isPending}
						>
							{sendInvoice.isPending ? t('SENDING') : t('SEND')}
						</Button>
					</DialogActions>
				</>
			)
		});
	};

	const columns = useMemo<MRT_ColumnDef<Invoice>[]>(
		() => [
			{
				accessorKey: 'room_code',
				header: t('ROOM_CODE'),
				size: 120,
				Cell: ({ row }) => (
					<Typography
						variant="body2"
						className="font-semibold"
					>
						{row.original.room_code || '-'}
					</Typography>
				)
			},
			{
				accessorKey: 'customer_name',
				header: t('CUSTOMER'),
				size: 200,
				Cell: ({ row }) => (
					<Typography variant="body2">
						{row.original.customer_name || '-'}
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
				accessorKey: 'total_amount',
				header: t('TOTAL_AMOUNT'),
				size: 150,
				Cell: ({ row }) => (
					<Typography
						variant="body2"
						className="font-semibold"
						color="primary"
					>
						{row.original.total_amount?.toLocaleString('vi-VN')}đ
					</Typography>
				)
			},
			{
				accessorKey: 'invoice_status',
				header: t('STATUS'),
				size: 120,
				Cell: ({ row }) => {
					const statusConfig = getStatusConfig(row.original.invoice_status);
					return (
						<Chip
							label={t(statusConfig.key)}
							color={statusConfig.color}
							size="small"
							sx={statusConfig.sx}
						/>
					);
				}
			},
			{
				id: 'period',
				header: t('PERIOD'),
				size: 100,
				Cell: ({ row }) => (
					<Typography variant="body2">
						{row.original.month && row.original.year
							? `${row.original.month}/${row.original.year}`
							: '-'}
					</Typography>
				)
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
					lucide:file-text
				</FuseSvgIcon>
				<Typography
					variant="h6"
					color="text.secondary"
					className="mb-2"
				>
					{t('NO_INVOICES')}
				</Typography>
				<Typography
					variant="body2"
					color="text.secondary"
					className="text-center"
				>
					{t('NO_INVOICES_DESC')}
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
				onGlobalFilterChange={setSearch}
				onRowSelectionChange={setRowSelection}
				state={{
					globalFilter: search,
					rowSelection
				}}
				manualPagination
				manualSorting
				rowCount={data.total}
				muiTableBodyRowProps={({ row }) => ({
					onClick: () => navigate(`/apps/invoices/${row.original._id}`),
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
							onClick={() => handleSend(row.original)}
							color="primary"
							disabled={sendInvoice.isPending || row.original.invoice_status === 2 || row.original.invoice_status === 3}
							title="Send Invoice"
						>
							<FuseSvgIcon size={20}>lucide:send</FuseSvgIcon>
						</IconButton>
					</Box>
				)}
			/>
		</Paper>
	);
}

export default InvoicesTable;

