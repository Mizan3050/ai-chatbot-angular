import { HttpClient } from '@angular/common/http';
import { Component, inject, signal, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of, tap } from 'rxjs';
import { enviroment } from '../../../environment/evironment.prod';

interface Document {
  name: string;
  size: number
}

interface DocumentList {
  documents: Array<Document>
}

@Component({
  selector: 'app-sources',
  standalone: true,
  templateUrl: './sources.component.html',
  styleUrls: ['./sources.component.scss']
})
export class SourcesComponent {

  private apiUrl = enviroment.apiUrl;

  isUploading = signal(true);
  rows = [
    { page: 12, preview: 'The internship duration is typically 3 to 6 months...', score: 0.92 },
    { page: 15, preview: 'Interns are eligible for sick leave...', score: 0.89 }
  ];

  private http = inject(HttpClient);

  // Convert the Observable to a Signal
  sources: Signal<DocumentList> = toSignal(this.http.get<DocumentList>(`${this.apiUrl}/documents`).pipe(
    tap(() => {
      this.isUploading.set(false)
    }),
    catchError(() => {
      this.isUploading.set(false)
      return of([] as unknown as DocumentList)
    })
  ), { initialValue: {documents: []} as unknown as DocumentList });

  downloadPdf(fileName: string) {
    const encodedFilename = encodeURIComponent(fileName);
    return this.http.get(`${this.apiUrl}/documents/${encodedFilename}`, {
      responseType: 'blob'
    })
  }

onPreview(filename: string) {
  this.downloadPdf(filename).subscribe((blob) => {
    const url = window.URL.createObjectURL(blob);
    window.open(url, '_blank');
  });
}
}
