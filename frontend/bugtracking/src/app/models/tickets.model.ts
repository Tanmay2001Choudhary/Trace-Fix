export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  assignedTo: string;
  bugImage: string;
  module: string;
  [key: string]: any;
}
