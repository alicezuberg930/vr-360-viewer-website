import { useEffect, useState } from "react";
import { Viewer, events as viewerEvents, type ClickData } from "@photo-sphere-viewer/core";
import {
    VirtualTourPlugin,
    events as virtualTourEvents,
} from "@photo-sphere-viewer/virtual-tour-plugin";
import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/virtual-tour-plugin/index.css";
import { startNodeId, tourNodes, type TourNode } from "../../assets/tour";
import { ModelViewer } from "./model-viewer";
import { TourModelController } from "./tour-model";

const modelUrl = "/models/astolfo_school_uniform.glb";

export const VirtualTourPage = () => {
    const [container, setContainer] = useState<HTMLDivElement | null>(null);
    const [modelViewerOpen, setModelViewerOpen] = useState(false);

    const listen = (data: ClickData) => {
        console.log({
            yaw: data.yaw,
            pitch: data.pitch,
            textureX: data.textureX,
            textureY: data.textureY,
        });
    }

    useEffect(() => {
        if (!container) return

        const viewer = new Viewer({
            container,
            defaultZoomLvl: 50,
            plugins: [
                VirtualTourPlugin.withConfig({
                    positionMode: "manual",
                    renderMode: '3d',
                    preload: true,
                    transitionOptions: {
                        showLoader: true,
                        effect: "fade",
                        rotation: true,
                        speed: "20rpm",
                    },
                }),
            ],
        });

        const virtualTour = viewer.getPlugin<VirtualTourPlugin>(VirtualTourPlugin);
        const model = new TourModelController(viewer);

        const setNodeModel = (node: TourNode | null) => {
            model.setPlacement(node?.data.model);
        };
        const handleClick = ({ data }: viewerEvents.ClickEvent) => {
            const target = data.target;
            const isTourLink = target instanceof Element && Boolean(target.closest(".psv-virtual-tour-link"));

            if (!data.rightclick && !isTourLink && model.isClickTarget(data.objects)) {
                setModelViewerOpen(true);
                return;
            }

            listen(data);
        };
        const handlePanoramaLoad = () => model.setPlacement(undefined);
        const handlePanoramaError = () => {
            setNodeModel(virtualTour.getCurrentNode() as TourNode | null);
        };
        const handleNodeChanged = ({ node }: virtualTourEvents.NodeChangedEvent) => {
            setNodeModel(node as TourNode);
        };

        viewer.addEventListener("click", handleClick);
        viewer.addEventListener("panorama-load", handlePanoramaLoad);
        viewer.addEventListener("panorama-error", handlePanoramaError);
        virtualTour.addEventListener("node-changed", handleNodeChanged);

        const startFrame = window.requestAnimationFrame(() => {
            virtualTour.setNodes(tourNodes, startNodeId);
            void model.load(modelUrl).catch((error: unknown) => {
                console.error(`Failed to load tour model: ${modelUrl}`, error);
            });
        });

        return () => {
            window.cancelAnimationFrame(startFrame);
            viewer.removeEventListener("click", handleClick);
            viewer.removeEventListener("panorama-load", handlePanoramaLoad);
            viewer.removeEventListener("panorama-error", handlePanoramaError);
            virtualTour.removeEventListener("node-changed", handleNodeChanged);
            model.destroy();
            viewer.destroy();
        };
    }, [container]);

    return (
        <>
            <div
                ref={setContainer}
                style={{
                    width: "100%",
                    height: "100vh",
                }}
            />
            <ModelViewer
                open={modelViewerOpen}
                onOpenChange={setModelViewerOpen}
                portalContainer={container}
                src={modelUrl}
                title="Astolfo School Uniform"
            />
        </>
    );
}
