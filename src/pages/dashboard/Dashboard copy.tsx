import React, { useCallback } from "react";
import '@xyflow/react/dist/style.css';
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    ReactFlowProvider,
    MarkerType,
    Node,
    Edge,
    Connection,
} from "@xyflow/react";

import { inFlowData } from "./inflowData";
import { outFlowData } from "./outflowData";

let nodeId = 0;
const getId = () => `node_${nodeId++}`;

type NodeType = "inflow" | "outflow" | "tx";

const Dashboard = () => {
    const nodeMap = new Map<string, string>(); // maps address or tx_id to node ID
    const nodesArr: Node[] = [];
    const edgesArr: Edge[] = [];

    // Create or get existing node
    const createNode = (
        addressOrTx: string,
        type: NodeType,
        entity: string,
        x = 0,
        y = 0
    ): string => {
        if (nodeMap.has(addressOrTx)) return nodeMap.get(addressOrTx)!;

        const id = getId();
        const style = {
            padding: 10,
            border: "2px solid #333",
            borderRadius: 10,
            background: type === "inflow" ? "#d1f7c4" : type === "outflow" ? "#fbdede" : "#e6e6fa",
            width: 220,
        };

        const node: Node = {
            id,
            type: "default",
            data: {
                label: (
                    <div>
                        <strong>{entity}</strong>
                        <div style={{ fontSize: 12 }}>{addressOrTx}</div>
                    </div>
                ),
            },
            position: { x, y },
            style,
        };

        nodesArr.push(node);
        nodeMap.set(addressOrTx, id);
        return id;
    };

    // --- Process inflows
    inFlowData.data.forEach((entry, idx) => {
        const beneficiaryId = createNode(entry.beneficiary_address, "inflow", entry.entity_name, 300, idx * 200);

        entry.transactions.forEach((tx) => {
            const txId = `tx_${tx.transaction_id}`;
            const txNodeId = createNode(tx.transaction_id, "tx", "TX", 0, idx * 200);

            edgesArr.push({
                id: txId,
                source: txNodeId,
                target: beneficiaryId,
                type: "smoothstep",
                markerEnd: { type: MarkerType.ArrowClosed },
            });
        });
    });

    // --- Process outflows
    outFlowData.data.forEach((entry, idx) => {
        const payerId = createNode(entry.payer_address, "outflow", entry.entity_name, -300, idx * 200);

        entry.transactions.forEach((tx) => {
            const txId = `tx_${tx.transaction_id}`;
            const txNodeId = createNode(tx.transaction_id, "tx", "TX", 0, idx * 200);

            edgesArr.push({
                id: txId,
                source: payerId,
                target: txNodeId,
                type: "smoothstep",
                markerEnd: { type: MarkerType.ArrowClosed },
            });
        });
    });

    const [nodes, , onNodesChange] = useNodesState(nodesArr);
    const [edges, setEdges, onEdgesChange] = useEdgesState(edgesArr);

    const onConnect = useCallback(
        (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    return (
        <>
            <h1 className="dark:text-white">Dashboard</h1>
            <ReactFlowProvider>
                <div style={{ height: "90vh", width: "100%" }}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        fitView
                        panOnDrag
                        zoomOnScroll
                        zoomOnPinch
                    >
                        <MiniMap />
                        <Controls />
                        <Background color="#aaa" gap={16} />
                    </ReactFlow>
                </div>
            </ReactFlowProvider>
        </>
    );
};

export { Dashboard };
