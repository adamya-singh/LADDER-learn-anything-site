"use client";

import { ReactNode } from 'react';
import { TreeNodeData } from '@/app/types/TreeNode';
import { Plus } from 'lucide-react';

interface TreeNodeProps {
  node: TreeNodeData;
  onAddChild: (parentId: string, position: 'left' | 'right') => void;
}

export function TreeNode({ node, onAddChild }: TreeNodeProps) {
  return (
    <div className="relative flex flex-col items-center">
      <div className="monarch-node p-4 rounded-lg min-w-[200px] max-w-[400px] text-center break-words relative group">
        {node.content}
        <div className="absolute -bottom-8 left-0 right-0 flex justify-center gap-12 opacity-0 group-hover:opacity-100 transition-opacity">
          {!node.left && (
            <button
              onClick={() => onAddChild(node.id, 'left')}
              className="flex items-center justify-center w-6 h-6 rounded-full bg-[hsl(var(--cyber-blue))] hover:bg-[hsl(var(--bright-blue))] transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
          {!node.right && (
            <button
              onClick={() => onAddChild(node.id, 'right')}
              className="flex items-center justify-center w-6 h-6 rounded-full bg-[hsl(var(--cyber-blue))] hover:bg-[hsl(var(--bright-blue))] transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      {(node.left || node.right) && (
        <div className="flex gap-8 mt-12">
          {node.left && (
            <TreeNode
              node={node.left}
              onAddChild={onAddChild}
            />
          )}
          {node.right && (
            <TreeNode
              node={node.right}
              onAddChild={onAddChild}
            />
          )}
        </div>
      )}
    </div>
  );
}