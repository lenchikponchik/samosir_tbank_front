/**
 * HTTP client for FastAPI backend
 * Base URL configurable via NEXT_PUBLIC_API_URL env var
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

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail || `API error ${res.status}`);
  }

  return res.json();
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
  });
}

export async function reEstimate(
  resumeId: string
): Promise<EstimateResponse> {
  return request(`/estimates/resume/${resumeId}`, {
    method: 'POST',
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
