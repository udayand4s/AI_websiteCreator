'use client';
import { useState } from 'react';
import { 
  Send, 
  Folder, 
  File, 
  ChevronRight, 
  ChevronDown, 
  Settings, 
  Trash2, 
  Download, 
  Copy, 
  Plus,
  X,
  MoreVertical,
  Zap,
  Play,
  Save,
  Users,
  RefreshCw
} from 'lucide-react';

// Define proper TypeScript interfaces
interface FileNode {
  name: string;
  type: 'file';
}

interface FolderNode {
  name: string;
  type: 'folder';
  expanded: boolean;
  children: (FileNode | FolderNode)[];
}

type Node = FileNode | FolderNode;

interface OpenFile {
  name: string;
  content: string;
}

interface ChatMessage {
  role: 'system' | 'user';
  content: string;
}

export default function GeneratorPage() {
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('index.js');
  const [fileTree, setFileTree] = useState<FolderNode>({
    expanded: true,
    name: 'todo-calculator',
    type: 'folder',
    children: [
      {
        name: 'src',
        type: 'folder',
        expanded: true,
        children: [
          { name: 'index.js', type: 'file' },
          { name: 'App.js', type: 'file' },
          { name: 'styles.css', type: 'file' },
          { 
            name: 'components', 
            type: 'folder', 
            expanded: false,
            children: [
              { name: 'TodoItem.js', type: 'file' },
              { name: 'Calculator.js', type: 'file' },
              { name: 'Header.js', type: 'file' }
            ]
          }
        ]
      },
      { name: 'package.json', type: 'file' },
      { name: 'README.md', type: 'file' }
    ]
  });
  
  const [openFiles, setOpenFiles] = useState<OpenFile[]>([
    { name: 'index.js', content: 'import React from "react";\nimport ReactDOM from "react-dom";\nimport App from "./App";\nimport "./styles.css";\n\nReactDOM.render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>,\n  document.getElementById("root")\n);' },
    { name: 'App.js', content: 'import React, { useState } from "react";\nimport TodoItem from "./components/TodoItem";\nimport Calculator from "./components/Calculator";\nimport Header from "./components/Header";\n\nfunction App() {\n  const [todos, setTodos] = useState([]);\n  const [newTodo, setNewTodo] = useState("");\n\n  const addTodo = () => {\n    if (newTodo.trim() === "") return;\n    setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);\n    setNewTodo("");\n  };\n\n  return (\n    <div className="app-container">\n      <Header />\n      <div className="main-content">\n        <div className="todo-section">\n          <h2>Todo List</h2>\n          <div className="add-todo">\n            <input\n              type="text"\n              value={newTodo}\n              onChange={(e) => setNewTodo(e.target.value)}\n              placeholder="Add new todo..."\n            />\n            <button onClick={addTodo}>Add</button>\n          </div>\n          <div className="todo-list">\n            {todos.map((todo) => (\n              <TodoItem\n                key={todo.id}\n                todo={todo}\n                onToggle={() => {\n                  setTodos(\n                    todos.map((t) =>\n                      t.id === todo.id ? { ...t, completed: !t.completed } : t\n                    )\n                  );\n                }}\n                onDelete={() => {\n                  setTodos(todos.filter((t) => t.id !== todo.id));\n                }}\n              />\n            ))}\n          </div>\n        </div>\n        <Calculator />\n      </div>\n    </div>\n  );\n}\n\nexport default App;' },
  ]);
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'system', content: 'How can I help you with your Todo Calculator project?' },
    { role: 'user', content: 'Create a simple todo calculator app' },
    { role: 'system', content: "I've generated a Todo Calculator app for you. It includes:\n\n- A todo list component with add, toggle, and delete functionality\n- A calculator component to perform operations on your tasks\n- Basic styling\n\nThe main files are:\n- index.js: Entry point\n- App.js: Main component\n- components/TodoItem.js: Individual todo items\n- components/Calculator.js: Calculator functionality\n\nWhat would you like me to explain or modify?" }
  ]);

  const handleSendMessage = () => {
    if (message.trim() === '') return;
    
    setChatMessages([...chatMessages, { role: 'user', content: message }]);
    setMessage('');
    
    // Simulate AI response
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        role: 'system', 
        content: "I'll modify the Calculator component to include functionality for calculating estimated completion times for your tasks. Let me update that file for you." 
      }]);
    }, 1000);
  };

  const toggleFolder = (path: string) => {
    const updateFileTree = (node: Node, pathParts: string[]): Node => {
      if (pathParts.length === 0) {
        return node.type === 'folder' ? { ...node, expanded: !node.expanded } : node;
      }
      
      if (node.type !== 'folder') return node;
      
      const currentPart = pathParts[0];
      const remainingPath = pathParts.slice(1);
      
      return {
        ...node,
        children: node.children.map(child => 
          child.name === currentPart 
            ? updateFileTree(child, remainingPath) 
            : child
        )
      };
    };
    
    setFileTree(updateFileTree(fileTree, path.split('/')) as FolderNode);
  };

  const openFile = (fileName: string) => {
    if (!openFiles.some(file => file.name === fileName)) {
      // In real app, you'd fetch file content here
      const fileContent = "// Content for " + fileName;
      setOpenFiles([...openFiles, { name: fileName, content: fileContent }]);
    }
    setActiveTab(fileName);
  };
  
  const closeFile = (fileName: string) => {
    const newOpenFiles = openFiles.filter(file => file.name !== fileName);
    setOpenFiles(newOpenFiles);
    if (activeTab === fileName && newOpenFiles.length > 0) {
      setActiveTab(newOpenFiles[0].name);
    } else if (activeTab === fileName) {
      setActiveTab('');
    }
  };

  const renderFileTree = (node: Node, path = '') => {
    const currentPath = path ? `${path}/${node.name}` : node.name;
    
    if (node.type === 'file') {
      return (
        <div 
          key={currentPath} 
          className={`flex items-center px-1 py-0.5 cursor-pointer rounded text-xs hover:bg-zinc-800 ${activeTab === node.name ? 'bg-indigo-900/20 text-indigo-300' : ''}`}
          onClick={() => openFile(node.name)}
        >
          <File className="w-3 h-3 mr-1" /> {node.name}
        </div>
      );
    }
    
    return (
      <div key={currentPath} className="mb-0.5">
        <div 
          className="flex items-center px-1 py-0.5 cursor-pointer rounded text-xs hover:bg-zinc-800"
          onClick={() => toggleFolder(currentPath)}
        >
          {node.expanded ? <ChevronDown className="w-3 h-3 mr-0.5" /> : <ChevronRight className="w-3 h-3 mr-0.5" />}
          <Folder className="w-3 h-3 mr-1" />
          {node.name}
        </div>
        
        {node.expanded && (
          <div className="pl-3">
            {node.children.map(child => renderFileTree(child, currentPath))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Left sidebar - File Explorer */}
      <div className="w-56 border-r border-zinc-800 flex flex-col">
        <div className="p-2 border-b border-zinc-800 flex justify-between items-center">
          <h2 className="text-sm font-bold">EXPLORER</h2>
          <div className="flex">
            <button className="p-1 rounded hover:bg-zinc-800">
              <Plus className="w-3 h-3 text-zinc-400" />
            </button>
            <button className="p-1 rounded hover:bg-zinc-800 ml-1">
              <MoreVertical className="w-3 h-3 text-zinc-400" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-1 text-sm">
          {renderFileTree(fileTree)}
        </div>
        
        <div className="p-2 border-t border-zinc-800 flex justify-between">
          <button className="p-1 rounded hover:bg-zinc-800">
            <Download className="w-3 h-3 text-zinc-400" />
          </button>
          <button className="p-1 rounded hover:bg-zinc-800">
            <Save className="w-3 h-3 text-zinc-400" />
          </button>
          <button className="p-1 rounded hover:bg-zinc-800">
            <Trash2 className="w-3 h-3 text-zinc-400" />
          </button>
        </div>
      </div>
      
      {/* Middle - Editor */}
      <div className="flex-1 flex flex-col">
        {/* Tabs */}
        <div className="border-b border-zinc-800 flex items-center overflow-x-auto bg-zinc-950">
          {openFiles.map(file => (
            <div 
              key={file.name} 
              className={`py-1 px-3 border-r border-zinc-800 flex items-center whitespace-nowrap cursor-pointer text-xs ${activeTab === file.name ? 'bg-zinc-900' : 'bg-zinc-950 hover:bg-zinc-900'}`}
              onClick={() => setActiveTab(file.name)}
            >
              <File className="w-3 h-3 mr-1 text-zinc-400" />
              <span>{file.name}</span>
              <button 
                className="ml-1 text-zinc-600 hover:text-zinc-300"
                onClick={(e) => {
                  e.stopPropagation();
                  closeFile(file.name);
                }}
              >
                <X className="w-2 h-2" />
              </button>
            </div>
          ))}
        </div>
        
        {/* Editor Area */}
        <div className="flex-1 overflow-auto bg-zinc-900 relative">
          <div className="absolute inset-0 font-mono p-2 text-xs">
            {activeTab && openFiles.find(f => f.name === activeTab)?.content.split('\n').map((line, i) => (
              <div key={i} className="flex">
                <span className="text-zinc-600 inline-block w-6 text-right mr-3">{i + 1}</span>
                <span>{line}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Status Bar */}
        <div className="px-3 py-0.5 border-t border-zinc-800 flex justify-between text-xs text-zinc-500 bg-zinc-950">
          <div className="flex items-center">
            <span>React</span>
            <span className="mx-1">•</span>
            <span>JavaScript</span>
          </div>
          <div className="flex items-center">
            <Users className="w-3 h-3 mr-1" />
            <span>1 person editing</span>
          </div>
        </div>
      </div>
      
      {/* Right sidebar - Chat */}
      <div className="w-80 border-l border-zinc-800 flex flex-col">
        <div className="p-2 border-b border-zinc-800 flex justify-between items-center">
          <h2 className="text-sm font-bold flex items-center">
            <Zap className="w-3 h-3 mr-1 text-indigo-400" />
            AI Assistant
          </h2>
          <div className="flex">
            <button className="p-1 rounded hover:bg-zinc-800">
              <RefreshCw className="w-3 h-3 text-zinc-400" />
            </button>
            <button className="p-1 rounded hover:bg-zinc-800 ml-1">
              <Settings className="w-3 h-3 text-zinc-400" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-4 text-sm">
          {chatMessages.map((msg, index) => (
            <div key={index} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-xs break-words p-2 rounded-lg ${msg.role === 'user' ? 'bg-indigo-600' : 'bg-zinc-800'}`}>
                {msg.content}
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-2 border-t border-zinc-800">
          <div className="flex items-center bg-zinc-900 rounded-lg">
            <textarea
              className="flex-1 bg-transparent border-0 resize-none py-2 px-3 text-sm focus:outline-none"
              placeholder="Message AI assistant..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              rows={1}
            />
            <button 
              className="p-1 mr-1 text-indigo-400 rounded hover:bg-zinc-800"
              onClick={handleSendMessage}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}