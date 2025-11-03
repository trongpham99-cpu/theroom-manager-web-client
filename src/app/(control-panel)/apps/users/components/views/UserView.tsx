import { useParams, useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import {
	Card,
	CardContent,
	CardHeader,
	Avatar,
	Typography,
	Chip,
	Button,
	Box,
	Divider,
	List,
	ListItem,
	ListItemText
} from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import FuseLoading from '@fuse/core/FuseLoading';
import { getUserById } from '../../UsersApi';

/**
 * The User Detail View.
 */
function UserView() {
	const { userId } = useParams();
	const navigate = useNavigate();

	const { data, isLoading, isError } = useQuery({
		queryKey: ['user', userId],
		queryFn: () => getUserById(userId as string),
		enabled: !!userId
	});

	if (isLoading) {
		return <FuseLoading />;
	}

	if (isError || !data?.data) {
		return (
			<Box className="flex h-full flex-col items-center justify-center p-32">
				<FuseSvgIcon
					size={64}
					color="disabled"
				>
					lucide:user-x
				</FuseSvgIcon>
				<Typography
					variant="h6"
					className="mt-16"
				>
					User not found
				</Typography>
				<Button
					variant="contained"
					color="secondary"
					className="mt-16"
					onClick={() => navigate('/apps/users')}
				>
					Back to Users
				</Button>
			</Box>
		);
	}

	const user = data.data;

	return (
		<div className="flex flex-col gap-24 p-24 sm:p-32">
			<div className="flex items-center justify-between">
				<Button
					startIcon={<FuseSvgIcon>lucide:arrow-left</FuseSvgIcon>}
					onClick={() => navigate('/apps/users')}
				>
					Back to Users
				</Button>
				<Button
					variant="contained"
					color="secondary"
					startIcon={<FuseSvgIcon>lucide:edit</FuseSvgIcon>}
					onClick={() => navigate(`/apps/users/${userId}/edit`)}
				>
					Edit User
				</Button>
			</div>

			<Card>
				<CardHeader
					avatar={
						<Avatar
							src={user.photoURL}
							alt={user.name}
							sx={{ width: 80, height: 80 }}
						/>
					}
					title={
						<Typography
							variant="h5"
							className="font-semibold"
						>
							{user.name}
						</Typography>
					}
					subheader={
						<div className="mt-8 flex gap-8">
							<Chip
								label={user.role}
								size="small"
								color={user.role === 'admin' ? 'primary' : 'default'}
							/>
							<Chip
								icon={
									<FuseSvgIcon
										size={16}
										className="mr-0"
									>
										{user.isEmailVerified ? 'lucide:check-circle' : 'lucide:x-circle'}
									</FuseSvgIcon>
								}
								label={user.isEmailVerified ? 'Email Verified' : 'Email Not Verified'}
								size="small"
								color={user.isEmailVerified ? 'success' : 'warning'}
								variant="outlined"
							/>
						</div>
					}
				/>
				<Divider />
				<CardContent>
					<List>
						<ListItem>
							<ListItemText
								primary="User ID"
								secondary={
									<Typography
										variant="body2"
										sx={{ fontFamily: 'monospace' }}
									>
										{user.id}
									</Typography>
								}
							/>
						</ListItem>
						<Divider />
						<ListItem>
							<ListItemText
								primary="Email"
								secondary={user.email}
							/>
						</ListItem>
						<Divider />
						<ListItem>
							<ListItemText
								primary="Role"
								secondary={user.role}
							/>
						</ListItem>
						<Divider />
						<ListItem>
							<ListItemText
								primary="Email Verified"
								secondary={user.isEmailVerified ? 'Yes' : 'No'}
							/>
						</ListItem>
					</List>
				</CardContent>
			</Card>

			{user.settings && (
				<Card>
					<CardHeader title="User Settings" />
					<Divider />
					<CardContent>
						<pre className="overflow-auto rounded bg-gray-100 p-16 text-sm dark:bg-gray-800">
							{JSON.stringify(user.settings, null, 2)}
						</pre>
					</CardContent>
				</Card>
			)}
		</div>
	);
}

export default UserView;
