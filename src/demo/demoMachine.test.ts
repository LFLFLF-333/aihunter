import { describe, expect, it } from 'vitest';
import { initialDemoState, transitionDemo } from './demoMachine';

describe('transitionDemo', () => {
  it('只有审批后才进入模拟发布完成状态', () => {
    let state = transitionDemo(initialDemoState, { type: 'START' });
    state = transitionDemo(state, { type: 'COMPLETE_PROCESSING' });
    expect(state.stage).toBe('awaiting-approval');
    state = transitionDemo(state, { type: 'APPROVE' });
    expect(state.stage).toBe('simulated-published');
  });

  it('不能从初始状态直接发布', () => {
    expect(transitionDemo(initialDemoState, { type: 'APPROVE' })).toEqual(initialDemoState);
  });
});
