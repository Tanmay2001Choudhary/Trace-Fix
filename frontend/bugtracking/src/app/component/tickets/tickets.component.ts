import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule,Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faPen } from '@fortawesome/free-solid-svg-icons';
import { Ticket } from '../../models/tickets.model';
import { TicketService } from '../../services/ticket.service';
import { UserService } from '../../services/user.service';
import { LogoutComponent } from '../logout/logout.component';
import { TicketModalComponent } from '../ticket-modal/ticket-modal.component';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [
    TicketModalComponent,
    CommonModule,
    RouterModule,
    FontAwesomeModule,
    LogoutComponent,
  ],
  templateUrl: './tickets.component.html',
  styleUrl: './tickets.component.css',
})
export class TicketsComponent implements OnInit {
  faEye = faEye;
  faPen = faPen;
  tickets!: Ticket[];
  userNames: { [key: string]: string } = {};
  selectedTicketId!: number;
  selectedTicket: any = null;
  showModal = false;

  constructor(
    private ticketService: TicketService,
    private userService: UserService,private router:Router
  ) {}

  ngOnInit(): void {
    this.ticketService
      .getAllTickets()
      .then((response) => {
        this.tickets = response;
        this.fetchUserNames();
      })
      .catch((err) => {
        console.error('Error fetching tickets', err);
      });
  }

  fetchUserNames() {
    const uniqueUserIds = Array.from(
      new Set(this.tickets.map((ticket) => ticket.createdBy))
    );
    uniqueUserIds.forEach((userId) => {
      this.userService.getUserById(Number(userId)).then((user) => {
        this.userNames[userId] = user.name;
      });
    });
  }
  getUserName(userId: string): string {
    return this.userNames[userId] || 'Unknown';
  }
  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'open':
        return 'open';
      case 'in progress':
        return 'in-progress';
      case 'closed':
        return 'closed';
      case 'on hold':
        return 'on-hold';
      default:
        return '';
    }
  }

  viewTicket(ticket: any) {
    this.selectedTicket = ticket;
  }

  delete(id: number) {
    this.selectedTicketId = id;
    this.showModal = true;
  }

  deleteTicket(id: number) {
    this.ticketService.deleteTicket(id).then(() => {
      this.tickets = this.tickets.filter((t) => t.id !== id);
    });
    this.closeModal();
  }

  closeTicket() {
    this.selectedTicket = null;
  }

  closeModalOnOverlay(event: MouseEvent) {
    this.closeModal();
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }
}
