import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Ticket } from '../../models/tickets.model';
import { ModuleService } from '../../services/module.service';
import { TicketService } from '../../services/ticket.service';
import { UserService } from '../../services/user.service';
import { LogoutComponent } from '../logout/logout.component';
import { TicketModalComponent } from '../ticket-modal/ticket-modal.component';

@Component({
  selector: 'app-my-tickets',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CommonModule,
    FormsModule,
    TicketModalComponent,
    LogoutComponent,
  ],
  templateUrl: './my-tickets.component.html',
  styleUrl: './my-tickets.component.css',
})
export class MyTicketsComponent implements OnInit {
  isDropdownVisible: boolean = false;
  tickets: Ticket[] = [];
  assignedTickets!: Ticket[];
  createdTickets!: Ticket[];
  userNames: { [key: string]: { name: string; profileImage: string } } = {};
  moduleNames: { [key: string]: { name: string } } = {};
  dropdownVisibility: { [ticketId: number]: boolean } = {};
  showModal = false;
  selectedTicketId!: number;
  selectedTicket: any = null;

  constructor(
    private userService: UserService,
    private ticketService: TicketService,
    private moduleService: ModuleService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User ID not found in localStorage');
      }
      const tickets = await this.userService.getUserTickets(userId);
      this.assignedTickets = tickets.assignedTickets;
      this.createdTickets = tickets.createdTickets;
      this.tickets = [
        ...(this.assignedTickets ?? []),
        ...(this.createdTickets ?? []),
      ];
      this.fetchUserNames();
    } catch (error) {
      console.error('Error loading tickets:', error);
    }
  }

  fetchUserNames() {
    const uniqueUserIds = Array.from(
      new Set([
        ...this.tickets.map((ticket) => ticket.createdBy),
        ...this.tickets.map((ticket) => ticket.assignedTo),
      ])
    );
    const uniqueModuleIds = Array.from(
      new Set([...this.tickets.map((ticket) => ticket.module)])
    );
    const validUserIds = uniqueUserIds.filter(
      (id) => id !== null && id !== undefined
    );
    const validModuleIds = uniqueModuleIds.filter(
      (id) => id !== null && id !== undefined
    );
    validUserIds.forEach((userId) => {
      if (!this.userNames[userId]) {
        this.userService.getUserById(Number(userId)).then((user) => {
          this.userNames[userId] = {
            name: user.name,
            profileImage: user.profileImage,
          };
        });
      }
    });
    validModuleIds.forEach((moduleId) => {
      if (!this.moduleNames[moduleId]) {
        this.moduleService.getModuleById(Number(moduleId)).then((module) => {
          this.moduleNames[moduleId] = {
            name: module.name,
          };
        });
      }
    });
  }
  getUserName(userId: string): string {
    return this.userNames[userId]?.name || 'Unknown';
  }
  getModuleName(moduleId: string): string {
    return this.moduleNames[moduleId]?.name || 'Unknown';
  }

  getUserProfileImage(userId: string): string {
    return this.userNames[userId]?.profileImage || '';
  }

  toggleDropdown(ticketId: number): void {
    this.dropdownVisibility[ticketId] = !this.dropdownVisibility[ticketId];
  }

  closeAllDropdowns(): void {
    this.dropdownVisibility = {};
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const targetElement = event.target as HTMLElement;
    if (
      !targetElement.closest('.ticket-card-header-right') &&
      !targetElement.closest('.dropdown-menu')
    ) {
      this.closeAllDropdowns();
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
