"use client";

import { TreeNodeData } from '@/app/types/TreeNode';
import { Loader2 } from 'lucide-react';

interface TreeNodeProps {
  node: TreeNodeData;
  onAddChild: (parentId: string, position: 'left' | 'right') => void;
}

export function TreeNode({ node }: TreeNodeProps) {
  const hasChildren = node.left || node.right;

  return (
    <div className="relative flex flex-col items-center">
      <div className="monarch-node p-4 rounded-lg min-w-[200px] max-w-[400px] text-center break-words relative bg-background border border-[hsl(var(--cyber-blue))]">
        {node.isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Generating...</span>
          </div>
        ) : (
          node.content
        )}
      </div>
      
      {hasChildren && (
        <>
          {/* Vertical line from parent to children */}
          <div className="w-px h-8 bg-gradient-to-b from-[hsl(var(--cyber-blue))] to-[hsl(var(--bright-blue))]" />
          
          {/* Horizontal line connecting children */}
          <div className="relative h-px w-full max-w-[400px] bg-gradient-to-r from-[hsl(var(--cyber-blue))] via-[hsl(var(--bright-blue))] to-[hsl(var(--cyber-blue))]" />
          
          {/* Container for child nodes with proper spacing */}
          <div className="flex gap-16 mt-8">
            {node.left && (
              <div className="relative">
                {/* Vertical line to left child */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-4 bg-gradient-to-b from-[hsl(var(--cyber-blue))] to-[hsl(var(--bright-blue))]" />
                <TreeNode
                  node={node.left}
                  onAddChild={() => {}}
                />
              </div>
            )}
            {node.right && (
              <div className="relative">
                {/* Vertical line to right child */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-4 bg-gradient-to-b from-[hsl(var(--cyber-blue))] to-[hsl(var(--bright-blue))]" />
                <TreeNode
                  node={node.right}
                  onAddChild={() => {}}
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}