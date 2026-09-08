// Deliberately NOT `import "server-only"` — this module only orchestrates
// model *names* (not secrets) and injects an execute callback, which is
// exactly what lets it be unit-tested with a plain `node` run against a
// mocked executor (see scripts/test-model-fallback.ts) without a test
// framework and without touching the real Gemini API or its quota.
import { ApiError } from "@google/genai";

const RETRYABLE_STATUSES = new Set([408, 429, 500, 502, 503, 504]);

/**
 * Whether a failure is worth retrying against a different model.
 * Retryable: rate limiting, timeouts, and server-side/transient errors —
 * another model (or the same model a moment later) might succeed.
 * Not retryable: malformed requests, missing/invalid credentials, and other
 * configuration problems — no other model would fix those, so we fail fast
 * instead of masking a real bug behind extra latency.
 */
export function isRetryableError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return RETRYABLE_STATUSES.has(error.status);
  }
  if (error instanceof Error) {
    const signal = `${error.name} ${error.message}`.toLowerCase();
    if (signal.includes("abort") || signal.includes("timeout") || signal.includes("deadline")) {
      return true;
    }
  }
  return false;
}

function categorizeError(error: unknown): string {
  if (error instanceof ApiError) return `http_${error.status}`;
  if (error instanceof Error) return error.name || "error";
  return "unknown";
}

/** Reads GEMINI_PRIMARY_MODEL / GEMINI_FALLBACK_MODEL_1..3, in that order, skipping unset ones. */
export function getConfiguredModels(
  env: Record<string, string | undefined> = process.env,
): string[] {
  const candidates = [
    env.GEMINI_PRIMARY_MODEL,
    env.GEMINI_FALLBACK_MODEL_1,
    env.GEMINI_FALLBACK_MODEL_2,
    env.GEMINI_FALLBACK_MODEL_3,
  ];
  const models = candidates.map((m) => m?.trim()).filter((m): m is string => Boolean(m));
  return Array.from(new Set(models));
}

export interface ModelAttemptLog {
  model: string;
  success: boolean;
  category?: string;
  latencyMs: number;
}

/**
 * Runs `execute` against each model in order, returning the first success.
 * A non-retryable error (bad request, auth failure, etc.) throws
 * immediately without touching later models. A retryable error moves on to
 * the next model; once the list is exhausted, the last error is thrown.
 */
export async function withModelFallback<T>(
  models: string[],
  execute: (model: string) => Promise<T>,
  onAttempt?: (log: ModelAttemptLog) => void,
): Promise<T> {
  if (models.length === 0) {
    throw new Error("No Gemini model is configured.");
  }

  for (let index = 0; index < models.length; index++) {
    const model = models[index];
    const startedAt = Date.now();
    try {
      const result = await execute(model);
      onAttempt?.({ model, success: true, latencyMs: Date.now() - startedAt });
      return result;
    } catch (error) {
      const latencyMs = Date.now() - startedAt;
      const category = categorizeError(error);
      onAttempt?.({ model, success: false, category, latencyMs });

      const retryable = isRetryableError(error);
      const isLastModel = index === models.length - 1;
      if (!retryable || isLastModel) {
        throw error;
      }
    }
  }

  // Unreachable — the loop above always returns or throws — but keeps
  // TypeScript satisfied that every path produces or rejects a T.
  throw new Error("No Gemini model is configured.");
}
