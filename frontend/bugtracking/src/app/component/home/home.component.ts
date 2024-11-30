import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  activeUsers: number = 1;
  bugsFixed: number = 1;
  projectsManaged: number = 1;

  private targetUsers = 500;
  private targetBugs = 1500;
  private targetProjects = 30;

  ngOnInit(): void {
    this.startCounter('activeUsers', this.targetUsers);
    this.startCounter('bugsFixed', this.targetBugs);
    this.startCounter('projectsManaged', this.targetProjects);
  }

  startCounter(stat: string, target: number): void {
    const step = target / 100;
    const interval = setInterval(() => {
      // @ts-ignore
      if (this[stat] < target) {
        // @ts-ignore
        this[stat] = Math.ceil(this[stat] + step);
      } else {
        clearInterval(interval);
        // @ts-ignore
        this[stat] = target;
      }
    }, 50);
  }
}
