import { Injectable, inject } from '@angular/core';
import Konva from 'konva';
import { ShapeSelection } from './shape-selection';
import { ShapesLogic } from '../components/drawing-canvas/shapes-logic';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private shapeService = inject(ShapeSelection);
  private history: string[] = [];
  private step = -1;
  private shapesLogic: ShapesLogic | null = null;

  init(logic: ShapesLogic) {
    this.shapesLogic = logic;
  }

  saveState() {
    const layer = this.shapeService.getMainLayer();
    if (!layer) return;

    if (this.step < this.history.length - 1) {
      this.history = this.history.slice(0, this.step + 1);
    }

    const data = layer.toObject();

    if (data.children) {
        data.children = data.children.filter((child: any) => 
            child.className !== 'Transformer' && 
            child.attrs.name !== 'selectionRectangle'
        );
    }

    const json = JSON.stringify(data);
    this.history.push(json);
    this.step++;

    if (this.history.length > 50) {
      this.history.shift();
      this.step--;
    }
  }

  undo() {
    if (this.step > 0) {
      this.step--;
      this.loadState(this.history[this.step]);
    }
  }

  redo() {
    if (this.step < this.history.length - 1) {
      this.step++;
      this.loadState(this.history[this.step]);
    }
  }

  private loadState(json: string) {
    const layer = this.shapeService.getMainLayer();
    if (!layer || !this.shapesLogic) return;

    const existingChildren = layer.getChildren().slice();
    existingChildren.forEach(child => {
        if (child.getClassName() !== 'Transformer' && child.name() !== 'selectionRectangle') {
            child.destroy();
        }
    });

    const tempNode = Konva.Node.create(json);
    let newChildren: Konva.Node[] = [];
    
    if (tempNode.getClassName() === 'Layer') {
      newChildren = (tempNode as Konva.Layer).getChildren().slice();
    } else {
      newChildren = [tempNode];
    }

    newChildren.forEach(node => {
      if (node.getClassName() === 'Transformer' || node.name() === 'selectionRectangle') return;
      
      node.moveTo(layer);
      this.rebindEvents(node);
    });

    const transformer = layer.findOne('Transformer');
    if (transformer) {
        (transformer as Konva.Transformer).nodes([]);
        transformer.moveToTop();
    }
    
    this.shapeService.setKonvaShape(null);
    this.shapeService.setSelectedShapes([]);

    layer.batchDraw();
  }

  private rebindEvents(node: Konva.Node) {
    if (!this.shapesLogic) return;

    if (node.name() === 'eraser') {
      node.draggable(false);
      return;
    }

    if (node.getParent() instanceof Konva.Group) {
      node.draggable(false);
    } else {
      node.draggable(true);
      this.shapesLogic.selectShape(node);
      this.shapesLogic.onDrawingShape(node);
      this.shapesLogic.onShapeDragEnd(node);
      this.shapesLogic.onShapeTransformEnd(node);
      this.shapesLogic.onShapeAttStyleChange(node);
    }

    if (node instanceof Konva.Group) {
      (node as Konva.Group).getChildren().forEach(child => {
        this.rebindEvents(child);
      });
      
      this.shapesLogic.selectShape(node);
      this.shapesLogic.onDrawingShape(node);
      this.shapesLogic.onShapeDragEnd(node);
      this.shapesLogic.onShapeTransformEnd(node);
    }
  }
}