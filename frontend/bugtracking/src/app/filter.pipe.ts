import { Pipe, PipeTransform } from '@angular/core';
import { User } from './models/user.model';

@Pipe({
  name: 'filter',
  standalone: true,
})
export class FilterPipe implements PipeTransform {
  transform(users: User[], searchText: string): User[] {
    if (!users || !searchText) {
      return users;
    }
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchText.toLowerCase()) ||
        user.role.toLowerCase().includes(searchText.toLowerCase())
    );
  }
}
