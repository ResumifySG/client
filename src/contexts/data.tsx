'use client';

import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react';

interface FormData {
  [key: string]: any;
}

interface DataContextType {
  data: FormData;
  controlData: FormData;
  fetchData: (formData: FormData) => Promise<void>;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [data, setData] = useState<FormData | null>(null);

  const [currentRid, setCurrentRid] = useState(null);
  const [initData, setInitData] = useState(null);

  const fetchInitData = useCallback(async (rid) => {
    try {
      const response = await fetch(`https://resumify-backend.onrender.com/api/resumes`, {
        method: 'GET', // Change to GET if we are only fetching data
        headers: {
          Accept: 'application/json', // Ensure we're accepting JSON
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json(); // Assuming the data is an array of dictionaries
      console.log('Fetched data:', data);

      const matchedResume = data.find((resume) => resume._id === rid); // Find the resume with matching _id
      if (matchedResume) {
        setInitData(matchedResume); // Set the matched resume data to state
        setCurrentRid(rid);
        console.log('matched:', currentRid, rid);
      } else {
        console.error('No resume matched the provided rid:', rid);
      }
    } catch (error) {
      console.error('Failed to fetch data: ', error);
    }
  }, []);

  const fetchData = useCallback(
    async (formData: FormData) => {
      try {
        const response = await fetch(`https://resumify-backend.onrender.com/api/resume/${currentRid}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        const jsonData: FormData = await response.json();
        console.log('Fetched:', jsonData);
        setData(jsonData);
      } catch (error) {
        console.error('Failed to fetch data: ', error);
      }
    },
    [currentRid]
  );

  return (
    <DataContext.Provider value={{ data, currentRid, fetchData, initData, fetchInitData }}>
      {children}
    </DataContext.Provider>
  );
};
