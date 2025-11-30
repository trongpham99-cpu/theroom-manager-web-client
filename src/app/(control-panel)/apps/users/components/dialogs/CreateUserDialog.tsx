'use client';

import { useCallback, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Button,
	FormControl,
	Select,
	MenuItem,
	Avatar,
	FormLabel,
	IconButton,
	Box
} from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { createUser } from '../../UsersApi';

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

type CreateUserDialogProps = {
	open: boolean;
	onClose: () => void;
};

function CreateUserDialog(props: CreateUserDialogProps) {
	const { open, onClose } = props;
	const { t } = useTranslation('usersApp');
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();

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
	const photoURL = watch('photoURL');
	const name = watch('name');

	const createMutation = useMutation({
		mutationFn: createUser,
		onSuccess: (response) => {
			queryClient.invalidateQueries({ queryKey: ['users'] });
			enqueueSnackbar(response.message || t('MESSAGES.CREATE_SUCCESS'), { variant: 'success' });
			reset();
			onClose();
		},
		onError: (error: Error) => {
			enqueueSnackbar(error?.message || t('MESSAGES.CREATE_ERROR'), { variant: 'error' });
		}
	});

	const onSubmit = useCallback(
		(formData: FormType) => {
			// Remove photoURL from payload
			const { photoURL, ...dataToSubmit } = formData;
			createMutation.mutate(dataToSubmit);
		},
		[createMutation]
	);

	const handleClose = () => {
		reset();
		onClose();
	};

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
			<DialogTitle className="text-2xl font-bold">{t('DIALOGS.CREATE.TITLE')}</DialogTitle>
			<DialogContent>
				<div className="flex flex-col gap-6 pt-4">
					{/* Avatar Upload - Temporarily Disabled */}
					{/* <div className="flex justify-center">
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
									<div className="absolute inset-0 z-20 flex items-center justify-center gap-1">
										<label
											htmlFor="button-avatar-create"
											className="flex cursor-pointer p-2"
										>
											<input
												accept="image/*"
												className="hidden"
												id="button-avatar-create"
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
																		`data:${file.type};base64,${btoa(reader.result)}`
																	);
																} else {
																	reject(
																		new Error('File reading did not result in a string.')
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
										<IconButton
											size="small"
											onClick={() => {
												onChange('');
											}}
										>
											<FuseSvgIcon className="text-white">lucide:trash</FuseSvgIcon>
										</IconButton>
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
										{name?.charAt(0) || '?'}
									</Avatar>
								</Box>
							)}
						/>
					</div> */}

					{/* Name */}
					<Controller
						control={control}
						name="name"
						render={({ field }) => (
							<FormControl className="w-full">
								<FormLabel htmlFor="name-create">{t('DIALOGS.CREATE.NAME_LABEL')}</FormLabel>
								<TextField
									{...field}
									id="name-create"
									placeholder={t('DIALOGS.CREATE.NAME_PLACEHOLDER')}
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
								<FormLabel htmlFor="email-create">{t('DIALOGS.CREATE.EMAIL_LABEL')}</FormLabel>
								<TextField
									{...field}
									id="email-create"
									placeholder={t('DIALOGS.CREATE.EMAIL_PLACEHOLDER')}
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

					{/* Role */}
					<Controller
						control={control}
						name="role"
						render={({ field }) => (
							<FormControl className="w-full">
								<FormLabel htmlFor="role-create">{t('DIALOGS.CREATE.ROLE_LABEL')}</FormLabel>
								<Select
									{...field}
									id="role-create"
									displayEmpty
									fullWidth
									startAdornment={<FuseSvgIcon color="action">lucide:shield</FuseSvgIcon>}
								>
									<MenuItem value="user">{t('ROLES.USER')}</MenuItem>
									<MenuItem value="admin">{t('ROLES.ADMIN')}</MenuItem>
								</Select>
							</FormControl>
						)}
					/>

					{/* Password */}
					<Controller
						control={control}
						name="password"
						render={({ field }) => (
							<FormControl className="w-full">
								<FormLabel htmlFor="password-create">{t('DIALOGS.CREATE.PASSWORD_LABEL')}</FormLabel>
								<TextField
									{...field}
									id="password-create"
									placeholder={t('DIALOGS.CREATE.PASSWORD_PLACEHOLDER')}
									type="password"
									error={!!errors.password}
									helperText={errors?.password?.message || t('DIALOGS.CREATE.PASSWORD_HELPER')}
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
				</div>
			</DialogContent>
			<DialogActions className="px-6 pb-6">
				<Button onClick={handleClose}>{t('DIALOGS.CREATE.CANCEL')}</Button>
				<Button
					variant="contained"
					color="secondary"
					disabled={_.isEmpty(dirtyFields) || !isValid || createMutation.isPending}
					onClick={handleSubmit(onSubmit)}
				>
					{createMutation.isPending ? t('DIALOGS.CREATE.CREATING') : t('DIALOGS.CREATE.CREATE')}
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default CreateUserDialog;

