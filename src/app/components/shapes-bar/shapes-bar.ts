import { Component, inject, input, output } from '@angular/core';
import { ShapeSelection } from '../../services/shape-selection';
import { BaseShape } from '../../models/concreteClasses/base-shape';
import { CircleShape } from '../../models/concreteClasses/circle-shape';
import { RectangleShape } from '../../models/concreteClasses/rectangle-shape';
import { EllipseShape } from '../../models/concreteClasses/ellipse-shape';
import { PolygonShape } from '../../models/concreteClasses/polygon-shape';
import { LineShape } from '../../models/concreteClasses/line-shape';
import { SquareShape } from '../../models/concreteClasses/square-shape';

@Component({
  selector: 'app-shapes-bar',
  imports: [],
  templateUrl: './shapes-bar.html',
  styleUrl: './shapes-bar.css',
})
export class ShapesBar {
  private shapeService = inject(ShapeSelection);

  private createShape(shapeName: string): BaseShape | null {
    console.log('Creating shape:', shapeName);
    switch (shapeName) {
      case 'circle':
        return new CircleShape({ cx: 0, cy: 0, r: 50, type: 'circle', id: '', shapeStyles: {} });
      case 'rectangle':
        return new RectangleShape({ x: 0, y: 0, width: 100, height: 50, type: 'rectangle', id: '', shapeStyles: {} });
      case 'ellipse':
        return new EllipseShape({ cx: 0, cy: 0, rx: 50, ry: 30, type: 'ellipse', id: '', shapeStyles: {} });
      case 'square':
        return new SquareShape({ x: 0, y: 0, width: 50, height: 50, type: 'square', id: '', shapeStyles: {} });
      case 'triangle':
        return new PolygonShape({ points: [{x : 0,y :100}, {x: 50,y:0}, {x: 100,y:100}], type: 'triangle', id: '', shapeStyles: {} });
      case 'line':
        return new LineShape({ x1: 0, y1: 0, x2: 100, y2: 100, type: 'line', id: '', shapeStyles: {} });
      default:
        return null;
    }
  }

  onClick(shapeName: string) {
    const shape = this.createShape(shapeName);
    this.shapeService.setSelectedShape(shape);
    console.log('Selected shape:', shapeName, shape);
  }

  isSelected(shapeName: string): boolean {
    const selected = this.shapeService.selectedShape();
    return selected ? selected.type === shapeName : false;
  }
}
