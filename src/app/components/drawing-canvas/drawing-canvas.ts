import { Component, inject, AfterViewInit, ElementRef } from '@angular/core';
import { ShapeSelection } from '../../services/shape-selection';
import { NgIf } from '@angular/common';
import Konva from 'konva';
import { Line } from 'konva/lib/shapes/Line';
import { Container } from 'konva/lib/Container';
import { MockShapeFactory } from '../Factories/MockShapeFactory';
import { KonvaHandler } from './KonvaHandler';

@Component({
  selector: 'app-drawing-canvas',
  imports: [
    NgIf
  ],
  templateUrl: './drawing-canvas.html',
  styleUrl: './drawing-canvas.css',
})
export class DrawingCanvas implements AfterViewInit {
  private readonly shapeService = inject(ShapeSelection);
  private readonly elementRef = inject(ElementRef);

  private svg: SVGSVGElement | null = null;
  private selectedElement: SVGGraphicsElement | null = null;

  private isDragging = false;
  private isResizing = false;
  private activeResizeHandle: string | null = null;

  private iniX: number = 0;
  private iniY: number = 0;
  private finX: number = 0;
  private finY: number = 0;
  private mockShape: any = null;

  private mockFactory = new MockShapeFactory();
  private konvaHandler: KonvaHandler | null = null;


  get selectedShape() {
    return this.shapeService.selectedShape();
  }

  ngAfterViewInit() {
    this.svg = this.elementRef.nativeElement.querySelector('#canvas');
    if (this.svg) {
      this.setupGlobalEvents();
    }
    this.initalizeKonva();
  }

  private setupGlobalEvents() {
    if (!this.svg) {
      return;
    }
    this.svg.addEventListener('mousedown', (event) => this.onMouseDown(event));
    this.svg.addEventListener('mousemove', (event) => this.onMouseMove(event));
    this.svg.addEventListener('mouseup', () => this.onMouseUp());
    this.svg.addEventListener('mouseleave', () => this.onMouseUp());

  }

  private toSvgPoint(event: MouseEvent) {
    if (!this.svg) throw new Error('svg missing');
    const pt = this.svg.createSVGPoint();
    pt.x = event.clientX;
    pt.y = event.clientY;
    return pt.matrixTransform(this.svg.getScreenCTM()!.inverse());
  }


  private onMouseDown(event: MouseEvent) {
    if (!this.svg) {
      return;
    }
    const target = event.target as SVGGraphicsElement;

    const svgPoint = this.toSvgPoint(event);
    const shape = this.selectedShape;
    // give the shapes this class
    if (target.classList.contains('resize-handle')) {
      if (shape) {
        this.isResizing = true;
        // Get which handle was clicked
        this.activeResizeHandle = target.getAttribute('data-position');

        shape.startResize(svgPoint.x, svgPoint.y, this.activeResizeHandle);
      }
      event.stopPropagation(); //  don't start dragging too
      return;
    }

    if (target !== this.svg && target.tagName !== 'svg') {
      const shape = this.selectedShape;
      this.isDragging = true;
      this.selectedElement = target;

      const svgPoint = this.toSvgPoint(event);

      if (shape) {
        shape.startDrag(svgPoint.x, svgPoint.y);
      }
      target.style.cursor = 'grabbing';
      target.style.opacity = '0.7';
    }

    if (target.tagName === 'svg' || target.id === 'canvas') {
      // This makes the handles disappear
      this.shapeService.setSelectedShape(null);
      this.isDragging = false;
      this.isResizing = false;
      this.selectedElement = null;
    }

  }

  private onMouseMove(event: MouseEvent) {
    if (!this.svg) return;
    const shape = this.selectedShape;
    const svgPoint = this.toSvgPoint(event);


    if (!shape) {
      return;
    }
    if (this.isResizing) {
      shape.resizing(svgPoint.x, svgPoint.y);
      return;
    }


    if (this.isDragging && this.selectedElement) {
      shape.dragTo(svgPoint.x, svgPoint.y);
      shape.applyPositionToElement(this.selectedElement);
    }


  }

  private onMouseUp() {

    const shape = this.selectedShape;
    if (this.isResizing) {
      if (shape) shape.endResizing();
      this.isResizing = false;
      this.activeResizeHandle = null;
    }


    if (this.isDragging && this.selectedElement) {
      if (shape) shape.endDrag();
      this.selectedElement.style.cursor = 'grab';
      this.selectedElement.style.opacity = '1';
      this.isDragging = false;
      this.selectedElement = null;
    }
  }

  initalizeKonva() {
    const containerEl = document.getElementById('mock-canvas')!;
    this.konvaHandler = new KonvaHandler('mock-canvas', containerEl.clientWidth, containerEl.clientHeight, this.shapeService);
    // let stage = new Konva.Stage({
    //   container: 'mock-canvas',
    //   width: containerEl.clientWidth,
    //   height: containerEl.clientHeight
    // });

    // let layer = new Konva.Layer();
    // stage.add(layer);
    // // Detect mousedown create mock shape 
    // stage.on("mousedown touchdown", () => {
    //   let Position = stage.getPointerPosition();
    //   if (!Position) return;
    //   this.iniX = Position.x;
    //   this.iniY = Position.y;
    //   const shape = this.selectedShape;
    //   if (shape) {
    //     this.mockShape = this.mockFactory.createShape(shape.type as 'rectangle' | 'circle' | 'ellipse', this.iniX, this.iniY, 0, 0);
    //   }
    //   layer.add(this.mockShape);
    //   layer.batchDraw();
    // })
    // // Detect mosue movement change shape size dynamically 
    // stage.on("mousemove touchmove", () => {
    //   let position = stage.getPointerPosition();
    //   if (!position || !this.mockShape) return;
    //   this.finX = position.x;
    //   this.finY = position.y;
    //   let width = Math.abs(this.finX - this.iniX);
    //   let height = Math.abs(this.finY - this.iniY);
    //   let x = Math.min(this.finX, this.iniX);
    //   let y = Math.min(this.finY, this.iniY);
    //   if (this.mockShape instanceof Konva.Rect) {
    //     this.mockShape.x(x);
    //     this.mockShape.y(y);
    //     this.mockShape.width(width);
    //     this.mockShape.height(height);
    //   }
    //   else if (this.mockShape instanceof Konva.Circle) {
    //     this.mockShape.x(x + width / 2);
    //     this.mockShape.y(y + height / 2);
    //     this.mockShape.radius(Math.max(width, height) / 2);
    //   }
    //   else if (this.mockShape instanceof Konva.Ellipse) {
    //     this.mockShape.x(x + width / 2);
    //     this.mockShape.y(y + height / 2);
    //     this.mockShape.radiusX(width / 2);
    //     this.mockShape.radiusY(height / 2);
    //   }
    //   else if (this.mockShape instanceof Konva.Line) {
    //     this.mockShape.points([this.iniX, this.iniY, this.finX, this.finY]);
    //   }
    //   else if (this.mockShape instanceof Konva.RegularPolygon) {
    //     this.mockShape.x((this.iniX + this.finX) / 2);
    //     this.mockShape.y((this.iniY + this.finY) / 2);
    //     this.mockShape.radius(Math.min(width, height) / 2);
    //   }
    //   layer.batchDraw();
    // })

    // // Detect mouseup add shape to layer 
    // // TODO : add shape to svg canvas
    // stage.on("mouseup touchend", () => {
    //   if (this.mockShape) {
    //     layer.add(this.mockShape);
    //     layer.batchDraw();
    //     this.mockShape = null;
    //   }
    // })

  }



}
