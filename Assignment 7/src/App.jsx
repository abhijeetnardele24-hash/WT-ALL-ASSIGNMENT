import React, { useState, useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import UmlClassNode from './UmlClassNode';
import Sidebar from './Sidebar';
import './App.css';

const nodeTypes = {
  umlClass: UmlClassNode,
};

const initialNodes = [
  {
    id: '1',
    type: 'umlClass',
    position: { x: 250, y: 100 },
    data: {
      name: 'Person',
      attributes: [{ name: 'name', type: 'String', visibility: '-' }, { name: 'age', type: 'int', visibility: '-' }],
      methods: [{ name: 'getName', returnType: 'String', visibility: '+' }],
    },
  },
];
const initialEdges = [];

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const onConnect = useCallback((params) => {
    // Add relationship type based on current selection or default to association
    setEdges((eds) => addEdge({ ...params, type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } }, eds));
  }, [setEdges]);

  // Handle node selection
  const onSelectionChange = useCallback(({ nodes }) => {
    if (nodes.length === 1) {
      setSelectedNodeId(nodes[0].id);
    } else {
      setSelectedNodeId(null);
    }
  }, []);

  const addClass = () => {
    const newNode = {
      id: `node-${Date.now()}`,
      type: 'umlClass',
      position: { x: Math.random() * 200 + 100, y: Math.random() * 200 + 100 },
      data: {
        name: 'NewClass',
        attributes: [],
        methods: [],
      },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const updateNodeData = (id, newData) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return { ...node, data: newData };
        }
        return node;
      })
    );
  };
  
  const deleteNode = (id) => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
    setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
    setSelectedNodeId(null);
  };

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  return (
    <div className="dndflow">
      <Sidebar 
        addClass={addClass}
        selectedNode={selectedNode}
        updateNodeData={updateNodeData}
        deleteNode={deleteNode}
        nodes={nodes}
        edges={edges}
      />
      <div className="reactflow-wrapper">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onSelectionChange={onSelectionChange}
          nodeTypes={nodeTypes}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
}
