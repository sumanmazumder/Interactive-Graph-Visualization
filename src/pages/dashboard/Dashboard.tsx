import { useCallback, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../reducers/store';
import { inFlowData } from "./inflowData";
import { outFlowData } from "./outflowData";
import '@xyflow/react/dist/style.css';
import { Position } from "@xyflow/react";
import { toSvg } from 'html-to-image';
import { setinflowGraphData } from "../../reducers/InflowGraphReducers";
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    // ReactFlowProvider,
    MarkerType,
    Node,
    Edge,
    // Connection,
    BackgroundVariant, Handle,
} from "@xyflow/react";
import inflowImg from "../../assets/inflow.svg"
import outflowimg from "../../assets/outflow.svg"
import { setoutflowGraphData } from "../../reducers/OutflowGraphReducers";


const InflowNode = ({ data }: any) => (
    <div style={{
        // padding: 10,
        background: "#f68c37",
        // border: "1px solid #00796b",
        borderRadius: '100%',
        width: '130px',
        height: '130px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    }}>
        <strong className="text-center text-white">Inflow</strong>
        <p className="text-center text-white text-sm/2">{data.label}</p>
        <img src={data?.image} className="absolute top-0 right-0 -z-1" />
        <Handle type="target" position={Position.Left} />
        <Handle type="source" position={Position.Right} />
    </div>
);

const OutflowNode = ({ data }: any) => (
    <div className="" style={{
        // padding: 10, 
        background: "#3f7ec1",
        // border: "1px solid #ef6c00", 
        borderRadius: '100%',
        width: '130px',
        height: '130px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    }}>
        <strong className="text-center text-white">Outflow</strong>
        <p className="text-white text-center">{data.label}</p>
        <img src={data?.image} className="absolute top-0 right-0 -z-1" />
        <Handle type="target" position={Position.Left} />
        <Handle type="source" position={Position.Right} />
    </div>
);
const nodeType = {
    inflow: InflowNode,
    outflow: OutflowNode,
}

type WalletNode = Node & { type: "inflow" | "outflow" | 'left' | 'right'; };



// const manualNodePositions:any = {
//     'Changnow': { x: 0, y: 200 },
//     'Unknown1': { x: 200, y: 100 },
//     'Custom Node': { x: 400, y: 100 },
//     'Whitebit1': { x: 600, y: 100 },
//     'Unknown2': { x: 800, y: 100 },
//     'Unknown3': { x: 1000, y: 100 },
//     'Unknown4': { x: 600, y: 300 }, // lower tier
//     'Whitebit2': { x: 800, y: 300 }, // lower tier
// };



const generateWalletNodes = (inFlowData: any, outFlowData: any): WalletNode[] => {
    console.log("Inflow data", inFlowData, "Outflow Data", outFlowData);
    const walletMap = new Map<string, WalletNode>();
    let y = 0 * 2;

    // Inflow nodes from original inflowData
    inFlowData?.data?.forEach((entry: any) => {
        if (entry?.beneficiary_address && !walletMap.has(entry.beneficiary_address)) {
            walletMap.set(entry.beneficiary_address, {
                id: entry.beneficiary_address,
                position: { x: 0, y },
                data: {
                    label: `${entry.entity_name || "Unknown"}`,
                    image: inflowImg
                },
                type: "inflow",
                // targetPosition: Position.Left,
                // sourcePosition: Position.Right,
            });
            y += 140;
        }
    });

    // Flattened all records from outFlowData (including inflow-style ones)
    const flattenedOutflows: any[] = Array.isArray(outFlowData)
        ? outFlowData.flatMap((item: any) => item?.data ?? item)
        : outFlowData?.data ?? [];
    console.log("Merged Outflow data", flattenedOutflows);

    flattenedOutflows?.forEach((entry: any) => {
        // Create node for payer_address (outflow)
        if (entry?.payer_address && !walletMap.has(entry.payer_address)) {
            walletMap.set(entry.payer_address, {
                id: entry.payer_address,
                position: { x: 300, y },
                data: {
                    label: `${entry.entity_name || "Unknown"}`,
                    image: outflowimg,
                },
                type: "outflow",
                // targetPosition: Position.Left,
                // sourcePosition: Position.Right,
            });
            y += 140;
        }

        // Create node for beneficiary_address (inflow)
        if (entry?.beneficiary_address && !walletMap.has(entry.beneficiary_address)) {
            walletMap.set(entry.beneficiary_address, {
                id: entry.beneficiary_address,
                position: { x: 300, y },
                data: {
                    label: `${entry.entity_name || "Unknown"}`,
                    image: outflowimg,
                },
                type: "outflow",
                // targetPosition: Position.Left,
                // sourcePosition: Position.Right,
            });
            y += 140;
        }
    });

    return Array.from(walletMap.values());
};


// const generateEdegeS = (nodes: Node[]): Edge[] => {
//     const edges: Edge[] = [];
//     for (let i = 0; i < nodes.length - 1; i++) {
//         edges.push({
//             id: `e${nodes[i].id}-${nodes[i + 1].id}`,
//             source: nodes[i].id,
//             target: nodes[i + 1].id,
//             markerEnd: {
//                 type: MarkerType.Arrow,
//             },
//             animated: true,
//             type: 'smoothstep',
//             style: {
//                 strokeWidth: 3,
//                 stroke: '#333'
//             },
//             labelStyle: {
//                 fill: "#000",          // Optional: label color
//                 fontWeight: 600,
//                 fontSize: 12,
//             },
//         });
//     }
//     return edges;
// }

const initialEdeges: Edge[] = [
    {
        id: 'in-1',
        source: 'bc1qq7ldp3mza8q7q9e9gmzg72rzafyegckg57wluu',
        target: 'bc1q6nxdnz58kexp48sm2t3scwqcw9stt7r8s7uuwn',
        animated: true,
        type: 'smoothstep',
        style: {
            strokeWidth: 3,
            stroke: '#333'
        },
        labelStyle: {
            fill: "#000",          // Optional: label color
            fontWeight: 600,
            fontSize: 12,
        },
    },
    {
        id: 'in-2',
        source: 'bc1qng0keqn7cq6p8qdt4rjnzdxrygnzq7nd0pju8q',
        target: 'bc1qq7ldp3mza8q7q9e9gmzg72rzafyegckg57wluu',
        animated: true,
        type: 'smoothstep',
        style: {
            strokeWidth: 3,
            stroke: '#333'
        },
        labelStyle: {
            fill: "#000",          // Optional: label color
            fontWeight: 600,
            fontSize: 12,
        },
    },
    {
        id: 'ou-1',
        source: 'bc1q6nxdnz58kexp48sm2t3scwqcw9stt7r8s7uuwn',
        target: 'bc1qf786lw92dy09cx3tt9qhn4tf69dw9ak7m3ktkk',
        animated: true,
        type: 'smoothstep',
        style: {
            strokeWidth: 3,
            stroke: '#333'
        },
        labelStyle: {
            fill: "#000",          // Optional: label color
            fontWeight: 600,
            fontSize: 12,
        },
    },
    {
        id: 'ou-2',
        source: 'bc1qf786lw92dy09cx3tt9qhn4tf69dw9ak7m3ktkk',
        target: '3Bn9uxMTY9HpTLaCo9YNBTq96QNhSYRxJk',
        animated: true,
        type: 'smoothstep',
        style: {
            strokeWidth: 3,
            stroke: '#333'
        },
        labelStyle: {
            fill: "#000",          // Optional: label color
            fontWeight: 600,
            fontSize: 12,
        },
    },
    {
        id: 'ou-3',
        source: '3Bn9uxMTY9HpTLaCo9YNBTq96QNhSYRxJk',
        target: '39RxUoh4ETUm37tprzYApgFJioQAUd8im9',
        animated: true,
        type: 'smoothstep',
        style: {
            strokeWidth: 3,
            stroke: '#333'
        },
        labelStyle: {
            fill: "#000",          // Optional: label color
            fontWeight: 600,
            fontSize: 12,
        },
    },
    {
        id: 'ou-4',
        source: '39RxUoh4ETUm37tprzYApgFJioQAUd8im9',
        target: 'bc1qre7n9nm6fec9ffqgsuk906qmg9mwvvsc99tytz',
        animated: true,
        type: 'smoothstep',
        style: {
            strokeWidth: 3,
            stroke: '#333'
        },
        labelStyle: {
            fill: "#000",          // Optional: label color
            fontWeight: 600,
            fontSize: 12,
        },
    },
    {
        id: 'ou-5',
        source: 'bc1qre7n9nm6fec9ffqgsuk906qmg9mwvvsc99tytz',
        target: 'bc1qajuxzxmpejurlslkrq7y9dpyegp7392ty8x5xt',
        animated: true,
        type: 'smoothstep',
        style: {
            strokeWidth: 3,
            stroke: '#333'
        },
        labelStyle: {
            fill: "#000",          // Optional: label color
            fontWeight: 600,
            fontSize: 12,
        },
    },
];

const Dashboard = () => {
    const reactFlowWrapper = useRef<HTMLDivElement | null>(null);

    // redux
    const inflowReduxData = useSelector((state: RootState) => state?.inflowgraphReducer?.inflowgraphData) || {};
    const outflowReduxData = useSelector((state: RootState) => state?.outflowGraphReducer.outflowgraphData) || [];
    const dispatch = useDispatch();
    useEffect(() => {
        if (inFlowData?.message === "success" && outFlowData[0]?.message === "success") {
            dispatch(setinflowGraphData(inFlowData));
            dispatch(setoutflowGraphData(outFlowData));
        }
    }, [dispatch]);

    useEffect(() => {
        console.log("========>", inflowReduxData, outflowReduxData, outFlowData);
    }, [inflowReduxData, outflowReduxData])


    // Nodes Create
    // const initialNodes = generateNodesFromInflow();
    // const initialNodes = generateWalletNodes(inFlowData, outFlowData);
    const nodesFromRedux = useMemo(() => {
        if (!inflowReduxData || !outflowReduxData) return [];
        return generateWalletNodes(inflowReduxData, outflowReduxData);
    }, [inflowReduxData, outflowReduxData]);


    // Egges Create
    // const initialEdges = generateEdgesFromTransactions(inFlowData, outFlowData);
    // const initialEdges = generateEdegeS(initialNodes);
    // const edgesFromRedux = useMemo(() => generateEdegeS(nodesFromRedux), [nodesFromRedux]);


    const [nodes, setNodes, onNodesChange] = useNodesState(nodesFromRedux);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdeges);

    useEffect(() => {
        const nodes = generateWalletNodes(inflowReduxData, outflowReduxData);
        // const edges = generateEdegeS(nodes);
        setNodes(nodes);
        setEdges(initialEdeges);
    }, [inflowReduxData, outflowReduxData]);

    // connection of edegs
    const onConnect = useCallback((params: any) => {
        console.log("Connection", params);
        return setEdges((eds: any) => {
            console.log("eds", eds);
            return addEdge(params, eds)
        })
    }, [setEdges]);


    // download SVG
    const downloadSvg = () => {
        if (!reactFlowWrapper.current) return;
        toSvg(reactFlowWrapper.current)
            .then((dataUrl) => {
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = 'react-flow-diagram.svg';
                link.click();
            })
            .catch((err) => {
                console.error('SVG export failed', err);
            });
    };

    return (
        <>
            {/* <img src={image} /> */}
            {/* <h1 className="dark:text-white">Dashboard</h1> */}
            <button onClick={downloadSvg} className="absolute top-0 right-0 bg-blue-800 text-1xl text-white p-2 mt-5 mr-5 z-999 rounded-sm">Export to SVG</button>
            <div style={{ width: '100%', height: '90vh' }} id="reactflow-wrapper" className="react-flow__renderer"  >
                <div ref={reactFlowWrapper} style={{ width: '100%', height: '100%' }}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        // onConnect={onEdegeConnection}
                        nodeTypes={nodeType}
                        // onInit={onInit}
                        fitView
                        panOnDrag
                        zoomOnScroll
                        zoomOnPinch
                    >
                        <Controls />
                        <MiniMap />
                        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
                    </ReactFlow>
                </div>
            </div>
        </>
    );
};

export { Dashboard };