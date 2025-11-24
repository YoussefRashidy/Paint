import { Injectable, signal, WritableSignal } from '@angular/core';
import { BaseShape } from '../models/concreteClasses/base-shape';
import Konva from 'konva';


@Injectable({
  providedIn: 'root',
})
export class ShapeSelection {
  selectedShape: WritableSignal<BaseShape | null> = signal<BaseShape | null>(null);
  isDrawing: WritableSignal<boolean> = signal<boolean>(false);
  selectedKonvaShape: WritableSignal<Konva.Shape | null> = signal<Konva.Shape | null>(null);

  get currentStyles() {
    const shape = this.selectedShape();
    return shape ? shape.shapeStyles : {};
  }

  setSelectedShape(shape: BaseShape | null) {
    this.selectedShape.set(shape);
  }

  setIsDrawing(drawing: boolean) {
    this.isDrawing.set(drawing);
    console.log("isDrawing set to:", drawing);
  }
  getIsDrawing() {
    return this.isDrawing();
  }

  getKonvaShape() {
    return this.selectedKonvaShape();
  }

  setKonvaShape(shape: Konva.Shape | null) {
    this.selectedKonvaShape.set(shape)
  }

}
