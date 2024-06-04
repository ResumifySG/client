// src/components/ExampleBox.tsx
import React from 'react';

interface Example {
  title: string;
  url: string;
}

interface ExampleBoxProps {
  example: Example;
  isSelected: boolean;
  onClick: () => void;
}

export default function ExampleBox({ example, isSelected, onClick }: ExampleBoxProps): React.JSX.Element {
  return (
    <div
      className={`border rounded p-4 text-center cursor-pointer ${
        isSelected ? 'border-purple-500' : 'border-gray-300'
      }`}
      onClick={onClick}
    >
      <h3 className="text-lg font-semibold">{example.title}</h3>
    </div>
  );
}