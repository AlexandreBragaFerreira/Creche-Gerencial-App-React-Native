export type TError = {
    message?: string;
    trace?: string;
  };
  
  export type ApiError = {
    message: string;
    trace: string;
    stack: string;
  };