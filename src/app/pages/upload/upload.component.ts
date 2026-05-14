import { Component, inject } from '@angular/core';
import { enviroment } from '../../../environment/evironment.prod';
import { HttpClient } from '@angular/common/http';
import { signal } from '@angular/core';

interface UploadedDocument {
  file: File;
  name: string;
  size: string;
  uploadedAt: string;
  status: 'Processed' | 'Uploading' | 'Failed';
}

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {

  private apiUrl = enviroment.apiUrl;
  private http = inject(HttpClient);
  isDragging = false;

  documents = signal<UploadedDocument[]>([]);

  triggerFileInput(fileInput: HTMLInputElement) {
    fileInput.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) return;

    this.processFiles(Array.from(input.files));

    input.value = '';
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();

    this.isDragging = false;

    if (!event.dataTransfer?.files.length) return;

    this.processFiles(Array.from(event.dataTransfer.files));
  }

  processFiles(files: File[]) {

    const pdfFiles = files.filter(
      file => file.type === 'application/pdf'
    );

    if (!pdfFiles.length) return;

    const uploadedDocs: UploadedDocument[] = [];

    pdfFiles.forEach(file => {

      const doc: UploadedDocument = {
        file,
        name: file.name,
        size: this.formatFileSize(file.size),
        uploadedAt: 'Just now',
        status: 'Uploading'
      };

      uploadedDocs.push(doc);

      this.documents.update(docs => [
        doc,
        ...docs
      ]);
    });

    this.uploadFiles(uploadedDocs);
  }

  removeDocument(index: number) {
    this.documents.update(docs =>
      docs.filter((_, i) => i !== index)
    );
  }

  formatFileSize(bytes: number): string {

    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat(
      (bytes / Math.pow(k, i)).toFixed(2)
    ) + ' ' + sizes[i];
  }

  uploadFiles(docs: UploadedDocument[]) {
    const formData = new FormData();
    docs.forEach(doc => {
      formData.append(
        'files',
        doc.file,
        doc.file.name
      );
    });

    this.http.post(
      `${this.apiUrl}/upload`,
      formData
    ).subscribe({
      next: () => {
        this.documents.update(currentDocs => {
          return currentDocs.map(existingDoc => {
            const matched = docs.find(
              d => d.name === existingDoc.name
            );
            if (matched) {
              return {
                ...existingDoc,
                status: 'Processed'
              };
            }
            return existingDoc;
          });
        });
      },
      error: () => {
        this.documents.update(currentDocs => {
          return currentDocs.map(existingDoc => {
            const matched = docs.find(
              d => d.name === existingDoc.name
            );
            if (matched) {
              return {
                ...existingDoc,
                status: 'Failed'
              };
            }
            return existingDoc;
          });
        });
      }
    });
  }
}