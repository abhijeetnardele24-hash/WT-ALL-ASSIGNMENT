import React, { useState } from 'react';
import { Plus, Code2, Trash2, X, Settings2 } from 'lucide-react';

const Sidebar = ({ addClass, selectedNode, updateNodeData, deleteNode, nodes, edges }) => {
  const [showCode, setShowCode] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');

  const generateJavaCode = () => {
    let code = '';
    
    nodes.forEach(node => {
      const data = node.data;
      const className = data.name || 'UnnamedClass';
      
      let extendsClass = '';
      const inheritanceEdge = edges.find(e => e.source === node.id && e.type === 'smoothstep');
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
    
    setGeneratedCode(code || '// Add classes to generate code');
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
      <h2>UML Architect</h2>
      <div className="sidebar-actions">
        <button onClick={addClass} className="btn btn-primary"><Plus size={18} /> New Class</button>
        <button onClick={generateJavaCode} className="btn btn-secondary"><Code2 size={18} /> Generate</button>
      </div>
      
      {selectedNode ? (
        <div className="editor-panel">
          <h3><Settings2 size={18} /> Edit {selectedNode.data.name}</h3>
          <div className="form-group">
            <label>Class Name</label>
            <input type="text" className="form-input" value={selectedNode.data.name} onChange={handleNameChange} />
          </div>
          
          <div className="section-header">
            <h4>Attributes</h4>
            <button onClick={addAttribute} className="btn-small"><Plus size={14}/></button>
          </div>
          {selectedNode.data.attributes && selectedNode.data.attributes.map((attr, idx) => (
            <div key={idx} className="edit-row">
              <select value={attr.visibility} onChange={(e) => updateAttribute(idx, 'visibility', e.target.value)}>
                <option value="-">-</option>
                <option value="+">+</option>
                <option value="#">#</option>
              </select>
              <input type="text" value={attr.name} onChange={(e) => updateAttribute(idx, 'name', e.target.value)} placeholder="Name" className="form-input" />
              <input type="text" value={attr.type} onChange={(e) => updateAttribute(idx, 'type', e.target.value)} placeholder="Type" className="form-input" />
              <button onClick={() => removeAttribute(idx)} className="btn-icon danger"><Trash2 size={14}/></button>
            </div>
          ))}

          <div className="section-header">
            <h4>Methods</h4>
            <button onClick={addMethod} className="btn-small"><Plus size={14}/></button>
          </div>
          {selectedNode.data.methods && selectedNode.data.methods.map((method, idx) => (
            <div key={idx} className="edit-row">
              <select value={method.visibility} onChange={(e) => updateMethod(idx, 'visibility', e.target.value)}>
                <option value="+">+</option>
                <option value="-">-</option>
                <option value="#">#</option>
              </select>
              <input type="text" value={method.name} onChange={(e) => updateMethod(idx, 'name', e.target.value)} placeholder="Name" className="form-input" />
              <input type="text" value={method.returnType} onChange={(e) => updateMethod(idx, 'returnType', e.target.value)} placeholder="Return" className="form-input" />
              <button onClick={() => removeMethod(idx)} className="btn-icon danger"><Trash2 size={14}/></button>
            </div>
          ))}
          
          <button onClick={() => deleteNode(selectedNode.id)} className="btn btn-danger w-full"><Trash2 size={18} /> Delete Class</button>
        </div>
      ) : (
        <div style={{ textAlign: 'center', color: '#94a3b8', marginTop: '40px' }}>
          Select a class on the canvas to edit its properties.
        </div>
      )}
      
      {showCode && (
        <div className="code-modal-overlay" onClick={() => setShowCode(false)}>
          <div className="code-modal" onClick={e => e.stopPropagation()}>
            <div className="code-modal-header">
              <h3><Code2 size={24} color="#3b82f6" /> Generated Java Source</h3>
              <button onClick={() => setShowCode(false)} className="btn-icon"><X size={20}/></button>
            </div>
            <pre>{generatedCode}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
