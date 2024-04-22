import { createContext } from 'react';
import { NumeratorContextType } from '@/provider/type.provider';

// Create a context for the SDK
export const NumeratorContext = createContext<NumeratorContextType | undefined>(undefined);
