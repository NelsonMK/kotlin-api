export class ExtendableError extends Error {
	errors: any;
	status: any;
	isPublic: any;
	isOperational: boolean;
	constructor(
		message: any,
		errors: any,
		status: any,
		isPublic: Boolean,
		stack: any
	) {
		super(message);
		this.name = this.constructor.name;
		this.message = message;
		this.errors = errors;
		this.status = status;
		this.isPublic = isPublic;
		this.isOperational = true;
		this.stack = stack;
	}
}
