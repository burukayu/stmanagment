export interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  owner: number;
  owner_username: number;
  created_at: string;
  last_updated_by_username?: string;
  updated_at: string;
}

export interface User {
  username: string;
  role: string;
}
export interface UsersI {
  username: string;
  id: number;
  role: string;
  email: string; 
  is_superuser:boolean;
  is_staff:boolean
}
