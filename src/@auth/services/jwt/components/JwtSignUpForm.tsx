import { Controller, useForm } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Button from '@mui/material/Button';
import _ from 'lodash';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from '@fuse/core/Link';
import useJwtAuth from '../useJwtAuth';

/**
 * Form Validation Schema
 */
const schema = z
	.object({
		displayName: z.string().nonempty('You must enter your name'),
		email: z.string().email('You must enter a valid email').nonempty('You must enter an email'),
		password: z
			.string()
			.nonempty('Please enter your password.')
			.min(8, 'Password is too short - should be 8 chars minimum.'),
		passwordConfirm: z.string().nonempty('Password confirmation is required')
	})
	.refine((data) => data.password === data.passwordConfirm, {
		message: 'Passwords must match',
		path: ['passwordConfirm']
	});

type FormType = z.infer<typeof schema>;

const defaultValues = {
	displayName: '',
	email: '',
	password: '',
	passwordConfirm: ''
};

function JwtSignUpForm() {
	const { signUp } = useJwtAuth();

	const { control, formState, handleSubmit, setError } = useForm<FormType>({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	function onSubmit(formData: FormType) {
		const { displayName, email, password } = formData;
		signUp({
			displayName,
			password,
			email
		})
			.then(() => {
				// No need to do anything, registered user data will be set at app/auth/AuthRouteProvider
			})
			.catch((error) => {
				const errorData = error?.data as {
					type: 'email' | 'password' | `root.${string}` | 'root';
					message: string;
				}[];

				errorData?.forEach?.(({ message, type }) => {
					setError(type, { type: 'manual', message });
				});
			});
	}

	return (
		<form
			name="registerForm"
			noValidate
			className="flex w-full flex-col justify-center gap-6"
			onSubmit={handleSubmit(onSubmit)}
		>
			<Controller
				name="displayName"
				control={control}
				render={({ field }) => (
					<FormControl className="space-y-2">
						<FormLabel
							className="text-sm font-semibold text-slate-600 dark:text-slate-200"
							htmlFor="displayName"
						>
							Full name
						</FormLabel>
						<TextField
							{...field}
							autoFocus
							type="text"
							error={!!errors.displayName}
							helperText={errors?.displayName?.message}
							required
							fullWidth
							placeholder="Theroom Manager"
							autoComplete="name"
							InputProps={{
								className: 'rounded-2xl'
							}}
						/>
					</FormControl>
				)}
			/>

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
							autoComplete="new-password"
							InputProps={{
								className: 'rounded-2xl'
							}}
						/>
					</FormControl>
				)}
			/>

			<Controller
				name="passwordConfirm"
				control={control}
				render={({ field }) => (
					<FormControl className="space-y-2">
						<FormLabel
							className="text-sm font-semibold text-slate-600 dark:text-slate-200"
							htmlFor="passwordConfirm"
						>
							Confirm password
						</FormLabel>
						<TextField
							{...field}
							type="password"
							error={!!errors.passwordConfirm}
							helperText={errors?.passwordConfirm?.message}
							required
							fullWidth
							placeholder="••••••••"
							autoComplete="new-password"
							InputProps={{
								className: 'rounded-2xl'
							}}
						/>
					</FormControl>
				)}
			/>

			<Button
				variant="contained"
				color="secondary"
				className="focus-visible:ring-primary w-full rounded-2xl py-3 text-base font-semibold shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none dark:focus-visible:ring-offset-slate-900"
				aria-label="Register"
				disabled={_.isEmpty(dirtyFields) || !isValid}
				type="submit"
				size="large"
			>
				Create account
			</Button>

			<div className="flex flex-wrap items-center justify-between gap-2 pt-4 text-sm font-medium text-slate-600 dark:text-slate-300">
				<span>Already have an account?</span>
				<Link
					className="text-primary hover:text-primary/80 transition-colors duration-200"
					to="/sign-in"
				>
					Sign in
				</Link>
			</div>
		</form>
	);
}

export default JwtSignUpForm;
