import { useState } from 'react';
import { useNavigate } from 'react-router';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { styled } from '@mui/material/styles';
import { Button, Paper } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { MaterialReactTable, useMaterialReactTable, type MRT_PaginationState } from 'material-react-table';
import { useGetUsers } from '../../hooks/useGetUsers';
import { useDeleteUser } from '../../hooks/useDeleteUser';
import { useUsersColumns } from '../../hooks/useUsersColumns';
import FuseLoading from '@fuse/core/FuseLoading';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper,
		borderBottomWidth: 1,
		borderStyle: 'solid',
		borderColor: theme.palette.divider
	},
	'& .FusePageSimple-toolbar': {},
	'& .FusePageSimple-content': {},
	'& .FusePageSimple-sidebarHeader': {},
	'& .FusePageSimple-sidebarContent': {}
}));

type UsersAppViewProps = {
	children?: React.ReactNode;
};

/**
 * The Users App View.
 */
function UsersAppView(props: UsersAppViewProps) {
	const { children } = props;
	const navigate = useNavigate();
	const [pagination, setPagination] = useState<MRT_PaginationState>({
		pageIndex: 0,
		pageSize: 10
	});

	const { data, isLoading, isError } = useGetUsers(pagination.pageIndex + 1, pagination.pageSize);
	const deleteUserMutation = useDeleteUser();
	const columns = useUsersColumns();

	const table = useMaterialReactTable({
		columns,
		data: data?.data || [],
		enableRowSelection: true,
		enableColumnOrdering: true,
		enableGlobalFilter: true,
		enablePagination: true,
		manualPagination: true,
		rowCount: data?.meta?.pagination?.totalResults || 0,
		state: {
			pagination,
			isLoading,
			showAlertBanner: isError,
			showProgressBars: isLoading
		},
		onPaginationChange: setPagination,
		enableRowActions: true,
		positionActionsColumn: 'last',
		renderRowActions: ({ row }) => (
			<div className="flex gap-8">
				<Button
					size="small"
					variant="text"
					color="primary"
					startIcon={<FuseSvgIcon size={16}>lucide:eye</FuseSvgIcon>}
					onClick={() => navigate(`/apps/users/${row.original.id}`)}
				>
					View
				</Button>
				<Button
					size="small"
					variant="text"
					color="secondary"
					startIcon={<FuseSvgIcon size={16}>lucide:edit</FuseSvgIcon>}
					onClick={() => navigate(`/apps/users/${row.original.id}/edit`)}
				>
					Edit
				</Button>
				<Button
					size="small"
					variant="text"
					color="error"
					startIcon={<FuseSvgIcon size={16}>lucide:trash-2</FuseSvgIcon>}
					onClick={() => {
						if (window.confirm(`Are you sure you want to delete ${row.original.name}?`)) {
							deleteUserMutation.mutate(row.original.id);
						}
					}}
					disabled={deleteUserMutation.isPending}
				>
					Delete
				</Button>
			</div>
		),
		renderTopToolbarCustomActions: () => (
			<Button
				variant="contained"
				color="secondary"
				startIcon={<FuseSvgIcon>lucide:plus</FuseSvgIcon>}
				onClick={() => navigate('/apps/users/new/edit')}
			>
				Add User
			</Button>
		)
	});

	if (isLoading && !data) {
		return <FuseLoading />;
	}

	return (
		<Root
			header={
				<div className="flex w-full flex-1 flex-col items-center justify-between space-y-8 p-24 sm:flex-row sm:space-y-0 sm:p-32">
					<div className="flex flex-col items-start space-y-8 sm:space-y-0">
						<div className="flex items-center">
							<FuseSvgIcon
								size={32}
								color="action"
								className="mr-12"
							>
								lucide:users
							</FuseSvgIcon>
							<h1 className="text-3xl leading-none font-extrabold tracking-tight">User Management</h1>
						</div>
						<div className="text-md text-secondary">Manage system users, roles and permissions</div>
					</div>
				</div>
			}
			content={
				<div className="mx-auto flex w-full flex-1 flex-col p-24 sm:p-32">
					<Paper className="flex w-full flex-1 flex-col overflow-hidden rounded-2xl shadow">
						<MaterialReactTable table={table} />
					</Paper>
					{children}
				</div>
			}
		/>
	);
}

export default UsersAppView;
