import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  files: File[] = [];
  progress: number[] = [];

  constructor(private http: HttpClient) {}

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      this.files.push(files.item(i)!);
      this.progress.push(0);
    }
  }

  uploadFiles() {
    this.files.forEach((file, index) => {
      const formData = new FormData();
      formData.append('file', file);

      this.http
        .post('YOUR_UPLOAD_ENDPOINT', formData, {
          reportProgress: true,
          observe: 'events',
        })
        .subscribe((event) => {
          if (event.type === 1 && event.total) {
            // Upload progress event
            this.progress[index] = Math.round(
              (100 * event.loaded) / event.total
            );
          } else if (event.type === 4) {
            // Upload complete
            console.log('File uploaded:', file);
          }
        });
    });
  }
  clearFiles() {
    this.files = [];
    this.progress = [];
    this.fileInput.nativeElement.value = '';
  }

  removeFile(index: number) {
    this.files.splice(index, 1);
    this.progress.splice(index, 1);
  }
}
