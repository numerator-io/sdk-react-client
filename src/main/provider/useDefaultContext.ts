export function useDefaultContext(context: Record<string, any>, setContext: React.Dispatch<React.SetStateAction<Record<string, any>>>) {

    const getDefaultContext = (): Record<string, any> => {
        return context
      }
    
      const clearDefaultContext = () => {
        setContext({})
      }
    
      const addDefaultContextValue = (key:string, value: any) => {
        const updatedContext = {...context}
        updatedContext[key] = value
        setContext(updatedContext)
      }
    
      const removeDefaultContextValue = (key:string) => {
        const updatedContext = {...context}
        delete updatedContext[key]
      setContext(updatedContext)
      }

      return {
        getDefaultContext,
        clearDefaultContext,
        addDefaultContextValue,
        removeDefaultContextValue
      }
}