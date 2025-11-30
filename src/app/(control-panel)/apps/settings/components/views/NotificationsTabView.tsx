'use client';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import FormHelperText from '@mui/material/FormHelperText';
import _ from 'lodash';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNotificationSettings } from '../../api/hooks/notifications/useNotificationSettings';
import { useUpdateNotificationSettings } from '../../api/hooks/notifications/useUpdateNotificationSettings';

const defaultValues: FormType = {
	id: '',
	communication: false,
	security: false,
	meetups: false,
	comments: false,
	mention: false,
	follow: false,
	inquiry: false
};

/**
 * Form Validation Schema
 */
const schema = z.object({
	id: z.string(),
	communication: z.boolean(),
	security: z.boolean(),
	meetups: z.boolean(),
	comments: z.boolean(),
	mention: z.boolean(),
	follow: z.boolean(),
	inquiry: z.boolean()
});

type FormType = z.infer<typeof schema>;

function NotificationsTabView() {
	const { t } = useTranslation('settingsApp');
	const { data: notificationSettings } = useNotificationSettings();
	const { mutate: updateNotificationSettings } = useUpdateNotificationSettings();

	const { control, reset, handleSubmit, formState } = useForm<FormType>({
		defaultValues,
		mode: 'all',
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields } = formState;

	useEffect(() => {
		reset(notificationSettings);
	}, [notificationSettings, reset]);

	/**
	 * Form Submit
	 */
	function onSubmit(formData: FormType) {
		updateNotificationSettings({ ...formData, id: formData.id });
	}

	return (
		<div className="w-full max-w-5xl">
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex w-full flex-col gap-12"
			>
				<div>
					<Typography className="w-full text-xl font-medium">{t('NOTIFICATIONS.ALERTS_TITLE')}</Typography>
					<div className="grid w-full grid-cols-1 gap-1.5">
						<div className="flex items-center justify-between divide-y">
							<Controller
								name="communication"
								control={control}
								render={({ field: { onChange, value } }) => (
									<div className="flex w-full flex-col">
										<FormControlLabel
											classes={{
												root: 'm-0',
												label: 'flex flex-1'
											}}
											labelPlacement="start"
											label={t('NOTIFICATIONS.COMMUNICATION')}
											control={
												<Switch
													onChange={(ev) => {
														onChange(ev.target.checked);
													}}
													checked={value}
													name="askPasswordChange"
												/>
											}
										/>
										<FormHelperText>{t('NOTIFICATIONS.COMMUNICATION_HELPER')}</FormHelperText>
									</div>
								)}
							/>
						</div>
						<div className="flex items-center justify-between">
							<Controller
								name="security"
								control={control}
								render={({ field: { onChange, value } }) => (
									<div className="flex w-full flex-col">
										<FormControlLabel
											classes={{
												root: 'm-0',
												label: 'flex flex-1'
											}}
											labelPlacement="start"
											label={t('NOTIFICATIONS.SECURITY')}
											control={
												<Switch
													onChange={(ev) => {
														onChange(ev.target.checked);
													}}
													checked={value}
													name="security"
												/>
											}
										/>
										<FormHelperText>
											{t('NOTIFICATIONS.SECURITY_HELPER')}
										</FormHelperText>
									</div>
								)}
							/>
						</div>
						<div className="flex items-center justify-between">
							<Controller
								name="meetups"
								control={control}
								render={({ field: { onChange, value } }) => (
									<div className="flex w-full flex-col">
										<FormControlLabel
											classes={{
												root: 'm-0',
												label: 'flex flex-1'
											}}
											labelPlacement="start"
											label={t('NOTIFICATIONS.MEETUPS')}
											control={
												<Switch
													onChange={(ev) => {
														onChange(ev.target.checked);
													}}
													checked={value}
													name="meetups"
												/>
											}
										/>
										<FormHelperText>
											{t('NOTIFICATIONS.MEETUPS_HELPER')}
										</FormHelperText>
									</div>
								)}
							/>
						</div>
					</div>
				</div>
				<div>
					<Typography className="w-full text-xl font-medium">{t('NOTIFICATIONS.ACCOUNT_ACTIVITY_TITLE')}</Typography>
					<Typography className="mt-6 w-full font-medium">{t('NOTIFICATIONS.EMAIL_ME_WHEN')}</Typography>
					<div className="mt-3 grid w-full grid-cols-1 gap-1">
						<div className="flex items-center justify-between">
							<Controller
								name="comments"
								control={control}
								render={({ field: { onChange, value } }) => (
									<div className="flex w-full flex-col">
										<FormControlLabel
											classes={{
												root: 'm-0',
												label: 'flex flex-1'
											}}
											labelPlacement="start"
											label={t('NOTIFICATIONS.COMMENTS')}
											control={
												<Switch
													onChange={(ev) => {
														onChange(ev.target.checked);
													}}
													checked={value}
													name="comments"
												/>
											}
										/>
									</div>
								)}
							/>
						</div>
						<div className="flex items-center justify-between">
							<Controller
								name="mention"
								control={control}
								render={({ field: { onChange, value } }) => (
									<div className="flex w-full flex-col">
										<FormControlLabel
											classes={{
												root: 'm-0',
												label: 'flex flex-1'
											}}
											labelPlacement="start"
											label={t('NOTIFICATIONS.MENTION')}
											control={
												<Switch
													onChange={(ev) => {
														onChange(ev.target.checked);
													}}
													checked={value}
													name="mention"
												/>
											}
										/>
									</div>
								)}
							/>
						</div>
						<div className="flex items-center justify-between">
							<Controller
								name="follow"
								control={control}
								render={({ field: { onChange, value } }) => (
									<div className="flex w-full flex-col">
										<FormControlLabel
											classes={{
												root: 'm-0',
												label: 'flex flex-1'
											}}
											labelPlacement="start"
											label={t('NOTIFICATIONS.FOLLOW')}
											control={
												<Switch
													onChange={(ev) => {
														onChange(ev.target.checked);
													}}
													checked={value}
													name="follow"
												/>
											}
										/>
									</div>
								)}
							/>
						</div>
						<div className="flex items-center justify-between">
							<Controller
								name="inquiry"
								control={control}
								render={({ field: { onChange, value } }) => (
									<div className="flex w-full flex-col">
										<FormControlLabel
											classes={{
												root: 'm-0',
												label: 'flex flex-1'
											}}
											labelPlacement="start"
											label={t('NOTIFICATIONS.INQUIRY')}
											control={
												<Switch
													onChange={(ev) => {
														onChange(ev.target.checked);
													}}
													checked={value}
													name="comments"
												/>
											}
										/>
									</div>
								)}
							/>
						</div>
					</div>
				</div>
				<div className="flex items-center justify-end gap-2">
					<Button
						variant="outlined"
						disabled={_.isEmpty(dirtyFields)}
						onClick={() => reset(notificationSettings)}
					>
						{t('NOTIFICATIONS.CANCEL')}
					</Button>
					<Button
						variant="contained"
						color="secondary"
						disabled={_.isEmpty(dirtyFields) || !isValid}
						type="submit"
					>
						{t('NOTIFICATIONS.SAVE')}
					</Button>
				</div>
			</form>
		</div>
	);
}

export default NotificationsTabView;
