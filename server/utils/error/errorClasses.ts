export class AppError extends Error {
    public code: number;
  
    constructor(code: number, message: string) {
      // 1. Initialize the built-in Error 
      super(message);
      // 2. Save the custom error code
      this.code = code;
      // 3. Restore prototype chain for instanceof to work
      Object.setPrototypeOf(this, AppError.prototype);
      // 4. Assign a custom name (optional, but useful)
      this.name = 'AppError';
    }
  }
export class ValidationError extends Error {

  public errors:ValidationErrorItem[]
  
    constructor(errors:ValidationErrorItem[],message:string) {
   super(message)
   this.errors = errors;
   
    }
  }

  export type ValidationErrorItem = {
    field: string;
    message: string;
    value?:any
  }