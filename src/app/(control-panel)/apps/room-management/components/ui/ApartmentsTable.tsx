import { useMemo } from 'react';
import { type MRT_ColumnDef } from 'material-react-table';
import DataTable from 'src/components/data-table/DataTable';
import { Paper, IconButton, Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import FuseLoading from '@fuse/core/FuseLoading';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useTranslation } from 'react-i18next';
import { Apartment } from '../../api/types';
import { useApartments } from '../../api/hooks/useApartments';
import useNavigate from '@fuse/hooks/useNavigate';

function ApartmentsTable() {
	const { t } = useTranslation('roomManagementApp');
	const { data, isLoading, isError, error } = useApartments();
	const navigate = useNavigate();


	const columns = useMemo<MRT_ColumnDef<Apartment>[]>(
		() => [
			{
				accessorKey: 'name',
				header: 'Tên toà nhà',
				size: 250,
				Cell: ({ row }) => (
					<Typography
						variant="body2"
						className="font-semibold"
					>
						{row.original.name || 'Toà nhà chưa có tên'}
					</Typography>
				)
			},
			{
				accessorKey: 'code',
				header: t('APARTMENT_CODE'),
				size: 200,
				Cell: ({ row }) => (
					<Typography
						variant="body2"
					>
						{row.original.code}
					</Typography>
				)
			},
			{
				accessorKey: 'createdAt',
				header: t('CREATED_AT'),
				size: 180,
				Cell: ({ row }) => (
					<Typography variant="body2">
						{new Date(row.original.createdAt).toLocaleString()}
					</Typography>
				)
			}
		],
		[t]
	);

	if (isLoading) {
		return <FuseLoading />;
	}

	// Issue 1: Error state UI
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

	// Issue 1: Empty state UI
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
					lucide:building-2
				</FuseSvgIcon>
				<Typography
					variant="h6"
					color="text.secondary"
					className="mb-2"
				>
					{t('NO_APARTMENTS_FOUND')}
				</Typography>
				<Typography
					variant="body2"
					color="text.secondary"
					className="text-center"
				>
					{t('NO_APARTMENTS_MESSAGE')}
				</Typography>
			</Paper>
		);
	}

	return (
		<>
			<Paper
				className="shadow-1 flex h-full w-full flex-auto flex-col overflow-hidden rounded-t-lg rounded-b-none"
				elevation={0}
			>
			<DataTable
				data={data.rows}
				columns={columns}
				enableRowActions={false}
				muiTableBodyRowProps={({ row }) => ({
					onClick: () => navigate(`/apps/room-management/apartment/${row.original._id}`),
					sx: {
						cursor: 'pointer',
						'&:hover': {
							backgroundColor: 'action.hover'
						}
					}
				})}
			/>
			</Paper>
		</>
	);
}

export default ApartmentsTable;

