import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowLeft,
  faCloudArrowUp,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { Module } from '../../models/module.model';
import { Ticket } from '../../models/tickets.model';
import { User } from '../../models/user.model';
import { ModuleService } from '../../services/module.service';
import { TicketService } from '../../services/ticket.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-assign-ticket',
  standalone: true,
  imports: [RouterModule, CommonModule, FontAwesomeModule, FormsModule],
  templateUrl: './assign-ticket.component.html',
  styleUrl: './assign-ticket.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class AssignTicketComponent implements OnInit {
  @ViewChild('textArea') textArea!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('dropdown', { static: true }) dropdown!: ElementRef;
  @ViewChild('dropdown2', { static: true }) dropdown2!: ElementRef;
  @ViewChild('screenshot') inputHidden!: ElementRef<HTMLInputElement>;
  @ViewChild('imgArea') imgArea!: ElementRef<HTMLElement>;
  @ViewChild('modal') modal!: ElementRef<HTMLElement>;
  faCloudArrowUp = faCloudArrowUp;
  faXmark = faXmark;
  faArrowLeft = faArrowLeft;
  readonly fileTypes: string[] = [
    'image/apng',
    'image/bmp',
    'image/gif',
    'image/jpeg',
    'image/pjpeg',
    'image/png',
    'image/svg+xml',
    'image/tiff',
    'image/webp',
    'image/x-icon',
    'image/avif',
  ];
  buttonText: string = 'Select Image';
  selectedOption: string = 'Select Developer';
  selectedOption2: string = 'Select Module';
  isDropdownVisible: boolean = false;
  isDropdown2Visible: boolean = false;
  previousSelectedOption: string = 'Select Developer';
  imageUploaded: boolean = false;
  uploadedImageSrc: string | null = null;
  uploadedImageName: string | null = null;
  assignToLowest = false;
  users!: User[];
  currUser!: User;
  modules!: Module[];
  ticketData: Ticket = {
    id: 0,
    title: '',
    description: '',
    status: '',
    priority: '',
    createdBy: '',
    assignedTo: '',
    bugImage: '',
    module: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  image: File | null = null;
  isCustomInputVisible = false;
  customInput: string = '';

  constructor(
    private userService: UserService,
    private ticketService: TicketService,
    private moduleService: ModuleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService
      .getAllDevelopers()
      .then((users: User[]) => {
        this.users = users;
      })
      .catch((err) => {
        console.log('Error finding developers');
      });
    this.userService
      .getCurrentUser()
      .then((userData) => {
        this.currUser = userData;
      })
      .catch((error) => {
        console.error('Error loading user data:', error);
      });

    this.moduleService
      .getAllModules()
      .then((modules: Module[]) => {
        this.modules = modules;
      })
      .catch((err) => {
        console.log('Error finding developers');
      });
  }
  adjustHeight(): void {
    const textAreaElement = this.textArea.nativeElement;
    textAreaElement.style.height = '60px';
    textAreaElement.style.height = `${textAreaElement.scrollHeight}px`;
  }

  toggleDropdown(): void {
    this.isDropdownVisible = !this.isDropdownVisible;
  }
  toggleDropdown2(): void {
    this.isDropdown2Visible = !this.isDropdown2Visible;
  }

  selectOption(option: string): void {
    this.selectedOption = option;
    this.previousSelectedOption = option;
    this.isDropdownVisible = false;
    this.assignToLowest = false;
  }
  selectOption2(option: string): void {
    this.selectedOption2 = option;
    this.isDropdown2Visible = false;
    this.isCustomInputVisible = false;
    this.customInput = '';
  }

  showCustomInput() {
    this.isDropdown2Visible = false;
    this.isCustomInputVisible = true;
    this.selectedOption2 = 'Select an option';
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (
      this.isDropdownVisible &&
      !this.dropdown.nativeElement.contains(event.target)
    ) {
      this.isDropdownVisible = false;
      this.isDropdown2Visible = false;
    }
    if (
      this.isDropdown2Visible &&
      !this.dropdown2.nativeElement.contains(event.target)
    ) {
      this.isDropdown2Visible = false;
    }
  }
  onCheckboxChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedOption =
        'Developer With Lowest Assigned Ticket will be Selected';
      this.assignToLowest = true;
    } else {
      this.selectedOption = this.previousSelectedOption;
      this.assignToLowest = false;
    }
  }

  validFileType(file: File): boolean {
    return this.fileTypes.includes(file.type);
  }

  onTriggerInputClick(event?: Event): void {
    if (this.imageUploaded && event) {
      event.stopPropagation();
      return;
    }

    const inputElement = document.getElementById(
      'screenshot'
    ) as HTMLInputElement;
    inputElement?.click();
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const image = input.files[0];
      this.image = image;
      if (image.size > 2097152) {
        alert('Image size must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        this.buttonText = 'Update Image';
        this.imageUploaded = true;
        this.uploadedImageSrc = reader.result as string;
        this.uploadedImageName = image.name;
        if (this.imgArea && this.imgArea.nativeElement) {
          this.imgArea.nativeElement.setAttribute('data-title', image.name);
        }
      };
      reader.readAsDataURL(image);
    }
  }

  removeImage(): void {
    this.buttonText = 'Select Image';
    this.imageUploaded = false;
    this.uploadedImageSrc = null;
    this.uploadedImageName = null;
    this.imgArea.nativeElement.setAttribute('data-title', '');
  }

  onImageClick(event: Event): void {
    if (this.modal) {
      this.modal.nativeElement.classList.add('active');
    }
  }

  closeModal(): void {
    if (this.modal) {
      this.modal.nativeElement.classList.remove('active');
    }
  }

  submitTicket(): void {
    this.ticketData.createdBy = this.currUser.id.toString();
    this.ticketData.module = this.selectedOption2;
    const formData = new FormData();
    formData.append('title', this.ticketData.title);
    formData.append('description', this.ticketData.description);
    formData.append('priority', this.ticketData.priority);
    if (this.assignToLowest) {
      this.ticketData['assignedTo'] = 'true';
    } else {
      const selectedUser = this.users.find(
        (user) => user.name === this.selectedOption
      );
      if (selectedUser) {
        this.ticketData['assignedTo'] = selectedUser.id.toString();
      } else {
        console.error('No user selected for assignment');
        return;
      }
    }
    if (this.customInput) {
      this.ticketData['module'] = this.customInput;
    } else {
      const selectedModule = this.modules.find(
        (module) => module.name === this.selectedOption2
      );
      if (selectedModule) {
        this.ticketData['module'] = selectedModule.id.toString();
      } else {
        console.error('No module selected for assignment');
        return;
      }
    }
    formData.append('assignedTo', this.ticketData.assignedTo);
    formData.append('module', this.ticketData.module);
    formData.append('createdBy', this.ticketData.createdBy);
    if (this.image) {
      formData.append('file', this.image);
    }
    console.log('Ticket Data:', this.ticketData);
    this.ticketService
      .assignTicket(formData)
      .then((data) => {
        this.router.navigate(['/dashboard/tickets']);
      })
      .catch((error) => {
        console.error('Error assigning ticket', error);
      });
  }
}
