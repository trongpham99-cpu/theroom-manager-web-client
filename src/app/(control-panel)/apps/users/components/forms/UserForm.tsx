import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
	Card,
	CardContent,
	CardHeader,
	TextField,
	Button,
	Box,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	FormHelperText,
	Avatar
} from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import FuseLoading from '@fuse/core/FuseLoading';
import { useSnackbar } from 'notistack';
import { getUserById, createUser, updateUser } from '../../UsersApi';

/**
 * Form Validation Schema
 */
const schema = z.object({
	name: z.string().min(1, 'Name is required'),
	email: z.string().email('Invalid email address'),
	role: z.enum(['admin', 'user'], { required_error: 'Role is required' }),
	photoURL: z.string().optional(),
	password: z.string().optional()
});

type FormType = z.infer<typeof schema>;

/**
 * The User Form Component.
 */
function UserForm() {
	const { userId } = useParams();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();
	const isNewUser = userId === 'new';

	const { data, isLoading } = useQuery({
		queryKey: ['user', userId],
		queryFn: () => getUserById(userId as string),
		enabled: !isNewUser && !!userId
	});

	const createMutation = useMutation({
		mutationFn: createUser,
		onSuccess: (response) => {
			queryClient.invalidateQueries({ queryKey: ['users'] });
			enqueueSnackbar(response.message || 'User created successfully', { variant: 'success' });
			navigate('/apps/users');
		},
		onError: (error: Error) => {
			enqueueSnackbar(error?.message || 'Failed to create user', { variant: 'error' });
		}
	});

	const updateMutation = useMutation({
		mutationFn: ({ id, data: userData }: { id: string; data: Partial<FormType> }) => updateUser(id, userData),
		onSuccess: (response) => {
			queryClient.invalidateQueries({ queryKey: ['users'] });
			queryClient.invalidateQueries({ queryKey: ['user', userId] });
			enqueueSnackbar(response.message || 'User updated successfully', { variant: 'success' });
			navigate(`/apps/users/${userId}`);
		},
		onError: (error: Error) => {
			enqueueSnackbar(error?.message || 'Failed to update user', { variant: 'error' });
		}
	});

	const { control, formState, handleSubmit, reset } = useForm<FormType>({
		mode: 'onChange',
		resolver: zodResolver(schema),
		defaultValues: {
			name: '',
			email: '',
			role: 'user',
			photoURL: '/assets/images/avatars/default-avatar.jpg',
			password: ''
		}
	});

	const { errors } = formState;

	useEffect(() => {
		if (data?.data && !isNewUser) {
			reset({
				name: data.data.name,
				email: data.data.email,
				role: data.data.role as 'admin' | 'user',
				photoURL: data.data.photoURL
			});
		}
	}, [data, isNewUser, reset]);

	const onSubmit = (formData: FormType) => {
		if (isNewUser) {
			createMutation.mutate(formData);
		} else {
			updateMutation.mutate({ id: userId as string, data: formData });
		}
	};

	if (isLoading && !isNewUser) {
		return <FuseLoading />;
	}

	return (
		<div className="flex flex-col gap-24 p-24 sm:p-32">
			<div className="flex items-center justify-between">
				<Button
					startIcon={<FuseSvgIcon>lucide:arrow-left</FuseSvgIcon>}
					onClick={() => navigate(isNewUser ? '/apps/users' : `/apps/users/${userId}`)}
				>
					Back
				</Button>
			</div>

			<Card>
				<CardHeader
					title={isNewUser ? 'Create New User' : 'Edit User'}
					subheader={isNewUser ? 'Add a new user to the system' : 'Update user information'}
				/>
				<CardContent>
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="flex flex-col gap-24"
					>
						<Controller
							name="photoURL"
							control={control}
							render={({ field }) => (
								<Box className="flex items-center gap-16">
									<Avatar
										src={field.value}
										sx={{ width: 80, height: 80 }}
									/>
									<TextField
										{...field}
										label="Photo URL"
										fullWidth
										error={!!errors.photoURL}
										helperText={errors?.photoURL?.message}
									/>
								</Box>
							)}
						/>

						<Controller
							name="name"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Full Name"
									required
									fullWidth
									error={!!errors.name}
									helperText={errors?.name?.message}
								/>
							)}
						/>

						<Controller
							name="email"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Email"
									type="email"
									required
									fullWidth
									error={!!errors.email}
									helperText={errors?.email?.message}
								/>
							)}
						/>

						<Controller
							name="role"
							control={control}
							render={({ field }) => (
								<FormControl
									fullWidth
									error={!!errors.role}
								>
									<InputLabel>Role</InputLabel>
									<Select
										{...field}
										label="Role"
									>
										<MenuItem value="user">User</MenuItem>
										<MenuItem value="admin">Admin</MenuItem>
									</Select>
									<FormHelperText>{errors?.role?.message}</FormHelperText>
								</FormControl>
							)}
						/>

						{isNewUser && (
							<Controller
								name="password"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="Password"
										type="password"
										fullWidth
										helperText="Leave empty to auto-generate"
										error={!!errors.password}
									/>
								)}
							/>
						)}

						<Box className="flex justify-end gap-16">
							<Button
								variant="outlined"
								onClick={() => navigate(isNewUser ? '/apps/users' : `/apps/users/${userId}`)}
							>
								Cancel
							</Button>
							<Button
								variant="contained"
								color="secondary"
								type="submit"
								disabled={createMutation.isPending || updateMutation.isPending}
							>
								{isNewUser ? 'Create User' : 'Update User'}
							</Button>
						</Box>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}

export default UserForm;
