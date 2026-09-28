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
    position: { x: 450, y: 150 },
    data: {
      name: 'Person',
      attributes: [
        { name: 'name', type: 'String', visibility: '-' }, 
        { name: 'age', type: 'int', visibility: '-' }
      ],
      methods: [
        { name: 'getName', returnType: 'String', visibility: '+' }
      ],
    },
  },
  {
    id: '2',
    type: 'umlClass',
    position: { x: 450, y: 400 },
    data: {
      name: 'Student',
      attributes: [
        { name: 'studentId', type: 'String', visibility: '-' }
      ],
      methods: [
        { name: 'getStudentId', returnType: 'String', visibility: '+' }
      ],
    },
  }
];

const initialEdges = [
  {
    id: 'e2-1',
    source: '2',
    target: '1',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#8b5cf6', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#8b5cf6' },
  }
];

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge({ 
      ...params, 
      type: 'smoothstep', 
      animated: true,
      style: { stroke: '#8b5cf6', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#8b5cf6' } 
    }, eds));
  }, [setEdges]);

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
      position: { x: Math.random() * 300 + 350, y: Math.random() * 300 + 100 },
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
          colorMode="dark"
          fitView
        >
          <Controls style={{ backgroundColor: '#1e293b', fill: '#f8fafc' }} />
          <MiniMap style={{ backgroundColor: '#1e293b' }} nodeColor="#3b82f6" maskColor="rgba(15, 23, 42, 0.7)" />
          <Background variant="dots" gap={16} size={1} color="#334155" />
        </ReactFlow>
      </div>
    </div>
  );
}
