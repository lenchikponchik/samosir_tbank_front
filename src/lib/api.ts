/**
 * HTTP client for FastAPI backend (Samosir_tbank)
 *
 * Connection modes:
 *   1. Direct:  NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1  (needs CORS)
 *   2. Proxied: NEXT_PUBLIC_API_URL=/api/v1                      (Next.js rewrites → no CORS)
 *   3. Docker:  NEXT_PUBLIC_API_URL=/api/v1                      (nginx proxies)
 *
 * Backend repo: https://github.com/lenchikponchik/Samosir_tbank
 */

import type {
  EstimateRequest,
  EstimateResponse,
  EstimateHistoryItem,
  RecommendationResponse,
  ResumeCreate,
  ResumeResponse,
  ResumeUpdate,
} from '@/types';

// ─── Configuration ────────────────────────────────────────────

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

/** Default timeout for API requests (ms) */
const REQUEST_TIMEOUT = 15_000;

// ─── Generic request helper ──────────────────────────────────

export class ApiError extends Error {
  status: number;
  detail: string;

  constructor(status: number, detail: string) {
    super(detail);
    this.name = 'ApiError';
    this.status = status;
    this.detail = detail;
  }
}

async function request<T>(
  endpoint: string,
  options?: RequestInit & { timeout?: number }
): Promise<T> {
  const { timeout = REQUEST_TIMEOUT, ...fetchOptions } = options || {};

  // AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions?.headers,
      },
      signal: controller.signal,
      ...fetchOptions,
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: res.statusText }));
      throw new ApiError(
        res.status,
        error.detail || `API error ${res.status}`
      );
    }

    return res.json();
  } catch (err) {
    if (err instanceof ApiError) throw err;

    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiError(408, `Запрос превысил таймаут (${timeout / 1000}с)`);
    }

    // Network error — backend is probably unavailable
    throw new ApiError(
      0,
      'Не удалось подключиться к серверу. Убедитесь, что бэкенд запущен на ' +
        API_BASE
    );
  } finally {
    clearTimeout(timeoutId);
  }
}

// ─── Health check ─────────────────────────────────────────────

/**
 * Quick health check — is the backend reachable?
 * Uses a shorter timeout since this is meant for UI status indicators.
 */
export async function checkHealth(): Promise<boolean> {
  try {
    const baseUrl = API_BASE.replace(/\/api\/v1$/, '');
    const res = await fetch(`${baseUrl}/health`, {
      signal: AbortSignal.timeout(3000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ─── Resumes ───────────────────────────────────────────────

export async function createResume(
  data: ResumeCreate
): Promise<ResumeResponse> {
  return request('/resumes', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getResume(id: string): Promise<ResumeResponse> {
  return request(`/resumes/${id}`);
}

export async function updateResume(
  id: string,
  data: ResumeUpdate
): Promise<ResumeResponse> {
  return request(`/resumes/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

// ─── Estimates ─────────────────────────────────────────────

export async function createEstimate(
  data: EstimateRequest
): Promise<EstimateResponse> {
  return request('/estimates', {
    method: 'POST',
    body: JSON.stringify(data),
    // Estimation can take a while (ML + LLM)
    timeout: 30_000,
  });
}

export async function reEstimate(
  resumeId: string
): Promise<EstimateResponse> {
  return request(`/estimates/resume/${resumeId}`, {
    method: 'POST',
    timeout: 30_000,
  });
}

export async function getEstimate(id: string): Promise<EstimateResponse> {
  return request(`/estimates/${id}`);
}

// ─── Recommendations ──────────────────────────────────────

export async function getRecommendations(
  estimateId: string
): Promise<RecommendationResponse[]> {
  return request(`/recommendations/estimate/${estimateId}`);
}

// ─── History ──────────────────────────────────────────────

export async function getHistory(
  resumeId: string
): Promise<EstimateHistoryItem[]> {
  return request(`/history/resume/${resumeId}`);
}
