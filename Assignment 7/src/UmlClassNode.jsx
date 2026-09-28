import React from 'react';
import { Handle, Position } from '@xyflow/react';

const UmlClassNode = ({ data, selected }) => {
  return (
    <div className={`uml-node ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Top} />
      
      <div className="uml-header">
        <strong>{data.name || 'ClassName'}</strong>
      </div>
      
      <div className="uml-section">
        {data.attributes && data.attributes.length > 0 ? (
          data.attributes.map((attr, idx) => (
            <div key={idx} className="uml-item">
              {attr.visibility || '-'} {attr.name}: {attr.type}
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
              {method.visibility || '+'} {method.name}(): {method.returnType}
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
