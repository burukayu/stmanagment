export interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  owner: number;
  created_at: string;
}

export interface User {
  username: string;
  role: string;
}
