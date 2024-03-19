import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploadComponentComponent } from './file-upload-component.component';

describe('FileUploadComponentComponent', () => {
  let component: FileUploadComponentComponent;
  let fixture: ComponentFixture<FileUploadComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FileUploadComponentComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploadComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add files', () => {
    const files: FileList = {
      length: 2,
      item: (index: number) => ({
        name: `file${index + 1}.txt`,
        size: 1000,
      }),
    } as any;

    component.onFileSelected({ target: { files } });

    expect(component.files.length).toBe(2);
    expect(component.files[0].name).toBe('file1.txt');
    expect(component.files[1].name).toBe('file2.txt');
  });

  it('should remove file', () => {
    component.files = [
      new File(['file1 content'], 'file1.txt'),
      new File(['file2 content'], 'file2.txt'),
    ];
    component.progress = [0, 0];

    component.removeFile(1);

    expect(component.files.length).toBe(1);
    expect(component.files[0].name).toBe('file1.txt');
    expect(component.progress.length).toBe(1);
  });

  it('should upload files', () => {
    spyOn(component['http'], 'post').and.returnValue({
      subscribe: (callback: (event: any) => void) => {
        callback({ type: 1, loaded: 100, total: 200 }); // simulate progress event
        callback({ type: 4 }); // simulate upload complete event
      },
    });

    component.files = [new File(['file1 content'], 'file1.txt')];
    component.progress = [0];

    component.uploadFiles();

    expect(component['http'].post).toHaveBeenCalledOnceWith(
      'YOUR_UPLOAD_ENDPOINT',
      jasmine.any(FormData),
      { reportProgress: true, observe: 'events' }
    );
    expect(component.progress[0]).toBe(50); // 100 loaded out of 200 total
  });
});
