import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-debug',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.scss']
})
export class DebugComponent {
  results = [
    {
      rank: 1,
      score: 8.45,
      doc: 'Company_Handbook.pdf',
      page: 12,
      preview: 'The internship duration is typically 3 to 6 months...'
    },
    {
      rank: 2,
      score: 12.31,
      doc: 'HR_Policies.pdf',
      page: 8,
      preview: 'Internship period may be extended based on performance...'
    }
  ];
}
