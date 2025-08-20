import * as yup from 'yup';
const emailRegex = /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const firstNameRegex = /^[A-Za-z\s]+$/;
const lastNameRegex = /^[A-Za-z\s]*$/;
const firstNameSpaceCheck = /^[^\s].*$/;

//----------------------------- Check Validation ---------------------//
export const checkValidation = async (validationSchema, val) => {
	let validationErrors = {};
	try {
		await validationSchema.validate(val, { abortEarly: false });
		return { isError: false, errorObject: {} };
	} catch (err) {
		validationErrors = err.inner.reduce((acc, err) => {
			return { ...acc, [err.path]: err.message };
		}, {});

		return { isError: true, errorObject: validationErrors };
	}
};

//------------------------------ registration schema ------------------------------//
export const registrationSchema = yup.object().shape({
	email: yup
		.string()
		.email()
		.matches(emailRegex, 'Please enter a valid Email ID')
		.required('Please enter a valid Email ID'),
	firstName: yup
		.string()
		.matches(firstNameRegex, 'Your first name cannot have numbers or special characters.')
		.matches(firstNameSpaceCheck, 'Your first name cannot start with spaces.')
		.required('Please enter your first name.'),
	lastName: yup
		.string()
		.matches(lastNameRegex, 'Your last name cannot have numbers or special characters.'),
	password: yup
		.string()
		.required()
		.min(8, 'Password must be at least 8 characters.')
		.matches(/(?=.*[0-9])/, 'Password must contain a number.')
		.matches(/(?=.*[!@#$%^&*])/, 'Password must contain a special character.')
});

//------------------- login Schema ---------------------------//
export const loginSchema = yup.object().shape({
	email: yup
		.string()
		.email()
		.matches(emailRegex, 'Please enter a valid Email ID.')
		.required('Please enter your email ID.'),
	password: yup.string().required('Please enter your password.')
});

//------------------- Entry Schema ---------------------------//
export const entrySchema = yup.object().shape({
	email: yup
		.string()
		.email()
		.matches(emailRegex, 'Please enter a valid email ID.')
		.required('Please enter your email ID.')
});

export const forgotPasswordSchema = yup.object().shape({
	email: yup
		.string()
		.email()
		.matches(emailRegex, 'Please enter a valid email ID.')
		.required('Please enter your registered email ID.')
});

export const resetPasswordSchema = yup.object().shape({
	newPassword: yup
		.string()
		.required()
		.min(8, 'Password must be at least 8 characters')
		.matches(/(?=.*[0-9])/, 'Password must contain a number')
		.matches(/(?=.*[!@#$%^&*])/, 'Password must contain a special character')
});

export const updatePasswordSchema = yup.object().shape({});
