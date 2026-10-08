// Register map components and import geometry, graphics, and synchronization helpers.
import "@arcgis/map-components/components/arcgis-scene";
import "@arcgis/map-components/components/arcgis-map";
import Extent from "@arcgis/core/geometry/Extent.js";
import * as intersectionOperator from "@arcgis/core/geometry/operators/intersectionOperator.js";
import Polygon from "@arcgis/core/geometry/Polygon.js";
import SpatialReference from "@arcgis/core/geometry/SpatialReference.js";
import Graphic from "@arcgis/core/Graphic.js";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";
import * as promiseUtils from "@arcgis/core/core/promiseUtils.js";

// Keep the overview at a fixed globe scale and tilt.
const OVERVIEW_SCALE = 150000000;
const OVERVIEW_TILT = 0;

// Locate the main map and overview scene before initializing synchronization.
(async () => {

    const viewMapElement = document.querySelector("arcgis-map");
    const viewSceneElement = document.querySelector("arcgis-scene");
    if (!viewMapElement || !viewSceneElement) return;

    // Use a transparent scene background without stars or atmosphere.
    viewSceneElement.environment = {
        background: {
            type: "color",
            color: [0, 0, 0, 0]
        },
        starsEnabled: false,
        atmosphereEnabled: false
    }
    // Define Web Mercator world bounds for clipping the main map's extent.
    const webmercatorExtent = new Extent({
        xmin: -20037508.342787,
        ymin: -20037508.342787,
        xmax: 20037508.342787,
        ymax: 20037508.342787,
        spatialReference: SpatialReference.WebMercator,
    });

    // Wait for both views before configuring the overview and its graphics.
    viewMapElement.viewOnReady(async () => {
        await viewSceneElement.viewOnReady();

        const mapView = viewMapElement.view;
        const sceneView = viewSceneElement.view;
        if (!mapView || !sceneView) return;

        // Disable interactive rotation, lock tilt, and remove default view controls.
        sceneView.constraints.rotationEnabled = false;
        sceneView.constraints.tilt = {
            min: OVERVIEW_TILT,
            max: OVERVIEW_TILT,
        };
        sceneView.ui.components = []; // remove the attribution from the overview map

        // Outline and shade the main map's visible area on the globe.
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

        // Debounce extent updates, redraw the footprint, and recenter the globe.
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

        // Synchronize initially and whenever the map extent or stationary state changes.
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