import { useMemo } from 'react';
import { type MRT_ColumnDef } from 'material-react-table';
import DataTable from 'src/components/data-table/DataTable';
import { Paper } from '@mui/material';
import Typography from '@mui/material/Typography';
import FuseLoading from '@fuse/core/FuseLoading';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useTranslation } from 'react-i18next';
import { Room } from '../../api/types';
import { useRooms } from '../../api/hooks/useRooms';
import { useApartments } from '../../api/hooks/useApartments';
import useNavigate from '@fuse/hooks/useNavigate';

type RoomsTableProps = {
	apartmentId?: string;
};

function RoomsTable({ apartmentId }: RoomsTableProps) {
	const { t } = useTranslation('roomManagementApp');
	const { data: roomsData, isLoading: roomsLoading, isError: roomsError, error: roomsErrorObj } = useRooms();
	const { data: apartmentsData, isLoading: apartmentsLoading, isError: apartmentsError, error: apartmentsErrorObj } = useApartments();
	const navigate = useNavigate();

	// Filter rooms by apartmentId if provided
	const filteredRooms = useMemo(() => {
		if (!roomsData?.rows) return [];
		if (!apartmentId) return roomsData.rows;
		return roomsData.rows.filter(room => room.apartment_id === apartmentId);
	}, [roomsData, apartmentId]);

	// Create a lookup map for apartments
	const apartmentsMap = useMemo(() => {
		if (!apartmentsData?.rows) return {};
		return apartmentsData.rows.reduce((acc, apt) => {
			acc[apt._id] = apt.code;
			return acc;
		}, {} as Record<string, string>);
	}, [apartmentsData]);


	const columns = useMemo<MRT_ColumnDef<Room>[]>(
		() => [
			{
				accessorKey: 'code',
				header: t('ROOM_CODE'),
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
				accessorKey: 'apartment_id',
				header: t('APARTMENT'),
				size: 200,
				Cell: ({ row }) => (
					<Typography variant="body2">
						{apartmentsMap[row.original.apartment_id] || row.original.apartment_id}
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
		[apartmentsMap, t]
	);

	if (roomsLoading || apartmentsLoading) {
		return <FuseLoading />;
	}

	// Issue 1: Error state UI
	if (roomsError || apartmentsError) {
		const error = roomsError || apartmentsError;
		const errorObj = roomsErrorObj || apartmentsErrorObj;
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
					{errorObj instanceof Error ? errorObj.message : t('CHECK_CONNECTION')}
				</Typography>
			</Paper>
		);
	}

	// Issue 1: Empty state UI
	if (filteredRooms.length === 0) {
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
					lucide:door-open
				</FuseSvgIcon>
				<Typography
					variant="h6"
					color="text.secondary"
					className="mb-2"
				>
					{t('NO_ROOMS_FOUND')}
				</Typography>
				<Typography
					variant="body2"
					color="text.secondary"
					className="text-center"
				>
					{t('NO_ROOMS_MESSAGE')}
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
				data={filteredRooms}
				columns={columns}
				enableRowActions={false}
				muiTableBodyRowProps={({ row }) => ({
					onClick: () => navigate(`/apps/room-management/room/${row.original._id}`),
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

export default RoomsTable;

