import { useCallback, useRef } from "react";
import { inFlowData } from "./inflowData";
import '@xyflow/react/dist/style.css';
import { Position } from "@xyflow/react";
import { toSvg } from 'html-to-image';
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
  BackgroundVariant, Handle,
} from "@xyflow/react";
import inflowImg from "../../assets/inflow.svg"

const InflowNode = ({ data }: any) => (
  <div style={{
    // padding: 10,
    background: "#f68c37",
    // border: "1px solid #00796b",
    borderRadius: '100%',
    width: '100px',
    height: '100px',
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

const nodeType = {
  inflow: InflowNode,
  // outflow: OutflowNode,
}
// let nodeId = 0;

type WalletNode = Node & { type: "inflow" | "outflow" | 'left' | 'right'; };

const generateWalletNodes = (inFlowData: any): WalletNode[] => {
  const walletMap = new Map<string, WalletNode>();
  let y = 0;
  // Inflow nodes
  inFlowData.data.forEach((entry: any) => {
    if (!walletMap.has(entry.beneficiary_address)) {
      walletMap.set(entry.beneficiary_address, {
        id: entry.beneficiary_address,
        position: { x: 0, y: y },
        // data: { label: `${entry.beneficiary_address?.slice(0, 15) || "Unknown"}`, image: inflowImg, },
        data: { label: `${entry.entity_name || "Unknown"}`, image: inflowImg, },
        type: "inflow",
        targetPosition: Position.Left,
        sourcePosition: Position.Right,
      });
      y += 150;
    }
  });
  return Array.from(walletMap.values());
};

const generateEdegeS = (nodes: Node[]): Edge[] => {
  const edges: Edge[] = [];
  for (let i = 0; i < nodes.length - 1; i++) {
    edges.push({
      id: `e${nodes[i].id}-${nodes[i + 1].id}`,
      source: nodes[i].id,
      target: nodes[i + 1].id,
      markerEnd: {
        type: MarkerType.Arrow,
      },
      animated: true,
      type: 'smoothstep',
      style: {
        strokeWidth: 2.5,
        stroke: '#f68c37'
      },
      labelStyle: {
        fill: "#000",          // Optional: label color
        fontWeight: 600,
        fontSize: 12,
      },
    });
  }
  return edges;
}


const InflowGraph = () => {
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);

  // const initialNodes = generateNodesFromInflow();
  const initialNodes = generateWalletNodes(inFlowData);

  // const initialEdges = generateEdgesFromTransactions(inFlowData, outFlowData);
  const initialEdges = generateEdegeS(initialNodes)

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params: any) => {
    console.log("Connection", params);
    console.log(setNodes)
    return setEdges((eds: any) => {
      console.log("eds", eds);
      return addEdge(params, eds)
    });
    
  }, [setEdges]);

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
  )
}
export { InflowGraph }