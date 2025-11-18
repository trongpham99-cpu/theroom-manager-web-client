import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import ListItemButton from '@mui/material/ListItemButton';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import EditUserDialog from '../../dialogs/EditUserDialog';
import DeleteUserDialog from '../../dialogs/DeleteUserDialog';
import { UserType } from '../../../UsersApi';

type UserListItemPropsType = {
	user: UserType;
};

/**
 * The user list item.
 */
function UserListItem(props: UserListItemPropsType) {
	const { user } = props;
	const [openEditDialog, setOpenEditDialog] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

	const handleEditClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setOpenEditDialog(true);
	};

	const handleDeleteClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setOpenDeleteDialog(true);
	};

	return (
		<>
			<ListItemButton
				className="border-divider border-b-1 px-4 py-4 md:px-8"
				sx={{ bgcolor: 'background.paper' }}
				component={NavLinkAdapter}
				to={`/apps/users/${user.id}`}
			>
				<ListItemAvatar>
					<Avatar
						alt={user.name}
						src={user.photoURL}
					>
						{user.name?.charAt(0)?.toUpperCase()}
					</Avatar>
				</ListItemAvatar>
				<ListItemText
					classes={{ root: 'm-0 flex-1', primary: 'font-medium leading-5 truncate' }}
					primary={user.name}
					secondary={
						<div className="flex items-center gap-2 mt-1">
							<Typography
								className="inline"
								component="span"
								variant="body2"
								color="text.secondary"
							>
								{user.email}
							</Typography>
							{user.role && (
								<Chip
									label={user.role}
									size="small"
									color={user.role === 'admin' ? 'primary' : 'default'}
									variant="outlined"
								/>
							)}
						</div>
					}
				/>
				<div className="flex items-center gap-1 ml-4">
					<IconButton
						size="small"
						onClick={handleEditClick}
						sx={{
							'&:hover': {
								bgcolor: 'action.hover'
							}
						}}
					>
						<FuseSvgIcon size={20}>lucide:square-pen</FuseSvgIcon>
					</IconButton>
					<IconButton
						size="small"
						onClick={handleDeleteClick}
						sx={{
							color: 'error.main',
							'&:hover': {
								bgcolor: 'error.main',
								color: 'white'
							}
						}}
					>
						<FuseSvgIcon size={20}>lucide:trash-2</FuseSvgIcon>
					</IconButton>
				</div>
			</ListItemButton>

			<EditUserDialog
				open={openEditDialog}
				onClose={() => setOpenEditDialog(false)}
				user={user}
			/>

			<DeleteUserDialog
				open={openDeleteDialog}
				onClose={() => setOpenDeleteDialog(false)}
				user={user}
			/>
		</>
	);
}

export default UserListItem;

