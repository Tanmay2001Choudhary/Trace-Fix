import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../environment';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  private url = `${environment.url}/tickets`;
  constructor(private toastService: ToastService) {}

  async getById(id: number) {
    try {
      const response = await axios.get(`${this.url}/${id}`, {
        withCredentials: true,
      });
      this.toastService.show('Ticket Fetched Successfully', 'success');
      return response.data;
    } catch (err) {
      this.toastService.show('Error fetching ticket', 'error');
      throw err;
    }
  }
  async getAllTickets() {
    try {
      const response = await axios.get(`${this.url}/all-tickets`, {
        withCredentials: true,
      });
      this.toastService.show('Tickets Fetched Successfully', 'success');
      return response.data;
    } catch (err) {
      this.toastService.show('Error fetching ticket', 'error');
      console.error('Error fetching all tickets', err);
      throw err;
    }
  }
  async assignTicket(formData: FormData) {
    try {
      const response = await axios.post(`${this.url}/assignTicket`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      this.toastService.show('Ticket Assigned Successfully', 'success');
      return response.data;
    } catch (error) {
      this.toastService.show('Error assigning ticket', 'error');
      throw error;
    }
  }

  async updateTicket(id: number, formData: FormData) {
    try {
      const response = await axios.put(`${this.url}/update/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      this.toastService.show('Ticket Updated Successfully', 'success');
      return response.data;
    } catch (error) {
      this.toastService.show('Error updating ticket', 'error');
      throw error;
    }
  }

  async deleteTicket(id: number) {
    try {
      await axios.delete(`${this.url}/delete/${id}`, { withCredentials: true });
      this.toastService.show('Ticket Deleted Successfully', 'success');
    } catch (error) {
      this.toastService.show('Error deleting ticket', 'error');
      throw error;
    }
  }
}
