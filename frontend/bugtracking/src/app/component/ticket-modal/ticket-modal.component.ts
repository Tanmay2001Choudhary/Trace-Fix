import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Ticket } from '../../models/tickets.model';
import { User } from '../../models/user.model';
import { TicketService } from '../../services/ticket.service';
import { UserService } from '../../services/user.service';
import { LogoutComponent } from '../logout/logout.component';

@Component({
  selector: 'app-ticket-modal',
  standalone: true,
  imports: [CommonModule, LogoutComponent, FontAwesomeModule, RouterModule],
  templateUrl: './ticket-modal.component.html',
  styleUrl: './ticket-modal.component.css',
})
export class TicketModalComponent implements OnInit {
  @Input() ticket: Ticket | any;
  @Output() closeModal = new EventEmitter<void>();
  @ViewChild('modal') modal!: ElementRef<HTMLElement>;
  assignedTo!: User;
  createdBy!: User;
  selectedTicketId!: number;
  selectedTicket: any = null;
  showModal = false;
  faXmark = faXmark;

  close() {
    this.closeModal.emit();
  }
  constructor(
    private userService: UserService,
    private ticketService: TicketService
  ) {}
  ngOnInit() {
    this.userService
      .getUserById(Number(this.ticket.assignedTo))
      .then((user) => {
        this.assignedTo = user;
      })
      .catch((err) => {
        console.log('Error Fetching assigned Developer', err);
      });
    this.userService
      .getUserById(Number(this.ticket.createdBy))
      .then((user) => {
        this.createdBy = user;
      })
      .catch((err) => {
        console.log('Error Fetching assigned Developer', err);
      });
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'open':
        return 'open';
      case 'in progress':
        return 'in-progress';
      case 'resolved':
        return 'resolved';
      case 'closed':
        return 'closed';
      case 'cancelled':
        return 'cancelled';
      case 'on hold':
        return 'on-hold';
      default:
        return '';
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority.toLowerCase()) {
      case 'low':
        return 'low';
      case 'medium':
        return 'medium';
      case 'high':
        return 'high';
      case 'critical':
        return 'critical';
      default:
        return '';
    }
  }

  delete(id: number) {
    this.selectedTicketId = id;
    this.showModal = true;
  }

  deleteTicket(id: number) {
    this.ticketService.deleteTicket(id);
    this.closeDeleteModal();
    this.close();
  }

  closeDeleteTicket() {
    this.selectedTicket = null;
  }

  closeDeleteModalOnOverlay(event: MouseEvent) {
    this.closeDeleteModal();
  }

  openModal() {
    this.showModal = true;
  }

  closeDeleteModal() {
    this.showModal = false;
  }

  closeBugImageModal(): void {
    if (this.modal) {
      this.modal.nativeElement.classList.remove('active');
    }
  }

  onImageClick(event: Event): void {
    if (this.modal) {
      this.modal.nativeElement.classList.add('active');
    }
  }
}
