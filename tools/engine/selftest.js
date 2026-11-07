#!/usr/bin/env node
// Self-test for parseRunOutput() — verifies the error-detection logic.
// Run: node tools/engine/selftest.js

const { parseRunOutput } = require('./engine');

let pass = 0, fail = 0;
function assert(name, cond) {
  if (cond) { pass++; console.log(`  ✓ ${name}`); }
  else { fail++; console.error(`  ✗ ${name}`); }
}

const jsonLine = (obj) => JSON.stringify(obj);

// ---- Test 1: clean success ----
{
  const r = parseRunOutput({
    status: 0,
    stdout: jsonLine({ result: 'done', num_turns: 5, is_error: false }),
  });
  assert('clean success → no error', r.error === null);
  assert('clean success → result preserved', r.result === 'done');
  assert('clean success → turns parsed', r.turns === 5);
}

// ---- Test 2: stderr warning on a clean success → ignored ----
{
  const r = parseRunOutput({
    status: 0,
    stdout: jsonLine({ result: 'done', num_turns: 3, is_error: false }),
    stderr: '[claude-code:unrecognized_model] qwen3.6:27b is not a recognized model',
  });
  assert('stderr warning on success → no error', r.error === null);
  assert('stderr warning on success → result preserved', r.result === 'done');
}

// ---- Test 3: is_error=true but result present → still not an error (partial success) ----
{
  const r = parseRunOutput({
    status: 0,
    stdout: jsonLine({ result: 'partial output', num_turns: 2, is_error: true }),
    stderr: 'some warning about model mismatch',
  });
  assert('is_error + has result → no error (partial success)', r.error === null);
  assert('is_error + has result → result preserved', r.result === 'partial output');
}

// ---- Test 4: real error — is_error + no result → error reported ----
{
  const r = parseRunOutput({
    status: 0,
    stdout: jsonLine({ num_turns: 0, is_error: true, subtype: 'error_timeout' }),
    stderr: 'Timed out after 30m',
  });
  assert('is_error + no result → error reported', r.error !== null);
  assert('is_error + no result → stderr captured', r.error.includes('Timed out'));
}

// ---- Test 5: real error — non-zero status + no result → error reported ----
{
  const r = parseRunOutput({
    status: 1,
    stdout: jsonLine({ num_turns: 0, is_error: false }),
    stderr: 'Process crashed',
  });
  assert('non-zero status + no result → error reported', r.error !== null);
  assert('non-zero status + no result → stderr captured', r.error.includes('crashed'));
}

// ---- Test 6: real error — both is_error and non-zero + no result → error reported ----
{
  const r = parseRunOutput({
    status: 2,
    stdout: jsonLine({ num_turns: 0, is_error: true }),
    stderr: 'Fatal: config missing',
  });
  assert('is_error + non-zero + no result → error reported', r.error !== null);
  assert('is_error + non-zero + no result → stderr captured', r.error.includes('config missing'));
}

// ---- Test 7: fallback to subtype when stderr is empty ----
{
  const r = parseRunOutput({
    status: 1,
    stdout: jsonLine({ num_turns: 0, is_error: true, subtype: 'error_max_turns' }),
    stderr: '',
  });
  assert('empty stderr + is_error + no result → subtype used', r.error === 'error_max_turns');
  assert('empty stderr + is_error + no result → hitTurnCap true', r.hitTurnCap === true);
}

// ---- Test 8: empty stdout → graceful fallback ----
{
  const r = parseRunOutput({
    status: 0,
    stdout: '',
  });
  assert('empty stdout → no error', r.error === null);
  assert('empty stdout → result is empty string', r.result === '');
}

// ---- Test 9: malformed JSON stdout → graceful fallback ----
{
  const r = parseRunOutput({
    status: 0,
    stdout: 'not json at all',
  });
  assert('malformed JSON → no error', r.error === null);
  assert('malformed JSON → result is empty string', r.result === '');
}

// ---- Test 10: usage parsing ----
{
  const r = parseRunOutput({
    status: 0,
    stdout: jsonLine({
      result: 'ok', num_turns: 3, is_error: false,
      usage: { input_tokens: 1000, output_tokens: 500, cache_read_input_tokens: 200 },
    }),
  });
  assert('usage parsed correctly', r.usage.in === 1000 && r.usage.out === 500 && r.usage.cached === 200);
}

// ---- Test 11: THE KEY BUG — unrecognized_model + is_error + non-zero + no result → SUPPRESSED ----
// This is the exact scenario that caused the false failure reported in the sprint.
// Claude Code exits with is_error=true and status!=0 because the model name isn't
// recognized by its wrapper, but the local model still completed the work.
{
  const stderr = '[claude-code:unrecognized_model] {"model":"qwen3.6:27b","query_source":"sdk"}';
  const r = parseRunOutput({
    status: 1,
    stdout: jsonLine({ num_turns: 3, is_error: true }),
    stderr,
  });
  assert('unrecognized_model + failure + no result → error suppressed', r.error === null);
  assert('unrecognized_model → ignoredWarning populated', r.ignoredWarning !== null);
  assert('unrecognized_model → ignoredWarning contains the message', r.ignoredWarning.includes('[claude-code:unrecognized_model]'));
  assert('unrecognized_model → turns still parsed', r.turns === 3);
}

// ---- Test 12: unrecognized_model with result present → also no error (redundant but explicit) ----
{
  const r = parseRunOutput({
    status: 1,
    stdout: jsonLine({ result: 'completed successfully', num_turns: 4, is_error: true }),
    stderr: '[claude-code:unrecognized_model] {"model":"qwen3.6:27b","query_source":"sdk"}',
  });
  assert('unrecognized_model + has result → no error', r.error === null);
  assert('unrecognized_model + has result → result preserved', r.result === 'completed successfully');
  assert('unrecognized_model + has result → ignoredWarning set', r.ignoredWarning !== null);
}

// ---- Test 13: stderr contains unrecognized_model mid-stream (surrounded by other text) ----
{
  const r = parseRunOutput({
    status: 1,
    stdout: jsonLine({ num_turns: 2, is_error: true }),
    stderr: 'some other log\n[claude-code:unrecognized_model] {"model":"qwen3.6:27b","query_source":"sdk"}\nexit',
  });
  assert('unrecognized_model buried in stderr → still suppressed', r.error === null);
  assert('unrecognized_model buried → ignoredWarning set', r.ignoredWarning !== null);
}

// ---- Test 14: no unrecognized_model warning + real failure → still reported as error ----
{
  const r = parseRunOutput({
    status: 1,
    stdout: jsonLine({ num_turns: 0, is_error: true }),
    stderr: 'Connection refused to API endpoint',
  });
  assert('genuine failure without model warning → error reported', r.error !== null);
  assert('genuine failure → ignoredWarning is null', r.ignoredWarning === null);
}

// ---- Summary ----
console.log(`\n${pass} passed, ${fail} failed.`);
process.exit(fail > 0 ? 1 : 0);
