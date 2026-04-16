import test from 'node:test';
import assert from 'node:assert';
import { Intelligence } from '../public/js/intelligence.js';
import { calculateWaitTime } from '../public/js/state.js';

test('Crowd Engine: Wait Time Calculation', (t) => {
  // Test lower bound
  assert.strictEqual(calculateWaitTime(0), 2);
  // Test exponential growth at high crowd
  const highWait = calculateWaitTime(80);
  assert.ok(highWait > 15, 'High crowd should result in high wait time');
});

test('Intelligence: Risk Assessment', (t) => {
  assert.strictEqual(Intelligence.getRiskLevel(90), 'CRITICAL');
  assert.strictEqual(Intelligence.getRiskLevel(75), 'HIGH');
  assert.strictEqual(Intelligence.getRiskLevel(55), 'MODERATE');
  assert.strictEqual(Intelligence.getRiskLevel(10), 'LOW');
});

test('Intelligence: Predictive Logic', (t) => {
  const id = 'test_gate';
  
  // Seed history
  Intelligence.predict(id, 50); // t=0
  
  // To simulate time, we'd need to mock Date.now, but we can verify stability
  const result = Intelligence.predict(id, 50);
  assert.strictEqual(result, 50, 'Steady state should predict current value');
});

test('Intelligence: Smoothing (LERP)', (t) => {
  const current = 10;
  const target = 20;
  const factor = 0.5;
  const smoothed = Intelligence.smooth(current, target, factor);
  assert.strictEqual(smoothed, 15, 'LERP smoothing at 0.5 should be mid-point');
});

test('Intelligence: Routing Recommendation', (t) => {
  const rec = Intelligence.getRecommendation('gate1', 90);
  assert.ok(rec !== null, 'High crowd should trigger recommendation');
  assert.strictEqual(rec.action, 'REROUTE');
  
  const noRec = Intelligence.getRecommendation('gate1', 20);
  assert.strictEqual(noRec, null, 'Low crowd should not trigger recommendation');
});

test('Intelligence: Edge Cases', (t) => {
  // Test NaN smoothing guard
  assert.strictEqual(Intelligence.smooth(NaN, 50), 50, 'NaN current should return target');
  
  // Test nearly instant updates (dt near zero)
  const id = 'fast_gate';
  Intelligence.predict(id, 10);
  const quickResult = Intelligence.predict(id, 20); // Immediate follow-up
  assert.ok(!isNaN(quickResult), 'Predict should handle rapid-fire updates');
});
