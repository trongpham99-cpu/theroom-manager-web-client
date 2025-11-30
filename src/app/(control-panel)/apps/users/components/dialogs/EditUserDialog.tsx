'use client';

import { useCallback, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import _ from 'lodash';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Button,
	FormControl,
	FormLabel
} from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { updateUser, UserType } from '../../UsersApi';
import FuseLoading from '@fuse/core/FuseLoading';

/**
 * Form Validation Schema
 * Note: role is optional because it's not sent to server
 */
const schema = z.object({
	name: z.string().min(1, 'Name is required'),
	email: z.string().email('Invalid email address'),
	role: z.enum(['admin', 'user']).optional()
});

type FormType = z.infer<typeof schema>;

type EditUserDialogProps = {
	open: boolean;
	onClose: () => void;
	user: UserType | null;
};

function EditUserDialog(props: EditUserDialogProps) {
	const { open, onClose, user } = props;
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();

	const { control, formState, handleSubmit, reset } = useForm<FormType>({
		mode: 'all',
		resolver: zodResolver(schema),
		defaultValues: {
			name: '',
			email: '',
			role: 'user'
		}
	});

	const { errors, isValid, dirtyFields } = formState;

	// Reset form when user changes
	useEffect(() => {
		if (user) {
			reset({
				name: user.name,
				email: user.email,
				role: user.role as 'admin' | 'user'
			});
		}
	}, [user, reset]);

	const updateMutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: Partial<FormType> }) => updateUser(id, data),
		onSuccess: (response) => {
			queryClient.invalidateQueries({ queryKey: ['users'] });
			queryClient.invalidateQueries({ queryKey: ['user', user?.id] });
			enqueueSnackbar(response.message || 'User updated successfully', { variant: 'success' });
			onClose();
		},
		onError: (error: Error) => {
			enqueueSnackbar(error?.message || 'Failed to update user', { variant: 'error' });
		}
	});

	const onSubmit = useCallback(
		(formData: FormType) => {
			if (!user) return;
			// Remove role from payload - don't send to server
			const { role, ...dataToSubmit } = formData;
			updateMutation.mutate({ id: user.id, data: dataToSubmit });
		},
		[updateMutation, user]
	);

	const handleClose = () => {
		reset();
		onClose();
	};

	if (!user) {
		return null;
	}

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			maxWidth="sm"
			fullWidth
			PaperProps={{
				sx: {
					borderRadius: 2
				}
			}}
		>
			<DialogTitle className="text-2xl font-bold">Edit User</DialogTitle>
			<DialogContent>
				<div className="flex flex-col gap-6 pt-4">
					{/* Name */}
					<Controller
						control={control}
						name="name"
						render={({ field }) => (
							<FormControl className="w-full">
								<FormLabel htmlFor="name-edit">Name</FormLabel>
								<TextField
									{...field}
									id="name-edit"
									placeholder="Full name"
									error={!!errors.name}
									helperText={errors?.name?.message}
									variant="outlined"
									required
									fullWidth
									slotProps={{
										input: {
											startAdornment: <FuseSvgIcon color="action">lucide:circle-user</FuseSvgIcon>
										}
									}}
								/>
							</FormControl>
						)}
					/>

					{/* Email */}
					<Controller
						control={control}
						name="email"
						render={({ field }) => (
							<FormControl className="w-full">
								<FormLabel htmlFor="email-edit">Email</FormLabel>
								<TextField
									{...field}
									id="email-edit"
									placeholder="email@example.com"
									type="email"
									error={!!errors.email}
									helperText={errors?.email?.message}
									variant="outlined"
									required
									fullWidth
									slotProps={{
										input: {
											startAdornment: <FuseSvgIcon color="action">lucide:mail</FuseSvgIcon>
										}
									}}
								/>
							</FormControl>
						)}
					/>

					{/* Role - Hidden, not editable */}
					{/* <Controller
						control={control}
						name="role"
						render={({ field }) => (
							<FormControl className="w-full">
								<FormLabel htmlFor="role-edit">Role</FormLabel>
								<Select
									{...field}
									id="role-edit"
									displayEmpty
									fullWidth
									startAdornment={<FuseSvgIcon color="action">lucide:shield</FuseSvgIcon>}
								>
									<MenuItem value="user">User</MenuItem>
									<MenuItem value="admin">Admin</MenuItem>
								</Select>
							</FormControl>
						)}
					/> */}
				</div>
			</DialogContent>
			<DialogActions className="px-6 pb-6">
				<Button onClick={handleClose}>Cancel</Button>
				<Button
					variant="contained"
					color="secondary"
					disabled={_.isEmpty(dirtyFields) || !isValid || updateMutation.isPending}
					onClick={handleSubmit(onSubmit)}
				>
					{updateMutation.isPending ? 'Updating...' : 'Update User'}
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default EditUserDialog;

