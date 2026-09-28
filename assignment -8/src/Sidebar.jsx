import React, { useState } from 'react';

const Sidebar = ({ addClass, selectedNode, updateNodeData, deleteNode, nodes, edges }) => {
  const [showCode, setShowCode] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');

  const generateJavaCode = () => {
    let code = '';
    
    nodes.forEach(node => {
      const data = node.data;
      const className = data.name || 'UnnamedClass';
      
      // Find inheritance (edges where source is a parent, target is this node... wait, UML inheritance is arrow from child to parent)
      // If arrow goes from child to parent, edge.source = child, edge.target = parent
      let extendsClass = '';
      const inheritanceEdge = edges.find(e => e.source === node.id && e.type === 'smoothstep'); // Just simple matching for now
      if (inheritanceEdge) {
        const parentNode = nodes.find(n => n.id === inheritanceEdge.target);
        if (parentNode) {
          extendsClass = ` extends ${parentNode.data.name}`;
        }
      }

      code += `public class ${className}${extendsClass} {\n`;
      
      if (data.attributes) {
        data.attributes.forEach(attr => {
          const vis = attr.visibility === '-' ? 'private' : (attr.visibility === '+' ? 'public' : 'protected');
          code += `    ${vis} ${attr.type} ${attr.name};\n`;
        });
      }
      
      if (data.methods) {
        data.methods.forEach(method => {
          const vis = method.visibility === '-' ? 'private' : (method.visibility === '+' ? 'public' : 'protected');
          code += `\n    ${vis} ${method.returnType} ${method.name}() {\n        // TODO: implement\n    }\n`;
        });
      }
      
      code += `}\n\n`;
    });
    
    setGeneratedCode(code);
    setShowCode(true);
  };

  const handleNameChange = (e) => {
    updateNodeData(selectedNode.id, { ...selectedNode.data, name: e.target.value });
  };

  const addAttribute = () => {
    const newAttrs = [...(selectedNode.data.attributes || []), { name: 'newAttr', type: 'String', visibility: '-' }];
    updateNodeData(selectedNode.id, { ...selectedNode.data, attributes: newAttrs });
  };

  const updateAttribute = (idx, field, value) => {
    const newAttrs = [...selectedNode.data.attributes];
    newAttrs[idx][field] = value;
    updateNodeData(selectedNode.id, { ...selectedNode.data, attributes: newAttrs });
  };

  const removeAttribute = (idx) => {
    const newAttrs = selectedNode.data.attributes.filter((_, i) => i !== idx);
    updateNodeData(selectedNode.id, { ...selectedNode.data, attributes: newAttrs });
  };

  const addMethod = () => {
    const newMethods = [...(selectedNode.data.methods || []), { name: 'newMethod', returnType: 'void', visibility: '+' }];
    updateNodeData(selectedNode.id, { ...selectedNode.data, methods: newMethods });
  };

  const updateMethod = (idx, field, value) => {
    const newMethods = [...selectedNode.data.methods];
    newMethods[idx][field] = value;
    updateNodeData(selectedNode.id, { ...selectedNode.data, methods: newMethods });
  };

  const removeMethod = (idx) => {
    const newMethods = selectedNode.data.methods.filter((_, i) => i !== idx);
    updateNodeData(selectedNode.id, { ...selectedNode.data, methods: newMethods });
  };

  return (
    <div className="sidebar">
      <h2>UML Diagram Editor</h2>
      <div className="sidebar-actions">
        <button onClick={addClass} className="btn-primary">Add Class</button>
        <button onClick={generateJavaCode} className="btn-secondary">Generate Java Code</button>
      </div>
      
      {selectedNode && (
        <div className="editor-panel">
          <h3>Edit Class</h3>
          <div className="form-group">
            <label>Class Name:</label>
            <input type="text" value={selectedNode.data.name} onChange={handleNameChange} />
          </div>
          
          <div className="section-header">
            <h4>Attributes</h4>
            <button onClick={addAttribute} className="btn-small">+</button>
          </div>
          {selectedNode.data.attributes && selectedNode.data.attributes.map((attr, idx) => (
            <div key={idx} className="edit-row">
              <select value={attr.visibility} onChange={(e) => updateAttribute(idx, 'visibility', e.target.value)}>
                <option value="-">- (Private)</option>
                <option value="+">+ (Public)</option>
                <option value="#"># (Protected)</option>
              </select>
              <input type="text" value={attr.name} onChange={(e) => updateAttribute(idx, 'name', e.target.value)} placeholder="Name" />
              <input type="text" value={attr.type} onChange={(e) => updateAttribute(idx, 'type', e.target.value)} placeholder="Type" />
              <button onClick={() => removeAttribute(idx)} className="btn-danger">x</button>
            </div>
          ))}

          <div className="section-header">
            <h4>Methods</h4>
            <button onClick={addMethod} className="btn-small">+</button>
          </div>
          {selectedNode.data.methods && selectedNode.data.methods.map((method, idx) => (
            <div key={idx} className="edit-row">
              <select value={method.visibility} onChange={(e) => updateMethod(idx, 'visibility', e.target.value)}>
                <option value="+">+ (Public)</option>
                <option value="-">- (Private)</option>
                <option value="#"># (Protected)</option>
              </select>
              <input type="text" value={method.name} onChange={(e) => updateMethod(idx, 'name', e.target.value)} placeholder="Name" />
              <input type="text" value={method.returnType} onChange={(e) => updateMethod(idx, 'returnType', e.target.value)} placeholder="Return" />
              <button onClick={() => removeMethod(idx)} className="btn-danger">x</button>
            </div>
          ))}
          
          <div style={{ marginTop: '20px' }}>
            <button onClick={() => deleteNode(selectedNode.id)} className="btn-danger w-full">Delete Class</button>
          </div>
        </div>
      )}
      
      {showCode && (
        <div className="code-modal">
          <div className="code-modal-header">
            <h3>Generated Java Code</h3>
            <button onClick={() => setShowCode(false)}>Close</button>
          </div>
          <pre>{generatedCode}</pre>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
