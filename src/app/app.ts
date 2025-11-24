import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ShapesBar} from './components/shapes-bar/shapes-bar';
import {DrawingCanvas} from './components/drawing-canvas/drawing-canvas';
import { Sidebar } from './components/sidebar/sidebar';

@Component({
  selector: 'app-root',
  imports: [ShapesBar, DrawingCanvas, Sidebar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Paint');
}
