import {Component, input} from '@angular/core';

@Component({
  selector: 'app-shapes-bar',
  imports: [],
  templateUrl: './shapes-bar.html',
  styleUrl: './shapes-bar.css',
})
export class ShapesBar {
    shape = input<string>('');
    selectedShape: string = '';

    onClick(shapeName: string) {
      this.selectedShape = shapeName;
      console.log('Selected shape:', shapeName);
    }

    isSelected(shapeName: string): boolean {
      return this.selectedShape === shapeName;
    }
}
