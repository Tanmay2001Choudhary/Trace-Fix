import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root',
})
export class ModuleService {
  private url = `${environment.url}/modules`;
  constructor() {}

  async getModuleById(id: number) {
    try {
          const response = await axios
              .get(`${this.url}/${id}`, {
                  withCredentials: true,
              });
          return response.data;
      } catch (err) {
          console.error('Error fetching all tickets', err);
          throw err;
      }
  }
  async getAllModules() {
    try {
          const response = await axios
              .get(`${this.url}/all-modules`, {
                  withCredentials: true,
              });
          return response.data;
      } catch (err) {
          console.error('Error fetching all modules', err);
          throw err;
      }
  }
  async createModule(moduleName:string) {
    try {
          const response = await axios.post(
            `${this.url}/create-module`,
            moduleName,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
              withCredentials: true,
            }
          );
          return response.data;
      } catch (error) {
          console.error('Error assigning ticket', error);
          throw error;
      }
  }

  deleteTicket(id: number) {
    return axios
      .delete(`${this.url}/delete/${id}`, { withCredentials: true })
      .then(() => {
        console.log('Ticket deleted successfully');
        alert('Ticket deleted successfully');
      })
      .catch((error) => {
        console.error('Error deleting ticket', error);
        alert('Failed to delete ticket. Please try again.');
        throw error;
      });
  }
}
