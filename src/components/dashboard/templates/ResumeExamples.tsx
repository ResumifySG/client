'use client';

import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import ExampleGrid from './ExampleGrid';
import ExamplePreview from './ExamplePreview';

interface Example {
  id: string;
  title: string;
  url: string;
}

export default function ResumeExamples(): React.JSX.Element {
  const [examples, setExamples] = useState<Example[]>([]);
  const [selectedExample, setSelectedExample] = useState<Example | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExamples = async () => {
      try {
        const response = await fetch('https://resumify-backend.onrender.com/api/examples');
        const data = await response.json();
        const formattedData = data.map((example: any) => ({
          id: example._id,
          title: example.wantedJobTitle,
          url: `/path/to/${example.wantedJobTitle.toLowerCase().replace(/\s/g, '-')}-resume-preview.jpg`,
        }));
        setExamples(formattedData);
      } catch (error) {
        console.error('Error fetching examples:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExamples();
  }, []);

  const handleExampleClick = (example: Example) => {
    setSelectedExample(example);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', margin: 0, width: '100%' }}>
      <div style={{ flex: 3 }}>
        <ExampleGrid
          examples={examples.map(({ id, title, url }) => ({ id, title, url }))}
          selectedExampleId={selectedExample ? selectedExample.id : ''}
          onExampleClick={handleExampleClick}
          loading={loading}
        />
      </div>
      <div style={{ flex: 2, backgroundColor: '#fff', padding: '16px', position: 'sticky', top: '0', alignSelf: 'flex-start', minHeight: '100vh' }}>
        <ExamplePreview selectedExample={selectedExample} loading={loading} />
      </div>
    </div>
  );
}
