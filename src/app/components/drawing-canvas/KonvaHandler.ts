import { Signal } from "@angular/core";
import Konva from "konva";
import { MockShapeFactory } from "../Factories/MockShapeFactory";
export class KonvaHandler {
    private stage: Konva.Stage;
    private layer: Konva.Layer;
    private iniX: number = 0;
    private iniY: number = 0;
    private finX: number = 0;
    private finY: number = 0;
    mockShape: Konva.Shape | undefined = undefined;
    private mockFactory = new MockShapeFactory();
    private shapeService: any;

    constructor(containerId: string, width: number, height: number, shapeService: any) {
        this.shapeService = shapeService;
        this.stage = new Konva.Stage({ container: containerId, width: width, height: height });
        this.layer = new Konva.Layer();
        this.stage.add(this.layer);
        this.onMouseDown();
        this.onMouseMove();
        this.onMouseUp();
    }

    get selectedShape() {
        return this.shapeService.selectedShape();
    }

    onMouseDown() {
        this.stage.on("mousedown touchdown", () => {
            let Position = this.stage.getPointerPosition();
            if (!Position) return;
            this.iniX = Position.x;
            this.iniY = Position.y;
            const shape = this.selectedShape;
            if (shape) {
                this.mockShape = this.mockFactory.createShape(shape.type as 'rectangle' | 'circle' | 'ellipse', this.iniX, this.iniY, 0, 0);
                if (this.mockShape) {
                    this.layer.add(this.mockShape);
                }
            }
            this.layer.batchDraw();
        })
    }

    onMouseMove() {
        this.stage.on("mousemove touchmove", () => {
            let position = this.stage.getPointerPosition();
            if (!position || !this.mockShape) return;
            this.finX = position.x;
            this.finY = position.y;
            let width = Math.abs(this.finX - this.iniX);
            let height = Math.abs(this.finY - this.iniY);
            let x = Math.min(this.finX, this.iniX);
            let y = Math.min(this.finY, this.iniY);
            let type = this.selectedShape?.type;
            if (type === 'rectangle') {
                this.mockShape.x(x);
                this.mockShape.y(y);
                this.mockShape.width(width);
                this.mockShape.height(height);
            }
            else if (type === 'square') {
                this.mockShape.x(x);
                this.mockShape.y(y);
                this.mockShape.width(width);
                this.mockShape.height(width);
            }
            else if (type === 'square') {
                this.mockShape.x(x);
                this.mockShape.y(y);
                this.mockShape.width(width);
                this.mockShape.height(width);
            }
            else if (type === 'circle' && this.mockShape instanceof Konva.Circle) {
                this.mockShape.x(x + width / 2);
                this.mockShape.y(y + height / 2);
                this.mockShape.radius(Math.max(width, height) / 2);
            }
            else if (this.mockShape instanceof Konva.Ellipse) {
                this.mockShape.x(x + width / 2);
                this.mockShape.y(y + height / 2);
                this.mockShape.radiusX(width / 2);
                this.mockShape.radiusY(height / 2);
            }
            else if (this.mockShape instanceof Konva.Line) {
                this.mockShape.points([this.iniX, this.iniY, this.finX, this.finY]);
            }
            else if (this.mockShape instanceof Konva.RegularPolygon) {
                this.mockShape.x((this.iniX + this.finX) / 2);
                this.mockShape.y((this.iniY + this.finY) / 2);
                this.mockShape.radius(Math.min(width, height) / 2);
            }
            this.layer.batchDraw();
        })
    }

    // TODO convert to SVG shape and add to svg canvas
    onMouseUp() {
        this.stage.on("mouseup touchend", () => {
            if (this.mockShape) {
                this.layer.add(this.mockShape);
                this.layer.batchDraw();
                this.mockShape = undefined;
            }
        })
    }
}