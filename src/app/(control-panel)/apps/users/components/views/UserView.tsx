'use client';

import { useState } from 'react';
import Button from '@mui/material/Button';
import useParams from '@fuse/hooks/useParams';
import FuseLoading from '@fuse/core/FuseLoading';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Box from '@mui/system/Box';
import useNavigate from '@fuse/hooks/useNavigate';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { getUserById } from '../../UsersApi';
import UserForm from '../forms/UserForm';
import EditUserDialog from '../dialogs/EditUserDialog';
import DeleteUserDialog from '../dialogs/DeleteUserDialog';

/**
 * The User Detail View.
 */
function UserView() {
	const { t } = useTranslation('usersApp');
	const routeParams = useParams<{ userId: string }>();
	const isNew = routeParams.userId === 'new';
	const { userId } = routeParams;
	const { data, isLoading, isError } = useQuery({
		queryKey: ['user', userId],
		queryFn: () => getUserById(userId as string),
		enabled: !!userId && !isNew
	});
	const navigate = useNavigate();
	const { enqueueSnackbar } = useSnackbar();

	const [openEditDialog, setOpenEditDialog] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

	if (isNew) {
		return <UserForm />;
	}

	if (isLoading) {
		return <FuseLoading className="min-h-screen" />;
	}

	if (isError) {
		setTimeout(() => {
			navigate('/apps/users');
			enqueueSnackbar(t('MESSAGES.NOT_FOUND'), {
				variant: 'error'
			});
		}, 0);

		return null;
	}

	const user = data?.data;

	if (!user) {
		return null;
	}

	return (
		<>
			<div className="relative flex flex-auto flex-col items-center overflow-y-auto px-6 pb-12 pt-6 sm:px-12">
				<Box
					className="relative min-h-40 w-full sm:min-h-48"
					sx={{
						backgroundColor: 'background.default'
					}}
				>
					{user.photoURL && (
						<img
							className="absolute inset-0 h-full w-full object-cover"
							src={user.photoURL}
							alt="user background"
						/>
					)}
				</Box>

				<div className="relative w-full">
					<div className="-mt-16 flex flex-auto items-end">
						<Avatar
							sx={{
								borderWidth: 4,
								borderStyle: 'solid',
								borderColor: 'background.paper',
								backgroundColor: 'background.default',
								color: 'text.secondary'
							}}
							className="text-4xl h-32 w-32 font-bold"
							src={user.photoURL}
							alt={user.name}
						>
							{user?.name?.charAt(0)}
						</Avatar>
						<div className="mb-1 ml-auto flex items-center gap-2">
							<Button
								variant="outlined"
								color="error"
								onClick={() => setOpenDeleteDialog(true)}
								startIcon={<FuseSvgIcon size={20}>lucide:trash-2</FuseSvgIcon>}
							>
								{t('VIEW.DELETE')}
							</Button>
							<Button
								variant="contained"
								color="secondary"
								onClick={() => setOpenEditDialog(true)}
								startIcon={<FuseSvgIcon size={20}>lucide:square-pen</FuseSvgIcon>}
							>
								{t('VIEW.EDIT')}
							</Button>
						</div>
					</div>
				</div>

				<div className="w-full">
					<Typography className="mt-3 truncate text-4xl font-bold leading-none">{user.name}</Typography>

					<div className="mt-2 flex flex-wrap items-center">
						{user.role && (
							<Chip
								label={user.role}
								className="mr-3 mb-3"
								size="small"
								color={user.role === 'admin' ? 'primary' : 'default'}
							/>
						)}
						{typeof user.isEmailVerified !== 'undefined' && (
							<Chip
								icon={
									<FuseSvgIcon
										size={16}
										className="mr-0"
									>
										{user.isEmailVerified ? 'lucide:check-circle' : 'lucide:x-circle'}
									</FuseSvgIcon>
								}
								label={user.isEmailVerified ? t('VIEW.EMAIL_VERIFIED') : t('VIEW.EMAIL_NOT_VERIFIED')}
								className="mr-3 mb-3"
								size="small"
								color={user.isEmailVerified ? 'success' : 'warning'}
								variant="outlined"
							/>
						)}
					</div>

					<Divider className="mt-4 mb-6" />

					<div className="flex flex-col gap-8">
						{user.role && (
							<div className="flex items-center">
								<FuseSvgIcon>lucide:shield</FuseSvgIcon>
								<div className="ml-6 leading-6">{user.role}</div>
							</div>
						)}

						{user.email && (
							<div className="flex">
								<FuseSvgIcon>lucide:mail</FuseSvgIcon>
								<div className="ml-6 flex min-w-0 flex-col gap-1">
									<div className="flex items-center leading-6">
										<a
											className="text-primary-500 hover:underline"
											href={`mailto:${user.email}`}
											target="_blank"
											rel="noreferrer"
										>
											{user.email}
										</a>
									</div>
								</div>
							</div>
						)}

						{user.id && (
							<div className="flex items-center">
								<FuseSvgIcon>lucide:fingerprint</FuseSvgIcon>
								<div className="ml-6 font-mono text-sm leading-6">{user.id}</div>
							</div>
						)}

						{user.settings && Object.keys(user.settings).length > 0 && (
							<div className="flex">
								<FuseSvgIcon>lucide:align-left</FuseSvgIcon>
								<div className="ml-6 flex-1">
									<Typography
										variant="subtitle2"
										className="mb-2 font-medium"
									>
										{t('VIEW.USER_SETTINGS')}
									</Typography>
									<pre className="overflow-auto rounded bg-gray-100 p-4 text-xs dark:bg-gray-800">
										{JSON.stringify(user.settings, null, 2)}
									</pre>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			<EditUserDialog
				open={openEditDialog}
				onClose={() => setOpenEditDialog(false)}
				user={user}
			/>

			<DeleteUserDialog
				open={openDeleteDialog}
				onClose={() => setOpenDeleteDialog(false)}
				onSuccess={() => navigate('/apps/users')}
				user={user}
			/>
		</>
	);
}

export default UserView;
