import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useCreateFolder } from '../../api/hooks/folders/useCreateFolder';
import useParams from '@fuse/hooks/useParams';

type CreateFolderDialogProps = {
	open: boolean;
	onClose: () => void;
};

function CreateFolderDialog({ open, onClose }: CreateFolderDialogProps) {
	const [folderName, setFolderName] = useState('');
	const [description, setDescription] = useState('');
	const routeParams = useParams();
	const { folderId } = routeParams;
	const createFolder = useCreateFolder();

	const handleCreate = () => {
		if (!folderName.trim()) {
			return;
		}

		createFolder.mutate(
			{
				name: folderName,
				path: folderId || 'root',
				description
			},
			{
				onSuccess: () => {
					setFolderName('');
					setDescription('');
					onClose();
				}
			}
		);
	};

	const handleClose = () => {
		setFolderName('');
		setDescription('');
		onClose();
	};

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			maxWidth="sm"
			fullWidth
		>
			<DialogTitle>Tạo folder mới</DialogTitle>
			<DialogContent>
				<TextField
					autoFocus
					margin="dense"
					label="Tên folder"
					fullWidth
					value={folderName}
					onChange={(e) => setFolderName(e.target.value)}
					required
				/>
				<TextField
					margin="dense"
					label="Mô tả"
					fullWidth
					multiline
					rows={3}
					value={description}
					onChange={(e) => setDescription(e.target.value)}
				/>
			</DialogContent>
			<DialogActions>
				<Button
					onClick={handleClose}
					color="secondary"
				>
					Hủy
				</Button>
				<Button
					onClick={handleCreate}
					variant="contained"
					color="secondary"
					disabled={!folderName.trim() || createFolder.isPending}
				>
					Tạo
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default CreateFolderDialog;
