import { useMemo } from 'react';
import { type MRT_ColumnDef } from 'material-react-table';
import { Chip, Avatar, Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { UserType } from '../UsersApi';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

/**
 * Hook to get user table columns
 */
export const useUsersColumns = () => {
	const { t } = useTranslation('usersApp');

	const columns = useMemo<MRT_ColumnDef<UserType>[]>(
		() => [
			{
				accessorKey: 'photoURL',
				header: t('COLUMNS.AVATAR'),
				size: 80,
				enableSorting: false,
				Cell: ({ row }) => (
					<Avatar
						src={row.original.photoURL}
						alt={row.original.name}
						sx={{ width: 40, height: 40 }}
					/>
				)
			},
			{
				accessorKey: 'name',
				header: t('COLUMNS.NAME'),
				size: 200,
				Cell: ({ row }) => (
					<Box>
						<Typography variant="body2">{row.original.name}</Typography>
						<Typography
							variant="caption"
							color="text.secondary"
						>
							{row.original.email}
						</Typography>
					</Box>
				)
			},
			{
				accessorKey: 'email',
				header: t('COLUMNS.EMAIL'),
				size: 250
			},
			{
				accessorKey: 'role',
				header: t('COLUMNS.ROLE'),
				size: 120,
				Cell: ({ row }) => (
					<Chip
						label={t(`ROLES.${row.original.role.toUpperCase()}`)}
						size="small"
						color={row.original.role === 'admin' ? 'primary' : 'default'}
						variant="outlined"
					/>
				)
			},
			{
				accessorKey: 'isEmailVerified',
				header: t('COLUMNS.EMAIL_VERIFIED'),
				size: 120,
				Cell: ({ row }) => (
					<Chip
						icon={
							<FuseSvgIcon
								size={16}
								className="mr-0"
							>
								{row.original.isEmailVerified ? 'lucide:check-circle' : 'lucide:x-circle'}
							</FuseSvgIcon>
						}
						label={row.original.isEmailVerified ? t('COLUMNS.VERIFIED') : t('COLUMNS.NOT_VERIFIED')}
						size="small"
						color={row.original.isEmailVerified ? 'success' : 'warning'}
						variant="outlined"
					/>
				)
			},
			{
				accessorKey: 'id',
				header: t('COLUMNS.ID'),
				size: 200,
				Cell: ({ row }) => (
					<Typography
						variant="caption"
						sx={{
							fontFamily: 'monospace',
							color: 'text.secondary'
						}}
					>
						{row.original.id}
					</Typography>
				)
			}
		],
		[t]
	);

	return columns;
};
