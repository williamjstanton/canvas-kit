import React from 'react';
import {renderHook, act} from '@testing-library/react-hooks';

import {createEventMap, createModelHook, useEventMap} from '../lib/utils/models';
import {expectTypeOf} from 'expect-type';

describe('createEventMap', () => {
  it('should return the original config object', () => {
    expect(
      createEventMap()({
        guards: {},
        callbacks: {},
      })
    ).toEqual({
      guards: {},
      callbacks: {},
    });
  });
});

describe('useEventMap', () => {
  type Events = {
    foo(data: {value: string}): void;
  };
  const eventMap = createEventMap<Events>()({
    guards: {
      shouldFoo: 'foo',
    },
    callbacks: {
      onFoo: 'foo',
    },
  });

  const useModel = (config = {}) => {
    const [foo, setFoo] = React.useState('previous');
    const state = {
      foo,
    };

    const events = useEventMap(eventMap, state, config, {
      foo(data: {value: string}) {
        setFoo(data.value);
      },
    });

    return {state, events};
  };

  it('should call a guard if defined', () => {
    const guard = jest.fn();
    const {result} = renderHook(() =>
      useModel({
        shouldFoo: guard,
      })
    );

    result.current.events.foo({value: 'next'});
    expect(guard).toBeCalledTimes(1);
  });

  it('should call a guard with data and state', () => {
    const guard = jest.fn();

    const {result} = renderHook(() =>
      useModel({
        shouldFoo: guard,
      })
    );

    result.current.events.foo({value: 'next'});
    expect(guard).toBeCalledWith({data: {value: 'next'}, state: {foo: 'previous'}});
  });

  it('should call a callback if defined', () => {
    const callback = jest.fn();

    const {result} = renderHook(() =>
      useModel({
        onFoo: callback,
      })
    );

    act(() => {
      result.current.events.foo({value: 'next'});
      expect(callback).toBeCalledTimes(1);
    });
  });

  it('should call a callback with data and the previous state', () => {
    const callback = jest.fn();
    const {result} = renderHook(() =>
      useModel({
        onFoo: callback,
      })
    );

    // wrap in an `act` since the callback gets called _during_ state setting phase. Otherwise,
    // `prevState` will have next state
    act(() => {
      result.current.events.foo({value: 'next'});
      expect(callback).toBeCalledWith({data: {value: 'next'}, prevState: {foo: 'previous'}});
    });
  });

  it('should call a callback if a guard returns true', () => {
    const callback = jest.fn();
    const {result} = renderHook(() =>
      useModel({
        shouldFoo: () => true,
        onFoo: callback,
      })
    );

    act(() => {
      result.current.events.foo({value: 'next'});
      expect(callback).toBeCalledTimes(1);
    });
  });

  it('should not call a callback if a guard returns false', () => {
    const callback = jest.fn();
    const {result} = renderHook(() =>
      useModel({
        shouldFoo: () => false,
        onFoo: callback,
      })
    );

    act(() => {
      result.current.events.foo({value: 'next'});
      expect(callback).not.toBeCalled();
    });
  });

  describe('with a composed model', () => {
    type ComposedEvents = Events & {
      bar(data: {value: string}): void;
    };
    const eventMap = createEventMap<ComposedEvents>()({
      guards: {
        shouldFoo: 'foo',
      },
      callbacks: {
        onFoo: 'foo',
      },
    });
    const useComposedModel = (config = {}) => {
      const model = useModel(config);
      const [bar, setBar] = React.useState('previous');

      const state = {...model.state, bar};
      const events = useEventMap(eventMap, state, config, {
        ...model.events,
        bar({value}) {
          setBar(state.bar + value);
        },
      });

      return {state, events};
    };

    it('should only call a guard once', () => {
      const guard = jest.fn();
      guard.mockReturnValue(true);

      const {result} = renderHook(() =>
        useComposedModel({
          shouldFoo: guard,
        })
      );

      result.current.events.foo({value: 'bar'});

      expect(guard).toBeCalledTimes(1);
    });

    it('should only call a callback once', () => {
      const callback = jest.fn();

      const {result} = renderHook(() =>
        useComposedModel({
          onFoo: callback,
        })
      );

      result.current.events.foo({value: 'bar'});

      expect(callback).toBeCalledTimes(1);
    });

    it('should use the latest closed over state for events', () => {
      const {result} = renderHook(() => useComposedModel());

      result.current.events.bar({value: '1'});
      result.current.events.bar({value: '2'});

      expect(result.current).toHaveProperty('state.bar', 'previous12');
    });
  });
});

describe('createModelHook', () => {
  const useTestModel = createModelHook({
    defaultConfig: {
      foo: '',
    },
    requiredConfig: {
      bar: '',
    },
  })(config => {
    return {
      state: {
        baz: '',
      },
      events: {
        select(value: string) {
          //
        },
      },
    };
  });

  it('should set the correct TConfig type', () => {
    expectTypeOf(useTestModel.TConfig).toMatchTypeOf<{
      foo?: string;
      bar: string;
      onSelect?: (value: string, prevState: {baz: string}) => void;
      shouldSelect?: (value: string, state: {baz: string}) => boolean;
    }>();
  });

  it('should set the correct type for `defaultConfig`', () => {
    expectTypeOf(useTestModel.defaultConfig).toMatchTypeOf<{foo: string}>();
  });

  it('should set the correct type for `requiredConfig`', () => {
    expectTypeOf(useTestModel.requiredConfig).toMatchTypeOf<{bar: string}>();
  });

  it('should set the correct type for `getElemProps`', () => {
    const elemProps = useTestModel.getElemProps({
      foo: '',
      bar: '',
      onSelect() {
        /* */
      },
      shouldSelect() {
        return true;
      },
      'data-extra': 'foo',
    });

    expect(elemProps).toHaveProperty('data-extra', 'foo');
    expectTypeOf(elemProps).toMatchTypeOf<{'data-extra': string}>();
  });

  it('should produce the correct merged config type', () => {
    const config = useTestModel.mergeConfig(
      {...useTestModel.defaultConfig, ...useTestModel.requiredConfig},
      {
        onSelect() {
          /**/
        },
      }
    );

    expectTypeOf(config).toMatchTypeOf<{
      foo?: string;
      bar: string;
      onSelect?: (value: string, prevState: {baz: string}) => void;
      shouldSelect?: (value: string, state: {baz: string}) => boolean;
    }>();
  });

  it('should override defaultConfig values with `undefined` if `undefined` is allowed', () => {
    const useTestModel = createModelHook({
      defaultConfig: {
        foo: undefined,
      },
    })(config => {
      return {state: {foo: config.foo}, events: {}};
    });

    const {result} = renderHook(() =>
      useTestModel({
        foo: undefined,
      })
    );

    expect(result.current.state).toHaveProperty('foo', undefined);
  });

  it('should not override defaultConfig values with `undefined` if `undefined` is not allowed', () => {
    const useTestModel = createModelHook({
      defaultConfig: {
        foo: 'bar',
      },
    })(config => {
      return {state: {foo: config.foo}, events: {}};
    });

    const {result} = renderHook(() =>
      useTestModel({
        foo: undefined,
      })
    );

    expect(result.current.state).toHaveProperty('foo', 'bar');
  });
});
