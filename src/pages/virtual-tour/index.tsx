import { useEffect, useRef } from "react";
import { Viewer, type ClickData } from "@photo-sphere-viewer/core";
import { VirtualTourPlugin } from "@photo-sphere-viewer/virtual-tour-plugin";
import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/virtual-tour-plugin/index.css";
import { startNodeId, tourNodes } from "../../assets/tour";

export const VirtualTourPage = () => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    const listen = (data: ClickData) => {
        console.log({
            yaw: data.yaw,
            pitch: data.pitch,
            textureX: data.textureX,
            textureY: data.textureY,
        });
    }

    useEffect(() => {
        if (!containerRef.current) return

        const viewer = new Viewer({
            container: containerRef.current,
            defaultZoomLvl: 50,
            plugins: [
                VirtualTourPlugin.withConfig({
                    nodes: tourNodes,
                    startNodeId,
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

        viewer.addEventListener("click", ({ data }) => listen(data));

        return () => {
            viewer.destroy();
            // viewer.removeEventListener("click", ({ data }) => listen(data));
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                width: "100%",
                height: "100vh",
            }}
        />
    );
}
