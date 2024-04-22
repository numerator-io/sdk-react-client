import { renderHook, act } from '@testing-library/react';
import { useDefaultContext } from '@/provider/useDefaultContext';

describe('useDefaultContext hook', () => {
  it('should return default context', () => {
    const context = { key1: 'value1', key2: 'value2' };
    const { result } = renderHook(() => useDefaultContext(context, jest.fn()));

    expect(result.current.getDefaultContext()).toEqual(context);
  });

  it('should clear default context', () => {
    const setContext = jest.fn();
    const { result } = renderHook(() => useDefaultContext({}, setContext));

    act(() => {
      result.current.clearDefaultContext();
    });

    expect(setContext).toHaveBeenCalledWith({});
  });

  it('should add default context value', () => {
    const setContext = jest.fn();
    const { result } = renderHook(() => useDefaultContext({}, setContext));

    act(() => {
      result.current.addDefaultContextValue('key1', 'value1');
    });

    expect(setContext).toHaveBeenCalledWith({ key1: 'value1' });
  });

  it('should remove default context value', () => {
    const setContext = jest.fn();
    const { result } = renderHook(() => useDefaultContext({ key1: 'value1', key2: 'value2' }, setContext));

    act(() => {
      result.current.removeDefaultContextValue('key1');
    });

    expect(setContext).toHaveBeenCalledWith({ key2: 'value2' });
  });
});
