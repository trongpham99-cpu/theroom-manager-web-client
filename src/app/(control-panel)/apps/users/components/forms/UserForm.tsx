'use client';

import { useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import _ from 'lodash';
import {
	TextField,
	Button,
	Box,
	FormControl,
	Select,
	MenuItem,
	Avatar,
	FormLabel,
	IconButton
} from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import FuseLoading from '@fuse/core/FuseLoading';
import Link from '@fuse/core/Link';
import { useSnackbar } from 'notistack';
import { getUserById, createUser, updateUser, deleteUser } from '../../UsersApi';

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

	const { control, formState, handleSubmit, reset, watch } = useForm<FormType>({
		mode: 'all',
		resolver: zodResolver(schema),
		defaultValues: {
			name: '',
			email: '',
			role: 'user',
			photoURL: '',
			password: ''
		}
	});

	const { errors, isValid, dirtyFields } = formState;
	const form = watch();

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

	const onSubmit = useCallback(() => {
		if (isNewUser) {
			createMutation.mutate(form, {
				onSuccess: (response) => {
					navigate(`/apps/users/${response.data.id}`);
				}
			});
		} else {
			updateMutation.mutate({ id: userId as string, data: form });
		}
		// eslint-disable-next-line
	}, [form, isNewUser]);

	const deleteMutation = useMutation({
		mutationFn: deleteUser,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['users'] });
			enqueueSnackbar('User deleted successfully', { variant: 'success' });
			navigate('/apps/users');
		},
		onError: (error: Error) => {
			enqueueSnackbar(error?.message || 'Failed to delete user', { variant: 'error' });
		}
	});

	function handleRemoveUser() {
		if (!data?.data) {
			return;
		}

		deleteMutation.mutate(data.data.id);
	}

	const photoURL = watch('photoURL');
	const name = watch('name');

	if (isLoading && !isNewUser) {
		return <FuseLoading className="min-h-screen" />;
	}

	if (_.isEmpty(form) && !isNewUser) {
		return <FuseLoading className="min-h-screen" />;
	}

	return (
		<>
			<div className="relative flex flex-auto flex-col items-center overflow-y-auto">
				<Box
					className="relative min-h-40 w-full px-8 sm:min-h-48 sm:px-12"
					sx={{
						backgroundColor: 'background.default'
					}}
				/>

				<div className="w-full px-6 pb-8 sm:px-12">
					<div className="-mt-16 flex w-full flex-auto items-end">
						<Controller
							control={control}
							name="photoURL"
							render={({ field: { onChange, value } }) => (
								<Box
									sx={{
										borderWidth: 4,
										borderStyle: 'solid',
										borderColor: 'background.paper'
									}}
									className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full"
								>
									<div className="absolute inset-0 z-10 bg-black/50" />
									<div className="absolute inset-0 z-20 flex items-center justify-center">
										<div>
											<label
												htmlFor="button-avatar"
												className="flex cursor-pointer p-2"
											>
												<input
													accept="image/*"
													className="hidden"
													id="button-avatar"
													type="file"
													onChange={async (e) => {
														function readFileAsync() {
															return new Promise((resolve, reject) => {
																const file = e?.target?.files?.[0];

																if (!file) {
																	return;
																}

																const reader: FileReader = new FileReader();

																reader.onload = () => {
																	if (typeof reader.result === 'string') {
																		resolve(
																			`data:${file.type};base64,${btoa(
																				reader.result
																			)}`
																		);
																	} else {
																		reject(
																			new Error(
																				'File reading did not result in a string.'
																			)
																		);
																	}
																};

																reader.onerror = reject;

																reader.readAsBinaryString(file);
															});
														}

														const newImage = await readFileAsync();

														onChange(newImage);
													}}
												/>
												<FuseSvgIcon className="text-white">lucide:camera</FuseSvgIcon>
											</label>
										</div>
										<div>
											<IconButton
												onClick={() => {
													onChange('');
												}}
											>
												<FuseSvgIcon className="text-white">lucide:trash</FuseSvgIcon>
											</IconButton>
										</div>
									</div>
									<Avatar
										sx={{
											backgroundColor: 'background.default',
											color: 'text.secondary'
										}}
										className="text-16 h-full w-full object-cover font-bold"
										src={value}
										alt={name}
									>
										{name?.charAt(0)}
									</Avatar>
								</Box>
							)}
						/>
					</div>

					<div className="flex flex-col gap-4">
						<Controller
							control={control}
							name="name"
							render={({ field }) => (
								<FormControl className="w-full">
									<FormLabel htmlFor="name">Name</FormLabel>
									<TextField
										{...field}
										id="name"
										placeholder="Name"
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

						<Controller
							control={control}
							name="email"
							render={({ field }) => (
								<FormControl className="w-full">
									<FormLabel htmlFor="email">Email</FormLabel>
									<TextField
										{...field}
										id="email"
										placeholder="Email"
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

						<Controller
							control={control}
							name="role"
							render={({ field }) => (
								<FormControl className="w-full">
									<FormLabel htmlFor="role">Role</FormLabel>
									<Select
										{...field}
										id="role"
										displayEmpty
										fullWidth
										startAdornment={<FuseSvgIcon color="action">lucide:shield</FuseSvgIcon>}
									>
										<MenuItem value="user">User</MenuItem>
										<MenuItem value="admin">Admin</MenuItem>
									</Select>
								</FormControl>
							)}
						/>

						{isNewUser && (
							<Controller
								control={control}
								name="password"
								render={({ field }) => (
									<FormControl className="w-full">
										<FormLabel htmlFor="password">Password</FormLabel>
										<TextField
											{...field}
											id="password"
											placeholder="Password"
											type="password"
											error={!!errors.password}
											helperText={errors?.password?.message || 'Leave empty to auto-generate'}
											variant="outlined"
											fullWidth
											slotProps={{
												input: {
													startAdornment: <FuseSvgIcon color="action">lucide:lock</FuseSvgIcon>
												}
											}}
										/>
									</FormControl>
								)}
							/>
						)}
					</div>
				</div>
			</div>

			<Box
				className="flex items-center border-t py-3.5 pr-4 pl-1 sm:pr-12 sm:pl-9"
				sx={{ backgroundColor: 'background.default' }}
			>
				{!isNewUser && (
					<Button
						color="error"
						onClick={handleRemoveUser}
						disabled={deleteMutation.isPending}
					>
						Delete
					</Button>
				)}
				<Button
					component={Link}
					className="ml-auto"
					to={isNewUser ? '/apps/users' : `/apps/users/${userId}`}
				>
					Cancel
				</Button>
				<Button
					className="ml-2"
					variant="contained"
					color="secondary"
					disabled={_.isEmpty(dirtyFields) || !isValid}
					onClick={handleSubmit(onSubmit)}
				>
					Save
				</Button>
			</Box>
		</>
	);
}

export default UserForm;
