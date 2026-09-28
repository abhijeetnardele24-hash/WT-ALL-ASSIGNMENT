import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Box, Lock, Unlock, Shield } from 'lucide-react';

const getVisibilityIcon = (vis) => {
  if (vis === '-') return <Lock size={12} className="uml-vis" style={{ color: '#ef4444' }} />;
  if (vis === '+') return <Unlock size={12} className="uml-vis" style={{ color: '#22c55e' }} />;
  if (vis === '#') return <Shield size={12} className="uml-vis" style={{ color: '#f59e0b' }} />;
  return <span className="uml-vis">{vis}</span>;
};

const UmlClassNode = ({ data, selected }) => {
  return (
    <div className={`uml-node ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Top} />
      
      <div className="uml-header">
        <Box size={16} />
        {data.name || 'ClassName'}
      </div>
      
      <div className="uml-section">
        {data.attributes && data.attributes.length > 0 ? (
          data.attributes.map((attr, idx) => (
            <div key={idx} className="uml-item">
              {getVisibilityIcon(attr.visibility || '-')} 
              <span>{attr.name}: <span className="uml-type">{attr.type}</span></span>
            </div>
          ))
        ) : (
          <div className="uml-empty">No attributes</div>
        )}
      </div>
      
      <div className="uml-section">
        {data.methods && data.methods.length > 0 ? (
          data.methods.map((method, idx) => (
            <div key={idx} className="uml-item">
              {getVisibilityIcon(method.visibility || '+')} 
              <span>{method.name}(): <span className="uml-type">{method.returnType}</span></span>
            </div>
          ))
        ) : (
          <div className="uml-empty">No methods</div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default UmlClassNode;
