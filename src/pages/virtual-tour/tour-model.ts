import type { Viewer } from "@photo-sphere-viewer/core";
import {
    Box3,
    Group,
    Mesh,
    SkinnedMesh,
    Texture,
    Vector3,
    type BufferGeometry,
    type Material,
    type Object3D,
    type Skeleton,
} from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import type { TourModelPlacement } from "../../assets/tour";

export const disposeModelObject = (root: Object3D) => {
    const geometries = new Set<BufferGeometry>();
    const materials = new Set<Material>();
    const skeletons = new Set<Skeleton>();
    const textures = new Set<Texture>();

    root.traverse((object) => {
        if (object instanceof Mesh) {
            geometries.add(object.geometry);

            if (Array.isArray(object.material)) {
                object.material.forEach((material) => materials.add(material));
            } else {
                materials.add(object.material);
            }
        }

        if (object instanceof SkinnedMesh) {
            skeletons.add(object.skeleton);
        }
    });

    materials.forEach((material) => {
        Object.values(material).forEach((value) => {
            if (value instanceof Texture) textures.add(value);
        });
        material.dispose();
    });
    geometries.forEach((geometry) => geometry.dispose());
    skeletons.forEach((skeleton) => skeleton.dispose());
    textures.forEach((texture) => {
        const image = texture.image as { close?: () => void } | undefined;
        image?.close?.();
        texture.dispose();
    });
};

const createModelRoot = (scene: Group) => {
    scene.updateMatrixWorld(true);

    scene.traverse((object) => {
        if (object instanceof Mesh) object.renderOrder = 1;
    });

    const bounds = new Box3().setFromObject(scene);
    const center = bounds.getCenter(new Vector3());

    scene.position.x -= center.x;
    scene.position.y -= bounds.min.y;
    scene.position.z -= center.z;

    const root = new Group();
    root.visible = false;
    root.add(scene);

    return root;
};

export class TourModelController {
    private model: Group | null = null;
    private placement: TourModelPlacement | undefined;
    private destroyed = false;
    private readonly viewer: Viewer;

    constructor(viewer: Viewer) {
        this.viewer = viewer;
    }

    async load(url: string) {
        let scene: Group;

        try {
            ({ scene } = await new GLTFLoader().loadAsync(url));
        } catch (error) {
            if (!this.destroyed) throw error;
            return;
        }

        if (this.destroyed) {
            disposeModelObject(scene);
            return;
        }

        this.model = createModelRoot(scene);
        this.viewer.renderer.addObject(this.model);
        this.applyPlacement();
    }

    setPlacement(placement: TourModelPlacement | undefined) {
        this.placement = placement;
        this.applyPlacement();
    }

    isClickTarget(objects: readonly Object3D[]) {
        if (!this.model?.visible) return false;

        return objects.some((object) => {
            let current: Object3D | null = object;

            while (current) {
                if (current === this.model) return true;
                current = current.parent;
            }

            return false;
        });
    }

    destroy() {
        this.destroyed = true;

        if (!this.model) return;

        this.viewer.renderer.removeObject(this.model);
        disposeModelObject(this.model);
        this.model = null;
    }

    private applyPlacement() {
        if (!this.model) return;

        const placement = this.placement;
        this.model.visible = Boolean(placement);

        if (placement) {
            const position = this.viewer.dataHelper.cleanPosition(placement);
            this.viewer.dataHelper.sphericalCoordsToVector3(
                position,
                this.model.position,
                placement.distance,
            );
            this.model.rotation.set(...placement.rotation);
            this.model.scale.setScalar(placement.scale);
        }

        this.viewer.needsUpdate();
    }
}
