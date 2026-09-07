import type { SphericalPosition } from "@photo-sphere-viewer/core";
import type { VirtualTourNode } from "@photo-sphere-viewer/virtual-tour-plugin";

export type TourModelPlacement = Readonly<SphericalPosition> & {
    readonly distance: number;
    readonly rotation: readonly [x: number, y: number, z: number];
    readonly scale: number;
};

type TourLink = {
    readonly nodeId: string;
    readonly yaw: string;
};
type TourPano = {
    readonly id: string;
    readonly name: string;
    readonly file: string;
    readonly links: readonly TourLink[];
    readonly model?: false | Partial<TourModelPlacement>;
};

const panoramaBasePath = "/tour/panoramas/zind-000";
const linkPitch = "-10deg";
const defaultModelPlacement: TourModelPlacement = {
    yaw: "0deg",
    pitch: "-22deg",
    distance: 4.25,
    rotation: [0, Math.PI, 0],
    scale: 1.3,
};

export const startNodeId = "pano_3";

const zindPanos: readonly TourPano[] = [
    {
        id: "pano_2",
        name: "Living Room 2",
        file: "floor_01_partial_room_09_pano_2.jpg",
        links: [{ nodeId: "pano_4", yaw: "-168.0deg" }, { nodeId: "pano_3", yaw: "177.5deg" }]
    },
    {
        id: "pano_3",
        name: "Living Room 3",
        file: "floor_01_partial_room_12_pano_3.jpg",
        links: [{ nodeId: "pano_4", yaw: "-168.3deg" }, { nodeId: "pano_2", yaw: "-3.7deg" }]
    },
    {
        id: "pano_4",
        name: "Living Room 4",
        file: "floor_01_partial_room_09_pano_4.jpg",
        links: [{ nodeId: "pano_6", yaw: "-133.0deg" }, { nodeId: "pano_7", yaw: "167.8deg" }, { nodeId: "pano_3", yaw: "-21.2deg" }, { nodeId: "pano_2", yaw: "-22.0deg" }, { nodeId: "pano_5", yaw: "-93.8deg" }]
    },
    {
        id: "pano_5",
        name: "Living Room 5",
        file: "floor_01_partial_room_09_pano_5.jpg",
        links: [{ nodeId: "pano_6", yaw: "-144.6deg" }, { nodeId: "pano_4", yaw: "120.3deg" }]
    },
    {
        id: "pano_6",
        name: "Kitchen 6",
        file: "floor_01_partial_room_09_pano_6.jpg",
        links: [{ nodeId: "pano_16", yaw: "-80.8deg" }, { nodeId: "pano_4", yaw: "98.5deg" }, { nodeId: "pano_5", yaw: "52.8deg" }]
    },
    {
        id: "pano_7",
        name: "Dining Room 7",
        file: "floor_01_partial_room_17_pano_7.jpg",
        links: [{ nodeId: "pano_10", yaw: "25.6deg" }, { nodeId: "pano_8", yaw: "-106.1deg" }, { nodeId: "pano_4", yaw: "168.6deg" }]
    },
    {
        id: "pano_8",
        name: "Dining Room 8",
        file: "floor_01_partial_room_17_pano_8.jpg",
        links: [{ nodeId: "pano_9", yaw: "-85.3deg" }, { nodeId: "pano_7", yaw: "-162.5deg" }]
    },
    {
        id: "pano_9",
        name: "Closet 9",
        file: "floor_01_partial_room_13_pano_9.jpg",
        links: [{ nodeId: "pano_8", yaw: "-174.0deg" }, { nodeId: "pano_14", yaw: "112.6deg" }, { nodeId: "pano_32", yaw: "31.8deg" }]
    },
    {
        id: "pano_10",
        name: "Kitchen 10",
        file: "floor_01_partial_room_06_pano_10.jpg",
        links: [{ nodeId: "pano_7", yaw: "-33.9deg" }, { nodeId: "pano_11", yaw: "178.4deg" }, { nodeId: "pano_12", yaw: "178.3deg" }]
    },
    {
        id: "pano_11",
        name: "Kitchen 11",
        file: "floor_01_partial_room_06_pano_11.jpg",
        links: [{ nodeId: "pano_10", yaw: "-92.5deg" }, { nodeId: "pano_12", yaw: "87.2deg" }]
    },
    {
        id: "pano_12",
        name: "Kitchen 12",
        file: "floor_01_partial_room_06_pano_12.jpg",
        links: [{ nodeId: "pano_10", yaw: "-177.4deg" }, { nodeId: "pano_11", yaw: "-177.6deg" }, { nodeId: "pano_13", yaw: "65.3deg" }]
    },
    {
        id: "pano_13",
        name: "Pantry 13",
        file: "floor_01_partial_room_03_pano_13.jpg",
        links: [{ nodeId: "pano_12", yaw: "55.4deg" }, { nodeId: "pano_16", yaw: "-82.3deg" }]
    },
    {
        id: "pano_14",
        name: "Bonus Room 14",
        file: "floor_01_partial_room_01_pano_14.jpg",
        links: [{ nodeId: "pano_15", yaw: "-124.2deg" }, { nodeId: "pano_9", yaw: "74.4deg" }]
    },
    {
        id: "pano_15",
        name: "Bonus Room 15",
        file: "floor_01_partial_room_01_pano_15.jpg",
        links: [{ nodeId: "pano_14", yaw: "93.1deg" }]
    },
    {
        id: "pano_16",
        name: "Hallway 16",
        file: "floor_01_partial_room_10_pano_16.jpg",
        links: [{ nodeId: "pano_13", yaw: "107.7deg" }, { nodeId: "pano_6", yaw: "-6.6deg" }, { nodeId: "pano_17", yaw: "-176.8deg" }, { nodeId: "pano_22", yaw: "-177.7deg" }]
    },
    {
        id: "pano_17",
        name: "Hallway 17",
        file: "floor_01_partial_room_10_pano_17.jpg",
        links: [{ nodeId: "pano_16", yaw: "1.8deg" }, { nodeId: "pano_18", yaw: "-74.3deg" }, { nodeId: "pano_22", yaw: "-179.8deg" }]
    },
    {
        id: "pano_18",
        name: "Bedroom 18",
        file: "floor_01_partial_room_07_pano_18.jpg",
        links: [{ nodeId: "pano_17", yaw: "-152.9deg" }, { nodeId: "pano_19", yaw: "39.5deg" }, { nodeId: "pano_20", yaw: "-48.1deg" }]
    },
    {
        id: "pano_19",
        name: "Bedroom 19",
        file: "floor_01_partial_room_07_pano_19.jpg",
        links: [{ nodeId: "pano_18", yaw: "-150.6deg" }]
    },
    {
        id: "pano_20",
        name: "Closet 20",
        file: "floor_01_partial_room_18_pano_20.jpg",
        links: [{ nodeId: "pano_18", yaw: "-18.1deg" }, { nodeId: "pano_26", yaw: "173.0deg" }]
    },
    {
        id: "pano_21",
        name: "Bathroom 21",
        file: "floor_01_partial_room_14_pano_21.jpg",
        links: [{ nodeId: "pano_23", yaw: "68.6deg" }]
    },
    {
        id: "pano_22",
        name: "Hallway 22",
        file: "floor_01_partial_room_10_pano_22.jpg",
        links: [{ nodeId: "pano_27", yaw: "169.7deg" }, { nodeId: "pano_23", yaw: "40.0deg" }, { nodeId: "pano_16", yaw: "2.2deg" }, { nodeId: "pano_17", yaw: "1.4deg" }, { nodeId: "pano_24", yaw: "-104.4deg" }]
    },
    {
        id: "pano_23",
        name: "Closet 23",
        file: "floor_01_partial_room_16_pano_23.jpg",
        links: [{ nodeId: "pano_21", yaw: "-7.8deg" }, { nodeId: "pano_22", yaw: "174.7deg" }]
    },
    {
        id: "pano_24",
        name: "Bedroom 24",
        file: "floor_01_partial_room_11_pano_24.jpg",
        links: [{ nodeId: "pano_22", yaw: "137.7deg" }, { nodeId: "pano_25", yaw: "-88.2deg" }]
    },
    {
        id: "pano_25",
        name: "Bedroom 25",
        file: "floor_01_partial_room_11_pano_25.jpg",
        links: [{ nodeId: "pano_24", yaw: "117.6deg" }]
    },
    {
        id: "pano_26",
        name: "Closet 26",
        file: "floor_01_partial_room_05_pano_26.jpg",
        links: [{ nodeId: "pano_20", yaw: "161.3deg" }]
    },
    {
        id: "pano_27",
        name: "Bedroom 27",
        file: "floor_01_partial_room_19_pano_27.jpg",
        links: [{ nodeId: "pano_28", yaw: "69.6deg" }, { nodeId: "pano_29", yaw: "-0.2deg" }, { nodeId: "pano_22", yaw: "-77.0deg" }]
    },
    {
        id: "pano_28",
        name: "Bedroom 28",
        file: "floor_01_partial_room_19_pano_28.jpg",
        links: [{ nodeId: "pano_27", yaw: "-134.5deg" }]
    },
    {
        id: "pano_29",
        name: "Closet 29",
        file: "floor_01_partial_room_02_pano_29.jpg",
        links: [{ nodeId: "pano_27", yaw: "120.9deg" }]
    },
    {
        id: "pano_31",
        name: "Laundry 31",
        file: "floor_01_partial_room_08_pano_31.jpg",
        links: [{ nodeId: "pano_33", yaw: "67.7deg" }, { nodeId: "pano_32", yaw: "-19.3deg" }]
    },
    {
        id: "pano_32",
        name: "Bathroom 32",
        file: "floor_01_partial_room_04_pano_32.jpg",
        links: [{ nodeId: "pano_9", yaw: "117.4deg" }, { nodeId: "pano_31", yaw: "1.0deg" }]
    },
    {
        id: "pano_33",
        name: "Garage 33",
        file: "floor_01_partial_room_15_pano_33.jpg",
        links: [{ nodeId: "pano_31", yaw: "-170.4deg" }, { nodeId: "pano_34", yaw: "24.9deg" }]
    },
    {
        id: "pano_34",
        name: "Garage 34",
        file: "floor_01_partial_room_15_pano_34.jpg",
        links: [{ nodeId: "pano_33", yaw: "-160.5deg" }]
    },
];

export type TourNode = VirtualTourNode & {
    readonly data: {
        readonly model?: TourModelPlacement;
    };
};

export const tourNodes: TourNode[] = zindPanos.map(({ id, name, file, links, model }) => {
    const panorama = `${panoramaBasePath}/${file}`;

    return {
        id,
        name,
        panorama,
        thumbnail: panorama,
        data: {
            model: {
                ...defaultModelPlacement,
                ...model,
            },
        },
        links: links.map(({ nodeId, yaw }) => ({
            nodeId,
            position: {
                yaw,
                pitch: linkPitch,
            },
        })),
    };
});
