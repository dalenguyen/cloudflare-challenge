import { Component } from '@angular/core';

import { AnalogWelcomeComponent } from './analog-welcome.component';

@Component({
  selector: 'ai-home',
  standalone: true,
  imports: [AnalogWelcomeComponent],
  template: `
     <ai-analog-welcome/>
  `,
})
export default class HomeComponent {
}
