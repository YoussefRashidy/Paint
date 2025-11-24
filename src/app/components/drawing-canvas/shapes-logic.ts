import { Component, Inject, Injectable, signal } from "@angular/core";
import { ShapeSelection } from "../../services/shape-selection";

export class ShapesLogic {
    // Placeholder for future shape logic methods
    shapeService: ShapeSelection;
    constructor(shapeService: ShapeSelection) { 
        this.shapeService = shapeService;
    }

    selectShape(shape: any) {
        shape.on("click", () => {
            console.log("Shape clicked:", shape);
            console.log("Currently selected shape:", this.shapeService.getKonvaShape());
            if (this.shapeService.getKonvaShape() === shape) {
                this.shapeService.setSelectedShape(null);
                console.log("Shape deselected");
            } else {
                this.shapeService.setKonvaShape(shape);
                console.log("Shape selected");
                console.log("Newly selected shape:", this.shapeService.getKonvaShape());
            }
        });
    }
}