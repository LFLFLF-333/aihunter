export type DemoStage = 'idle' | 'processing' | 'awaiting-approval' | 'simulated-published';
export type DemoState = { stage: DemoStage; step: number };
export type DemoEvent =
  | { type: 'START' }
  | { type: 'NEXT_STEP' }
  | { type: 'COMPLETE_PROCESSING' }
  | { type: 'APPROVE' }
  | { type: 'RESET' };

export const initialDemoState: DemoState = { stage: 'idle', step: 0 };

export function transitionDemo(state: DemoState, event: DemoEvent): DemoState {
  if (event.type === 'RESET') return { ...initialDemoState };
  if (event.type === 'START' && state.stage === 'idle') return { stage: 'processing', step: 1 };
  if (event.type === 'NEXT_STEP' && state.stage === 'processing') return { ...state, step: Math.min(6, state.step + 1) };
  if (event.type === 'COMPLETE_PROCESSING' && state.stage === 'processing') return { stage: 'awaiting-approval', step: 6 };
  if (event.type === 'APPROVE' && state.stage === 'awaiting-approval') return { stage: 'simulated-published', step: 6 };
  return state;
}
