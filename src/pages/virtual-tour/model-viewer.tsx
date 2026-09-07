import { useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
    ACESFilmicToneMapping,
    Box3,
    DirectionalLight,
    Group,
    HemisphereLight,
    MathUtils,
    PerspectiveCamera,
    Scene,
    Sphere,
    SRGBColorSpace,
    Vector3,
    WebGLRenderer,
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { disposeModelObject } from "./tour-model";
import "./model-viewer.css";

type ModelViewerProps = {
    readonly open: boolean;
    readonly onOpenChange: (open: boolean) => void;
    readonly portalContainer: HTMLElement | null;
    readonly src: string;
    readonly title: string;
};

type LoadState = "loading" | "ready" | "error";

const frameModel = (
    model: Group,
    camera: PerspectiveCamera,
    controls: OrbitControls,
) => {
    model.updateMatrixWorld(true);

    const bounds = new Box3().setFromObject(model);
    const size = bounds.getSize(new Vector3());
    const largestDimension = Math.max(size.x, size.y, size.z);

    if (!Number.isFinite(largestDimension) || largestDimension <= 0) {
        throw new Error("The model has no renderable dimensions");
    }

    model.scale.setScalar(2 / largestDimension);
    model.updateMatrixWorld(true);

    bounds.setFromObject(model);
    model.position.sub(bounds.getCenter(new Vector3()));
    model.updateMatrixWorld(true);

    bounds.setFromObject(model);
    const radius = bounds.getBoundingSphere(new Sphere()).radius;
    const distance = radius / Math.sin(MathUtils.degToRad(camera.fov / 2)) * 1.15;

    camera.near = Math.max(distance / 100, 0.01);
    camera.far = distance * 100;
    camera.position.set(0, 0, distance);
    camera.updateProjectionMatrix();

    controls.target.set(0, 0, 0);
    controls.minDistance = radius * 1.1;
    controls.maxDistance = radius * 8;
    controls.update();
};

const InteractiveModel = ({ src, title }: Pick<ModelViewerProps, "src" | "title">) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [loadState, setLoadState] = useState<LoadState>("loading");

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const scene = new Scene();
        const camera = new PerspectiveCamera(40, 1, 0.01, 100);
        const renderer = new WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: "high-performance",
        });
        renderer.outputColorSpace = SRGBColorSpace;
        renderer.toneMapping = ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.1;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearAlpha(0);
        renderer.domElement.className = "model-viewer-canvas-element";
        renderer.domElement.tabIndex = 0;
        renderer.domElement.setAttribute("aria-label", `Interactive 3D model of ${title}`);
        container.appendChild(renderer.domElement);

        scene.add(new HemisphereLight(0xffffff, 0x27272a, 2.5));
        const keyLight = new DirectionalLight(0xffffff, 3);
        keyLight.position.set(3, 4, 5);
        scene.add(keyLight);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.enablePan = true;
        controls.enableRotate = true;
        controls.enableZoom = true;
        controls.dampingFactor = 0.08;
        controls.listenToKeyEvents(renderer.domElement);

        const resize = () => {
            const { clientWidth, clientHeight } = container;
            if (clientWidth === 0 || clientHeight === 0) return;

            camera.aspect = clientWidth / clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(clientWidth, clientHeight, false);
        };
        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(container);
        resize();

        let disposed = false;
        let frame = 0;
        let loadedModel: Group | null = null;

        const render = () => {
            controls.update();
            renderer.render(scene, camera);
            frame = window.requestAnimationFrame(render);
        };
        render();

        void new GLTFLoader().loadAsync(src).then(({ scene: model }) => {
            if (disposed) {
                disposeModelObject(model);
                return;
            }

            try {
                frameModel(model, camera, controls);
            } catch (error) {
                disposeModelObject(model);
                throw error;
            }

            loadedModel = model;
            scene.add(model);
            setLoadState("ready");
        }).catch((error: unknown) => {
            if (disposed) return;
            console.error(`Failed to load model viewer asset: ${src}`, error);
            setLoadState("error");
        });

        return () => {
            disposed = true;
            window.cancelAnimationFrame(frame);
            resizeObserver.disconnect();
            controls.stopListenToKeyEvents();
            controls.dispose();

            if (loadedModel) {
                scene.remove(loadedModel);
                disposeModelObject(loadedModel);
            }

            renderer.dispose();
            renderer.forceContextLoss();
            renderer.domElement.remove();
        };
    }, [src, title]);

    return (
        <div className="model-viewer-stage" ref={containerRef}>
            {loadState === "loading" && (
                <div className="model-viewer-status" role="status">
                    <span className="model-viewer-spinner" aria-hidden="true" />
                    Loading model
                </div>
            )}
            {loadState === "error" && (
                <div className="model-viewer-status model-viewer-status-error" role="alert">
                    Unable to load the model
                </div>
            )}
        </div>
    );
};

export const ModelViewer = ({
    open,
    onOpenChange,
    portalContainer,
    src,
    title,
}: ModelViewerProps) => (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Portal container={portalContainer ?? undefined}>
            <Dialog.Overlay className="model-viewer-overlay" />
            <Dialog.Content className="model-viewer-dialog">
                <header className="model-viewer-header">
                    <Dialog.Title className="model-viewer-title">{title}</Dialog.Title>
                    <Dialog.Description className="model-viewer-description">
                        Left-drag to rotate · Right-drag to move · Scroll to zoom
                    </Dialog.Description>
                </header>

                <InteractiveModel src={src} title={title} />

                <Dialog.Close asChild>
                    <button className="model-viewer-close" type="button" aria-label="Close model viewer">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                    </button>
                </Dialog.Close>
            </Dialog.Content>
        </Dialog.Portal>
    </Dialog.Root>
);
