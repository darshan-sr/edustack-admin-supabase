// types.ts
export interface Department {
  department_id: string;
  department_name: string;
}

// API response type
export interface ApiResponse<T> {
  data?: T;
  error?: Error;
}

export interface Faculty {
  faculty_id: number;
  faculty_name: string;
  faculty_email: string;
  faculty_designation: string;
  faculty_department: string;
}
