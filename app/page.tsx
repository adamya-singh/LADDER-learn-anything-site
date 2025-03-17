"use client";

import { useState, KeyboardEvent } from "react";
import { Sword, Search, Sparkles } from "lucide-react";
import { TreeNode } from "@/components/TreeNode";
import { TreeNodeData } from "./types/TreeNode";
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  const [query, setQuery] = useState("");
  const [rootNode, setRootNode] = useState<TreeNodeData | null>(null);
  const [pendingParentId, setPendingParentId] = useState<string | null>(null);
  const [pendingPosition, setPendingPosition] = useState<'left' | 'right' | null>(null);

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      if (!rootNode) {
        // Create root node
        setRootNode({
          content: query.trim(),
          id: uuidv4()
        });
      } else if (pendingParentId && pendingPosition) {
        // Add child node
        const newNode = {
          content: query.trim(),
          id: uuidv4()
        };
        
        setRootNode(addChildNode(rootNode, pendingParentId, pendingPosition, newNode));
        setPendingParentId(null);
        setPendingPosition(null);
      }
      setQuery("");
    }
  };

  const addChildNode = (
    node: TreeNodeData,
    parentId: string,
    position: 'left' | 'right',
    newNode: TreeNodeData
  ): TreeNodeData => {
    if (node.id === parentId) {
      return {
        ...node,
        [position]: newNode
      };
    }

    return {
      ...node,
      left: node.left ? addChildNode(node.left, parentId, position, newNode) : undefined,
      right: node.right ? addChildNode(node.right, parentId, position, newNode) : undefined
    };
  };

  const handleAddChild = (parentId: string, position: 'left' | 'right') => {
    setPendingParentId(parentId);
    setPendingPosition(position);
  };

  return (
    <main className="min-h-screen shadow-grid relative overflow-hidden">
      <div className="shadow-particles" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background" />
      
      {/* Decorative elements */}
      <div className="cyber-circle w-[600px] h-[600px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
      <div className="cyber-circle w-[800px] h-[800px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
      <div className="cyber-line h-[2px] w-[200px] top-20 left-20 rotate-45" />
      <div className="cyber-line h-[2px] w-[200px] top-40 right-20 -rotate-45" />
      
      <div className="relative max-w-4xl mx-auto px-4 pt-20 arise">
        <div className="flex flex-col items-center justify-center mb-16 space-y-6">
          <div className="relative group">
            <Sword className="w-16 h-16 text-[hsl(var(--cyber-blue))] mb-8 transform -rotate-45 transition-transform group-hover:rotate-[315deg] duration-700" />
            <div className="absolute inset-0 blur-xl opacity-50 transition-opacity group-hover:opacity-75">
              <Sword className="w-16 h-16 text-[hsl(var(--bright-blue))] transform -rotate-45 group-hover:rotate-[315deg] duration-700" />
            </div>
            <Sparkles className="absolute -right-6 -top-6 w-6 h-6 text-[hsl(var(--neon-blue))] animate-pulse" />
          </div>
          
          <h1 className="text-7xl font-bold tracking-tighter monarch-text bg-clip-text text-transparent bg-gradient-to-r from-[hsl(var(--cyber-blue))] to-[hsl(var(--bright-blue))]">
            Learn Anything
          </h1>
          
          <p className="text-[hsl(var(--neon-blue))] text-lg opacity-80">
            {pendingParentId 
              ? `Add ${pendingPosition} child node...` 
              : "Unlock the abilities you seek"}
          </p>
        </div>

        <div className="relative max-w-2xl mx-auto group">
          <div className="absolute -inset-1 bg-gradient-to-r from-[hsl(var(--cyber-blue))] to-[hsl(var(--bright-blue))] rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={pendingParentId ? "Enter content for the new node..." : "What knowledge do you seek?"}
              className="w-full monarch-input text-xl px-6 py-5 rounded-lg text-foreground placeholder:text-foreground/40"
              autoFocus
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-[hsl(var(--neon-blue))] opacity-50 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="absolute inset-0 pointer-events-none rounded-lg" 
               style={{
                 background: "linear-gradient(90deg, transparent, hsla(var(--bright-blue), 0.2), transparent)",
                 animation: "scan 3s linear infinite"
               }} 
          />
        </div>

        {rootNode && (
          <div className="mt-16 flex justify-center arise">
            <TreeNode 
              node={rootNode}
              onAddChild={handleAddChild}
            />
          </div>
        )}

        <style jsx>{`
          @keyframes scan {
            from {
              transform: translateX(-100%);
            }
            to {
              transform: translateX(100%);
            }
          }
        `}</style>
      </div>
    </main>
  );
}