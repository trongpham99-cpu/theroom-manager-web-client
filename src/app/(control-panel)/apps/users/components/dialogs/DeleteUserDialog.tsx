'use client';

import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Typography,
	DialogContentText
} from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { deleteUser, UserType } from '../../UsersApi';

type DeleteUserDialogProps = {
	open: boolean;
	onClose: () => void;
	onSuccess?: () => void;
	user: UserType | null;
};

function DeleteUserDialog(props: DeleteUserDialogProps) {
	const { open, onClose, onSuccess, user } = props;
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();

	const deleteMutation = useMutation({
		mutationFn: deleteUser,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['users'] });
			enqueueSnackbar('User deleted successfully', { variant: 'success' });
			onClose();
			if (onSuccess) {
				onSuccess();
			}
		},
		onError: (error: Error) => {
			enqueueSnackbar(error?.message || 'Failed to delete user', { variant: 'error' });
		}
	});

	const handleDelete = () => {
		if (!user) return;
		deleteMutation.mutate(user.id);
	};

	if (!user) {
		return null;
	}

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="xs"
			fullWidth
			PaperProps={{
				sx: {
					borderRadius: 2
				}
			}}
		>
			<DialogTitle className="flex items-center gap-3 text-2xl font-bold">
				<FuseSvgIcon
					color="error"
					size={28}
				>
					lucide:alert-triangle
				</FuseSvgIcon>
				Delete User
			</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Are you sure you want to delete user{' '}
					<Typography
						component="span"
						className="font-bold"
					>
						{user.name}
					</Typography>
					? This action cannot be undone.
				</DialogContentText>
			</DialogContent>
			<DialogActions className="px-6 pb-6">
				<Button
					onClick={onClose}
					disabled={deleteMutation.isPending}
				>
					Cancel
				</Button>
				<Button
					variant="contained"
					color="error"
					onClick={handleDelete}
					disabled={deleteMutation.isPending}
					startIcon={<FuseSvgIcon>lucide:trash-2</FuseSvgIcon>}
				>
					{deleteMutation.isPending ? 'Deleting...' : 'Delete'}
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default DeleteUserDialog;

