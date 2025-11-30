import { useEffect } from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	TextField,
	Autocomplete,
	Chip,
	Typography
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateNotification } from '../../api/hooks/useCreateNotification';
import { useApartments } from '../../../room-management/api/hooks/useApartments';
import { useRooms } from '../../../room-management/api/hooks/useRooms';

const schema = z.object({
	notification_title: z
		.string()
		.min(1, 'Title is required')
		.min(5, 'Title must be at least 5 characters'),
	notification_body: z.string().min(1, 'Content is required'),
	apartmentIds: z.array(z.string()).optional(),
	roomIds: z.array(z.string()).optional()
});

type FormType = z.infer<typeof schema>;

type CreateNotificationDialogProps = {
	open: boolean;
	onClose: () => void;
};

function CreateNotificationDialog({ open, onClose }: CreateNotificationDialogProps) {
	const { mutate: createNotification, isPending } = useCreateNotification();
	const { data: apartmentsData } = useApartments();
	const { data: roomsData } = useRooms();

	const apartments = apartmentsData?.rows || [];
	const rooms = roomsData?.rows || [];

	const {
		control,
		handleSubmit,
		formState: { errors },
		reset
	} = useForm<FormType>({
		mode: 'onChange',
		defaultValues: {
			notification_title: '',
			notification_body: '',
			apartmentIds: [],
			roomIds: []
		},
		resolver: zodResolver(schema)
	});

	useEffect(() => {
		if (open) {
			reset();
		}
	}, [open, reset]);

	const onSubmit = (formData: FormType) => {
		const payload = {
			templateData: {
				notification_title: formData.notification_title,
				notification_body: formData.notification_body
			},
			apartmentIds: formData.apartmentIds || [],
			roomIds: formData.roomIds || []
		};

		createNotification(payload, {
			onSuccess: () => {
				onClose();
				reset();
			}
		});
	};

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="sm"
			fullWidth
		>
			<form onSubmit={handleSubmit(onSubmit)}>
				<DialogTitle>Create New Notification</DialogTitle>
				<DialogContent>
					<div className="mt-4 space-y-6">
						<Controller
							name="notification_title"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Title"
									placeholder="Enter notification title"
									fullWidth
									error={!!errors.notification_title}
									helperText={errors.notification_title?.message}
									variant="outlined"
								/>
							)}
						/>

						<Controller
							name="notification_body"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Content"
									placeholder="Enter notification content"
									fullWidth
									multiline
									rows={4}
									error={!!errors.notification_body}
									helperText={errors.notification_body?.message}
									variant="outlined"
								/>
							)}
						/>

						<Controller
							name="apartmentIds"
							control={control}
							render={({ field: { onChange, value } }) => (
								<Autocomplete
									multiple
									options={apartments}
									getOptionLabel={(option) => option.code}
									value={apartments.filter((apt) => value?.includes(apt._id))}
									onChange={(_, newValue) => {
										onChange(newValue.map((apt) => apt._id));
									}}
									renderInput={(params) => (
										<TextField
											{...params}
											label="Apartments"
											placeholder="Select apartments"
											variant="outlined"
										/>
									)}
									renderTags={(tagValue, getTagProps) =>
										tagValue.map((option, index) => (
											<Chip
												{...getTagProps({ index })}
												label={option.code}
												key={option._id}
											/>
										))
									}
								/>
							)}
						/>

						<Controller
							name="roomIds"
							control={control}
							render={({ field: { onChange, value } }) => (
								<Autocomplete
									multiple
									options={rooms}
									getOptionLabel={(option) => option.code}
									value={rooms.filter((room) => value?.includes(room._id))}
									onChange={(_, newValue) => {
										onChange(newValue.map((room) => room._id));
									}}
									renderInput={(params) => (
										<TextField
											{...params}
											label="Rooms"
											placeholder="Select rooms"
											variant="outlined"
										/>
									)}
									renderTags={(tagValue, getTagProps) =>
										tagValue.map((option, index) => (
											<Chip
												{...getTagProps({ index })}
												label={option.code}
												key={option._id}
											/>
										))
									}
								/>
							)}
						/>

						<Typography
							variant="caption"
							color="text.secondary"
							className="block"
						>
							💡 Tip: Leave both empty to send to all users
						</Typography>
					</div>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={onClose}
						color="inherit"
					>
						Cancel
					</Button>
					<Button
						type="submit"
						variant="contained"
						color="secondary"
						disabled={isPending}
					>
						{isPending ? 'Sending...' : 'Send Notification'}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
}

export default CreateNotificationDialog;
