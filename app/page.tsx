"use client";

import { useState, KeyboardEvent, ChangeEvent } from "react";
import { Sword, Search, Sparkles } from "lucide-react";
import { TreeNode } from "@/components/TreeNode";
import { TreeNodeData } from "./types/TreeNode";
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  const [query, setQuery] = useState("");
  const [levels, setLevels] = useState(1);
  const [rootNode, setRootNode] = useState<TreeNodeData | null>(null);

  const generateNodeContent = async (parentContent: string, position: 'left' | 'right'): Promise<string> => {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ parentContent, position }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate content');
    }

    const data = await response.json();
    return data.content;
  };

  const generateTree = async (content: string, currentLevel: number, maxLevels: number): Promise<TreeNodeData> => {
    const node: TreeNodeData = {
      content,
      id: uuidv4(),
    };

    if (currentLevel < maxLevels) {
      // Create placeholder nodes with loading state
      node.left = {
        content: '',
        id: uuidv4(),
        isLoading: true,
      };
      node.right = {
        content: '',
        id: uuidv4(),
        isLoading: true,
      };

      // Update the state to show loading
      setRootNode(structuredClone(node));

      try {
        // Generate content for both children simultaneously
        const [leftContent, rightContent] = await Promise.all([
          generateNodeContent(content, 'left'),
          generateNodeContent(content, 'right'),
        ]);

        // Recursively generate subtrees
        const [leftSubtree, rightSubtree] = await Promise.all([
          generateTree(leftContent, currentLevel + 1, maxLevels),
          generateTree(rightContent, currentLevel + 1, maxLevels),
        ]);

        node.left = leftSubtree;
        node.right = rightSubtree;

        // Update the state with the new nodes
        setRootNode(structuredClone(node));
      } catch (error) {
        console.error('Error generating tree:', error);
        // Update nodes to show error state
        node.left = {
          content: 'Error generating content',
          id: uuidv4(),
        };
        node.right = {
          content: 'Error generating content',
          id: uuidv4(),
        };
        setRootNode(structuredClone(node));
      }
    }

    return node;
  };

  const handleKeyPress = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      const validLevels = Math.min(Math.max(1, levels), 6); // Limit to 6 levels max
      await generateTree(query.trim(), 0, validLevels);
      setQuery("");
    }
  };

  const handleLevelsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    setLevels(Math.min(Math.max(1, value), 6)); // Limit to 1-6 levels
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
      
      <div className="relative max-w-6xl mx-auto px-4 pt-20 arise">
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
            Unlock the abilities you seek
          </p>
        </div>

        <div className="relative max-w-2xl mx-auto group">
          <div className="absolute -inset-1 bg-gradient-to-r from-[hsl(var(--cyber-blue))] to-[hsl(var(--bright-blue))] rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative flex gap-6 items-center">
            <div className="flex-1 relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="What knowledge do you seek?"
                className="w-full monarch-input text-xl px-6 py-5 rounded-lg text-foreground placeholder:text-foreground/40"
                autoFocus
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-[hsl(var(--neon-blue))] opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex-shrink-0">
              <input
                type="number"
                min="1"
                max="6"
                value={levels}
                onChange={handleLevelsChange}
                className="w-24 monarch-input text-xl px-4 py-5 rounded-lg text-foreground text-center"
                placeholder="Levels"
              />
            </div>
          </div>
          <div className="absolute inset-0 pointer-events-none rounded-lg" 
               style={{
                 background: "linear-gradient(90deg, transparent, hsla(var(--bright-blue), 0.2), transparent)",
                 animation: "scan 3s linear infinite"
               }} 
          />
        </div>

        {rootNode && (
          <div className="mt-16 flex justify-center arise overflow-x-auto pb-8">
            <div className="min-w-fit">
              <TreeNode 
                node={rootNode}
                onAddChild={() => {}}
              />
            </div>
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