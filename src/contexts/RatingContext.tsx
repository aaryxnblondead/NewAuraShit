import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PublicFigure, SupportedPlatform } from '../rating-system/types';
import { RatingApiClient } from '../api/rating-api';

interface RatingContextType {
  topFigures: PublicFigure[];
  loading: boolean;
  error: string | null;
  searchFigures: (query: string, filters?: any) => Promise<PublicFigure[]>;
  getFigure: (id: string) => Promise<PublicFigure>;
  createFigure: (name: string, profession: string[], platforms: any[]) => Promise<PublicFigure>;
  updateFigure: (figure: Partial<PublicFigure> & { id: string }) => Promise<PublicFigure>;
  refreshTopFigures: (category?: string, limit?: number, sortBy?: string) => Promise<void>;
}

const RatingContext = createContext<RatingContextType | undefined>(undefined);

export const RatingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [topFigures, setTopFigures] = useState<PublicFigure[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Load top figures on initial render
  useEffect(() => {
    refreshTopFigures();
  }, []);
  
  const refreshTopFigures = async (
    category?: string,
    limit: number = 10,
    sortBy: string = 'overall'
  ) => {
    try {
      setLoading(true);
      setError(null);
      const figures = await RatingApiClient.getTopRatedFigures(category, limit, sortBy);
      setTopFigures(figures);
    } catch (err) {
      setError('Failed to load top figures');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const searchFigures = async (query: string, filters?: any) => {
    try {
      setLoading(true);
      setError(null);
      return await RatingApiClient.searchFigures(query, filters);
    } catch (err) {
      setError('Search failed');
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  const getFigure = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      return await RatingApiClient.getFigure(id);
    } catch (err) {
      setError('Failed to load figure details');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const createFigure = async (
    name: string,
    profession: string[],
    platforms: {
      platform: SupportedPlatform;
      handle: string;
      url: string;
    }[]
  ) => {
    try {
      setLoading(true);
      setError(null);
      return await RatingApiClient.createFigure(name, profession, platforms);
    } catch (err) {
      setError('Failed to create figure');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const updateFigure = async (figure: Partial<PublicFigure> & { id: string }) => {
    try {
      setLoading(true);
      setError(null);
      return await RatingApiClient.updateFigure(figure);
    } catch (err) {
      setError('Failed to update figure');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <RatingContext.Provider
      value={{
        topFigures,
        loading,
        error,
        searchFigures,
        getFigure,
        createFigure,
        updateFigure,
        refreshTopFigures
      }}
    >
      {children}
    </RatingContext.Provider>
  );
};

export const useRating = () => {
  const context = useContext(RatingContext);
  if (context === undefined) {
    throw new Error('useRating must be used within a RatingProvider');
  }
  return context;
};
