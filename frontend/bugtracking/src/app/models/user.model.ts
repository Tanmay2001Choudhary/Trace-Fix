import { Ticket } from './tickets.model';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  profileImage: string | null;
  assignedTickets: Ticket[];
  createdTickets: Ticket[];
}
