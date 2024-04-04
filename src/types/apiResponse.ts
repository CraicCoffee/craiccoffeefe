export type APIResponse<T> = {
  success?: boolean;
  data?: T;
  errorMessage?: string;
  requestId?: string;
};
