/**
 * Practical, framework-free test for the Gemini model-fallback chain.
 * Exercises the real lib/ai/model-fallback.ts logic against a mocked
 * `execute` function — no real Gemini calls, no quota consumed.
 *
 * Run with: node scripts/test-model-fallback.ts
 */
import assert from "node:assert/strict";
import { ApiError } from "@google/genai";
import {
  withModelFallback,
  isRetryableError,
  getConfiguredModels,
  type ModelAttemptLog,
} from "../lib/ai/model-fallback.ts";

let passed = 0;
let failed = 0;

async function test(name: string, fn: () => Promise<void> | void) {
  try {
    await fn();
    console.log(`  ok  - ${name}`);
    passed++;
  } catch (error) {
    console.log(`  FAIL - ${name}`);
    console.log(`         ${error instanceof Error ? error.message : error}`);
    failed++;
  }
}

function rateLimited() {
  return new ApiError({ message: "Rate limited", status: 429 });
}
function serverError() {
  return new ApiError({ message: "Internal error", status: 500 });
}
function unauthorized() {
  return new ApiError({ message: "Invalid API key", status: 401 });
}
function badRequest() {
  return new ApiError({ message: "Malformed request", status: 400 });
}

async function main() {
  console.log("isRetryableError classification");
  await test("429 is retryable", () => {
    assert.equal(isRetryableError(rateLimited()), true);
  });
  await test("500/502/503/504 are retryable", () => {
    for (const status of [500, 502, 503, 504]) {
      assert.equal(isRetryableError(new ApiError({ message: "x", status })), true);
    }
  });
  await test("401 (auth) is NOT retryable", () => {
    assert.equal(isRetryableError(unauthorized()), false);
  });
  await test("400 (malformed request) is NOT retryable", () => {
    assert.equal(isRetryableError(badRequest()), false);
  });
  await test("timeout/abort errors are retryable", () => {
    const abort = new Error("The operation was aborted due to timeout");
    abort.name = "AbortError";
    assert.equal(isRetryableError(abort), true);
  });
  await test("unrelated generic errors are NOT retryable", () => {
    assert.equal(isRetryableError(new Error("something else broke")), false);
  });

  console.log("\ngetConfiguredModels");
  await test("builds an ordered list from set env vars, skipping unset ones", () => {
    const models = getConfiguredModels({
      GEMINI_PRIMARY_MODEL: "model-a",
      GEMINI_FALLBACK_MODEL_1: undefined,
      GEMINI_FALLBACK_MODEL_2: "model-b",
      GEMINI_FALLBACK_MODEL_3: "  ",
    });
    assert.deepEqual(models, ["model-a", "model-b"]);
  });
  await test("returns an empty list when nothing is configured", () => {
    assert.deepEqual(getConfiguredModels({}), []);
  });
  await test("de-duplicates repeated model ids", () => {
    const models = getConfiguredModels({
      GEMINI_PRIMARY_MODEL: "same",
      GEMINI_FALLBACK_MODEL_1: "same",
    });
    assert.deepEqual(models, ["same"]);
  });

  console.log("\nwithModelFallback");
  await test("primary success returns immediately, no fallback calls", async () => {
    const calls: string[] = [];
    const result = await withModelFallback(["primary", "fallback-1"], async (model) => {
      calls.push(model);
      return `reply from ${model}`;
    });
    assert.equal(result, "reply from primary");
    assert.deepEqual(calls, ["primary"]);
  });

  await test("retryable primary failure proceeds to fallback and succeeds", async () => {
    const calls: string[] = [];
    const logs: ModelAttemptLog[] = [];
    const result = await withModelFallback(
      ["primary", "fallback-1"],
      async (model) => {
        calls.push(model);
        if (model === "primary") throw rateLimited();
        return `reply from ${model}`;
      },
      (log) => logs.push(log),
    );
    assert.equal(result, "reply from fallback-1");
    assert.deepEqual(calls, ["primary", "fallback-1"]);
    assert.equal(logs.length, 2);
    assert.equal(logs[0].success, false);
    assert.equal(logs[0].category, "http_429");
    assert.equal(logs[1].success, true);
  });

  await test("non-retryable failure stops immediately without trying fallback", async () => {
    const calls: string[] = [];
    await assert.rejects(
      withModelFallback(["primary", "fallback-1"], async (model) => {
        calls.push(model);
        throw unauthorized();
      }),
      (error: unknown) => error instanceof ApiError && error.status === 401,
    );
    assert.deepEqual(calls, ["primary"]);
  });

  await test("all models failing with retryable errors throws the last error cleanly", async () => {
    const calls: string[] = [];
    await assert.rejects(
      withModelFallback(["primary", "fallback-1", "fallback-2"], async (model) => {
        calls.push(model);
        throw serverError();
      }),
      (error: unknown) => error instanceof ApiError && error.status === 500,
    );
    assert.deepEqual(calls, ["primary", "fallback-1", "fallback-2"]);
  });

  await test("empty model list fails cleanly without calling execute", async () => {
    let called = false;
    await assert.rejects(
      withModelFallback([], async () => {
        called = true;
        return "unreachable";
      }),
      /No Gemini model is configured/,
    );
    assert.equal(called, false);
  });

  await test("third model succeeds after two retryable failures", async () => {
    const calls: string[] = [];
    const result = await withModelFallback(
      ["primary", "fallback-1", "fallback-2"],
      async (model) => {
        calls.push(model);
        if (model !== "fallback-2") throw serverError();
        return "reply from fallback-2";
      },
    );
    assert.equal(result, "reply from fallback-2");
    assert.deepEqual(calls, ["primary", "fallback-1", "fallback-2"]);
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main();
