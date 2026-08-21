import {
  Component,
  ElementRef,
  ViewChild,
  output,
  signal,
  OnInit
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import { LanguageService } from '../../core/services/language';

import { ProfileService } from '../../core/services/profile';

@Component({
  selector: 'app-post-composer',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './post-composer.html',
  styleUrl: './post-composer.css'
})
export class PostComposer implements OnInit {

  @ViewChild('fileInput')
  fileInput!: ElementRef<HTMLInputElement>;


  text = '';


  attachedType =
    signal<'image' | 'video' | null>(
      null
    );


  attachedPreviewUrl =
    signal<string | null>(
      null
    );


  rawFile: File | null = null;


  initials =
    signal<string>('..');


  profilePicture =
    signal<string | null>(
      null
    );


  postCreated =
    output<{
      text?: string;
      file?: File;
    }>();


  constructor(
    public lang: LanguageService,
    private profileService: ProfileService
  ) {}


  ngOnInit(): void {

    this.profileService
      .getMyProfile()
      .subscribe({

        next: (res) => {

          this.initials.set(
            (
              res.firstName.charAt(0) +
              res.lastName.charAt(0)
            ).toUpperCase()
          );


          this.profilePicture.set(
            res.profilePicture ?? null
          );

        }

      });

  }


  getProfileImageUrl(): string | null {

    const picture =
      this.profilePicture();


    if (!picture) {
      return null;
    }


    return picture.startsWith('http')
      ? picture
      : `http://localhost:9090${picture}`;

  }


  openFilePicker(): void {

    this.fileInput
      .nativeElement
      .click();

  }


  onFileSelected(event: Event): void {

    const input =
      event.target as HTMLInputElement;


    const file =
      input.files?.[0];


    if (!file) {
      return;
    }


    this.rawFile = file;


    this.attachedType.set(
      file.type.startsWith('video')
        ? 'video'
        : 'image'
    );


    this.attachedPreviewUrl.set(
      URL.createObjectURL(file)
    );

  }


  removeAttachment(): void {

    this.attachedType.set(null);

    this.attachedPreviewUrl.set(null);

    this.rawFile = null;


    if (this.fileInput) {

      this.fileInput.nativeElement.value = '';

    }

  }


  submit(): void {

    const trimmed =
      this.text.trim();


    if (
      !trimmed &&
      !this.rawFile
    ) {

      return;

    }


    this.postCreated.emit({

      text:
        trimmed || undefined,

      file:
        this.rawFile || undefined

    });


    this.text = '';

    this.removeAttachment();

  }

}