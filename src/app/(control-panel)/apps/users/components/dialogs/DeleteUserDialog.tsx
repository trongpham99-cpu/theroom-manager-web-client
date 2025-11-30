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
import { useTranslation } from 'react-i18next';
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
	const { t } = useTranslation('usersApp');
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();

	const deleteMutation = useMutation({
		mutationFn: deleteUser,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['users'] });
			enqueueSnackbar(t('MESSAGES.DELETE_SUCCESS'), { variant: 'success' });
			onClose();
			if (onSuccess) {
				onSuccess();
			}
		},
		onError: (error: Error) => {
			enqueueSnackbar(error?.message || t('MESSAGES.DELETE_ERROR'), { variant: 'error' });
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
				{t('DIALOGS.DELETE.TITLE')}
			</DialogTitle>
			<DialogContent>
				<DialogContentText>
					{t('DIALOGS.DELETE.MESSAGE')}{' '}
					<Typography
						component="span"
						className="font-bold"
					>
						{user.name}
					</Typography>
					? {t('DIALOGS.DELETE.WARNING')}
				</DialogContentText>
			</DialogContent>
			<DialogActions className="px-6 pb-6">
				<Button
					onClick={onClose}
					disabled={deleteMutation.isPending}
				>
					{t('DIALOGS.DELETE.CANCEL')}
				</Button>
				<Button
					variant="contained"
					color="error"
					onClick={handleDelete}
					disabled={deleteMutation.isPending}
					startIcon={<FuseSvgIcon>lucide:trash-2</FuseSvgIcon>}
				>
					{deleteMutation.isPending ? t('DIALOGS.DELETE.DELETING') : t('DIALOGS.DELETE.DELETE')}
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default DeleteUserDialog;

