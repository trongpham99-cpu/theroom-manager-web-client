'use client';
import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Link from '@fuse/core/Link';
import _ from 'lodash';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import FormLabel from '@mui/material/FormLabel';

/**
 * Form Validation Schema
 */
const schema = z.object({
	email: z.string().email('You must enter a valid email').nonempty('You must enter an email'),
	password: z
		.string()
		.min(8, 'Password is too short - must be at least 8 chars.')
		.nonempty('Please enter your password.'),
	remember: z.boolean().optional()
});

type FormType = z.infer<typeof schema>;

const defaultValues = {
	email: '',
	password: '',
	remember: true
};

function SignInPageForm() {
	const { control, formState, handleSubmit, reset } = useForm<FormType>({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	function onSubmit() {
		reset(defaultValues);
	}

	return (
		<form
			name="loginForm"
			noValidate
			className="flex w-full flex-col justify-center gap-6"
			onSubmit={handleSubmit(onSubmit)}
		>
			<Controller
				name="email"
				control={control}
				render={({ field }) => (
					<FormControl className="space-y-2">
						<FormLabel
							className="text-sm font-semibold text-slate-600 dark:text-slate-200"
							htmlFor="email"
						>
							Email address
						</FormLabel>
						<TextField
							{...field}
							autoFocus
							type="email"
							error={!!errors.email}
							helperText={errors?.email?.message}
							required
							fullWidth
							placeholder="name@company.com"
							autoComplete="email"
							InputProps={{
								className: 'rounded-2xl'
							}}
						/>
					</FormControl>
				)}
			/>

			<Controller
				name="password"
				control={control}
				render={({ field }) => (
					<FormControl className="space-y-2">
						<FormLabel
							className="text-sm font-semibold text-slate-600 dark:text-slate-200"
							htmlFor="password"
						>
							Password
						</FormLabel>
						<TextField
							{...field}
							type="password"
							error={!!errors.password}
							helperText={errors?.password?.message}
							required
							fullWidth
							placeholder="••••••••"
							autoComplete="current-password"
							InputProps={{
								className: 'rounded-2xl'
							}}
						/>
					</FormControl>
				)}
			/>

			<div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
				<Controller
					name="remember"
					control={control}
					render={({ field }) => (
						<FormControl>
							<FormControlLabel
								className="text-sm font-medium text-slate-600 dark:text-slate-200"
								label="Remember me"
								control={
									<Checkbox
										size="small"
										{...field}
									/>
								}
							/>
						</FormControl>
					)}
				/>

				<Link
					className="text-primary hover:text-primary/80 text-sm font-semibold transition-colors duration-200"
					to="/pages/auth/forgot-password"
				>
					Forgot password?
				</Link>
			</div>

			<Button
				variant="contained"
				color="secondary"
				className="focus-visible:ring-primary w-full rounded-2xl py-3 text-base font-semibold shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none dark:focus-visible:ring-offset-slate-900"
				aria-label="Sign in"
				disabled={_.isEmpty(dirtyFields) || !isValid}
				type="submit"
				size="large"
			>
				Sign in
			</Button>

			<div className="flex flex-wrap items-center justify-between gap-2 pt-6 text-sm font-medium text-slate-600 dark:text-slate-300">
				<span>Don't have an account?</span>
				<Link
					className="text-primary hover:text-primary/80 transition-colors duration-200"
					to="/sign-up"
				>
					Sign up
				</Link>
			</div>
		</form>
	);
}

export default SignInPageForm;
