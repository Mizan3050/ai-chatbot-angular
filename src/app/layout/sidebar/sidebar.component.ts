import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports:[
    RouterLink,
    RouterLinkActive
  ]
})
export class SidebarComponent {
  @Input() active = 'upload';

  menuItems = [
    { key: 'upload', label: 'Upload', icon: 'upload' },
    { key: 'chat', label: 'Chat', icon: 'chat' },
    { key: 'sources', label: 'Sources', icon: 'description' }
  ];
}
