import "@arcgis/map-components/components/arcgis-scene";
import "@arcgis/map-components/components/arcgis-map";
import Extent from "@arcgis/core/geometry/Extent.js";
import * as intersectionOperator from "@arcgis/core/geometry/operators/intersectionOperator.js";
import Polygon from "@arcgis/core/geometry/Polygon.js";
import SpatialReference from "@arcgis/core/geometry/SpatialReference.js";
import Graphic from "@arcgis/core/Graphic.js";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";
import * as promiseUtils from "@arcgis/core/core/promiseUtils.js";

const OVERVIEW_SCALE = 150000000;
const OVERVIEW_TILT = 0;

(async () => {

    const viewMapElement = document.querySelector("arcgis-map");
    const viewSceneElement = document.querySelector("arcgis-scene");
    if (!viewMapElement || !viewSceneElement) return;

    viewSceneElement.environment = {
        background: {
            type: "color",
            color: [0, 0, 0, 0]
        },
        starsEnabled: false,
        atmosphereEnabled: false
    }
    // Helper for extent calculation
    const webmercatorExtent = new Extent({
        xmin: -20037508.342787,
        ymin: -20037508.342787,
        xmax: 20037508.342787,
        ymax: 20037508.342787,
        spatialReference: SpatialReference.WebMercator,
    });

    viewMapElement.viewOnReady(async () => {
        await viewSceneElement.viewOnReady();

        const mapView = viewMapElement.view;
        const sceneView = viewSceneElement.view;
        if (!mapView || !sceneView) return;

        sceneView.constraints.rotationEnabled = false;
        sceneView.constraints.tilt = {
            min: OVERVIEW_TILT,
            max: OVERVIEW_TILT,
        };
        sceneView.ui.components = []; // remove the attribution from the overview map

        const visibleAreaGraphic = new Graphic({
            geometry: null,
            symbol: {
                type: "simple-fill",
                color: [0, 0, 0, 0.2],
                outline: {
                    color: [255, 255, 255, 1],
                    width: 1.5,
                },
            },
        });
        viewSceneElement.graphics.add(visibleAreaGraphic);

        const syncFromMapExtent = promiseUtils.debounce(async () => {
            const currentExtent = mapView.extent;
            if (!currentExtent) return;

            const clippedExtent = intersectionOperator.execute(webmercatorExtent, currentExtent);
            if (!clippedExtent) return;

            const extentPolygon = Polygon.fromExtent(clippedExtent);
            visibleAreaGraphic.geometry = extentPolygon;

            const extentCenter = clippedExtent.center;
            if (!extentCenter) return;

            try {
                await sceneView.goTo(
                    {
                        target: extentCenter,
                        scale: OVERVIEW_SCALE,
                        tilt: OVERVIEW_TILT,
                        heading: mapView.rotation || 0,
                    },
                    { animate: true, duration: 1000 }
                );
            } catch (error) {
                if (error?.name !== "AbortError") {
                    console.error("Error syncing scene extent:", error);
                }
            }
        });

        reactiveUtils.watch(
            () => [mapView.extent, mapView.stationary],
            () => {
                syncFromMapExtent().catch((error) => {
                    if (error?.name !== "AbortError") {
                        console.error("Error updating overview extent:", error);
                    }
                });
            },
            { initial: true },
        );
    });
})();