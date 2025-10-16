import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-star-btn',
  imports: [],
  templateUrl: './star-btn.html',
  styleUrl: './star-btn.css'
})
export class StarBtn {
  selected = input<boolean>(false);
  disabled = input<boolean>(false);

  clickPhoto = output<Event>();

  onClick(event: Event) {
    this.clickPhoto.emit(event);
  }
}
