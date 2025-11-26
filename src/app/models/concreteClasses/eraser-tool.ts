import Konva from 'konva';
import { ShapesLogic } from '../../components/drawing-canvas/shapes-logic';

export class EraserTool {
  private isErasing = false;
  private currentLine: Konva.Line | null = null;

  constructor(private shapeLogic: ShapesLogic) {}

  startErasing(stage: Konva.Stage, layer: Konva.Layer, size: number = 20) {
    this.isErasing = true;
    const pos = stage.getPointerPosition();
    if (!pos) return;

    this.currentLine = new Konva.Line({
      stroke: '#f7fafc',
      strokeWidth: size,
      points: [pos.x, pos.y, pos.x, pos.y],
      lineCap: 'round',
      lineJoin: 'round',
      tension: 0.5,
      name: 'eraser',
      draggable: false
    });

    layer.add(this.currentLine);
    layer.batchDraw();
  }

  continueErasing(stage: Konva.Stage, layer: Konva.Layer) {
    if (!this.isErasing || !this.currentLine) return;

    const pos = stage.getPointerPosition();
    if (!pos) return;

    const newPoints = this.currentLine.points().concat([pos.x, pos.y]);
    this.currentLine.points(newPoints);
    
    layer.batchDraw();
  }

  stopErasing() {
    this.isErasing = false;
    
    if (!this.currentLine) return;
    
    const layer = this.currentLine.getLayer();
    if (!layer) return;

    const eraserBox = this.currentLine.getClientRect();

    const shapesHit = layer.getChildren().filter(node => {
        return node !== this.currentLine && 
               node.getClassName() !== 'Transformer' && 
               node.name() !== 'selectionRectangle' &&
               Konva.Util.haveIntersection(eraserBox, node.getClientRect());
    });

    if (shapesHit.length > 0) {
        const masterGroup = new Konva.Group({
            draggable: true,
        });
        layer.add(masterGroup);

        const nodesToMove = new Set<Konva.Node>();

        shapesHit.forEach(shape => {
            const parent = shape.getParent();
            if (parent instanceof Konva.Group) {
                nodesToMove.add(parent);
            } else {
                nodesToMove.add(shape);
            }
        });

        nodesToMove.forEach(node => {
            node.draggable(false);
            node.off('mousedown touchstart dragstart dragmove dragend click tap dblclick dbltap');
            node.moveTo(masterGroup);
        });

        this.currentLine.moveTo(masterGroup);

        this.shapeLogic.selectShape(masterGroup);
        this.shapeLogic.onDrawingShape(masterGroup);
        this.shapeLogic.onShapeDragEnd(masterGroup);
        this.shapeLogic.onShapeTransformEnd(masterGroup);
    }
    
    this.currentLine = null;
    layer.batchDraw();
  }
}