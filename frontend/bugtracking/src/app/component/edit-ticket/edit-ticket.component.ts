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
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
  selector: 'app-edit-ticket',
  standalone: true,
  imports: [RouterModule, CommonModule, FontAwesomeModule, FormsModule],
  templateUrl: './edit-ticket.component.html',
  styleUrls: [
    './edit-ticket.component.css',
    '../assign-ticket/assign-ticket.component.css',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class EditTicketComponent implements OnInit {
  @ViewChild('textArea') textArea!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('dropdown', { static: true }) dropdown!: ElementRef;
  @ViewChild('dropdown2', { static: true }) dropdown2!: ElementRef;
  @ViewChild('dropdown3', { static: true }) dropdown3!: ElementRef;
  @ViewChild('screenshot') inputHidden!: ElementRef<HTMLInputElement>;
  @ViewChild('imgArea') imgArea!: ElementRef<HTMLElement>;
  @ViewChild('modal') modal!: ElementRef<HTMLElement>;
  faCloudArrowUp = faCloudArrowUp;
  faXmark = faXmark;
  faArrowLeft = faArrowLeft;
  modules!: Module[];
  status = ['OPEN', 'IN_PROGRESS', 'CLOSED'];
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
  buttonText: string = 'Update Image';
  selectedOption: string = 'Select Developer';
  selectedOption2: string = 'Select Module';
  selectedOption3: string = 'Select Module';
  isDropdownVisible: boolean = false;
  isDropdown2Visible: boolean = false;
  isDropdown3Visible: boolean = false;
  previousSelectedOption: string = 'Select Developer';
  imageUploaded: boolean = true;
  uploadedImageSrc: string | null = null;
  assignToLowest = false;
  users!: User[];
  currUser!: User;
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
  ticketId!: number;
  image: File | null = null;
  from: string = 'my-tickets';

  constructor(
    private userService: UserService,
    private moduleService: ModuleService,
    private ticketService: TicketService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
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
  toggleDropdown3(): void {
    this.isDropdown3Visible = !this.isDropdown3Visible;
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
  }
  selectOption3(option: string): void {
    this.selectedOption3 = option;
    this.isDropdown3Visible = false;
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
    if (
      this.isDropdown3Visible &&
      !this.dropdown3.nativeElement.contains(event.target)
    ) {
      this.isDropdown3Visible = false;
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
        this.imageUploaded = true;
        this.uploadedImageSrc = reader.result as string;
      };
      reader.readAsDataURL(image);
    }
  }

  removeImage(): void {
    this.buttonText = 'Select Image';
    this.imageUploaded = false;
    this.uploadedImageSrc = null;
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

  initializeForm(): void {
    this.userService
      .getUserById(parseInt(this.ticketData.assignedTo))
      .then((response) => {
        this.selectedOption = response.name || 'Select Developer';
      })
      .catch((err) => {
        console.log('Error fetching assigned user');
        throw err;
      });
    this.moduleService
      .getModuleById(parseInt(this.ticketData.module))
      .then((response) => {
        this.selectedOption2 = response.name || 'Select Module';
      })
      .catch((err) => {
        console.log('Error fetching assigned user');
      });
    this.selectedOption3 = this.ticketData.status;
    this.imageUploaded = !!this.ticketData.bugImage;
    if (this.ticketData.bugImage) {
      this.uploadedImageSrc = this.ticketData.bugImage;
    }
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['ticketId']) {
        this.ticketId = parseInt(JSON.parse(params['ticketId']));
      }
      this.from = params['from'] || 'my-tickets';
    });
    this.ticketService.getById(this.ticketId).then((response) => {
      this.ticketData = response;
      this.initializeForm();
    });

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

  submitTicket(): void {
    this.ticketData.createdBy = this.currUser.id.toString();
    this.ticketData.module = this.selectedOption2;
    this.ticketData.status = this.selectedOption3;
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
    const selectedModule = this.modules.find(
      (module) => module.name === this.selectedOption2
    );
    if (selectedModule) {
      this.ticketData['module'] = selectedModule.id.toString();
    } else {
      console.error('No user selected for assignment');
      return;
    }
    formData.append('module', this.ticketData.module);
    formData.append('assignedTo', this.ticketData.assignedTo);
    formData.append('createdBy', this.ticketData.createdBy);
    formData.append('status', this.ticketData.status);
    if (this.image) {
      formData.append('file', this.image);
    }
    console.log('Ticket Data:', this.ticketData.id);
    this.ticketService
      .updateTicket(this.ticketData.id, formData)
      .then((data) => {
        this.router.navigate([`/dashboard/${this.from}`]);
      })
      .catch((error) => {
        console.error('Error assigning ticket', error);
      });
  }

  goBack(): void {
    this.router.navigate([`/dashboard/${this.from}`]);
  }
}
