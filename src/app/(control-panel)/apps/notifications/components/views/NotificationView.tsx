'use client';

import FusePageCarded from '@fuse/core/FusePageCarded';
import Typography from '@mui/material/Typography';
import { motion } from 'motion/react';
import { FormProvider, useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TextField, Paper, Autocomplete, Chip } from '@mui/material';
import NotificationHeader from '../ui/NotificationHeader';
import { useCreateNotification } from '../../api/hooks/useCreateNotification';
import { useApartments } from '../../api/hooks/useApartments';
import { useRooms } from '../../api/hooks/useRooms';

/**
 * Form Validation Schema
 */
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

/**
 * The notification create page.
 */
function NotificationView() {
	const { mutate: createNotification } = useCreateNotification();
	const { data: apartmentsData } = useApartments();
	const { data: roomsData } = useRooms();

	const apartments = apartmentsData?.rows || [];
	const rooms = roomsData?.rows || [];

	const methods = useForm<FormType>({
		mode: 'onChange',
		defaultValues: {
			notification_title: '',
			notification_body: '',
			apartmentIds: [],
			roomIds: []
		},
		resolver: zodResolver(schema)
	});

	const {
		control,
		formState: { errors },
		handleSubmit
	} = methods;

	const onSubmit = (formData: FormType) => {
		const payload = {
			templateData: {
				notification_title: formData.notification_title,
				notification_body: formData.notification_body
			},
			apartmentIds: formData.apartmentIds || [],
			roomIds: formData.roomIds || []
		};

		createNotification(payload);
	};

	return (
		<FormProvider {...methods}>
			<FusePageCarded
				header={<NotificationHeader onSubmit={handleSubmit(onSubmit)} />}
				content={
					<div className="p-6 sm:p-12">
						<Paper className="p-6 sm:p-12">
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
							>
								<Typography className="mb-8 text-3xl font-bold">
									New Notification
								</Typography>

								<div className="space-y-6">
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
							</motion.div>
						</Paper>
					</div>
				}
			/>
		</FormProvider>
	);
}

export default NotificationView;

