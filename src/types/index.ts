/* ============================================================
   TypeScript types — exact mirror of backend Pydantic schemas
   (source: github.com/lenchikponchik/Samosir_tbank)
   ============================================================ */

// ─── Resume ────────────────────────────────────────────────

export interface ExperienceEntry {
  company: string;
  title: string;
  duration_months: number;
  description: string;
}

export interface ResumeCreate {
  job_title: string;
  experience_years: number;
  skills: string[];
  location: string;
  education_level: 'none' | 'bachelor' | 'master' | 'phd';
  experience_entries: ExperienceEntry[];
}

export interface ResumeUpdate {
  job_title?: string;
  experience_years?: number;
  skills?: string[];
  location?: string;
  education_level?: 'none' | 'bachelor' | 'master' | 'phd';
  experience_entries?: ExperienceEntry[];
}

export interface ResumeResponse {
  id: string;
  user_id: string;
  job_title: string;
  experience_years: number;
  skills: string[];
  location: string;
  education_level: string;
  experience_entries: ExperienceEntry[];
  updated_at: string;
  created_at: string;
}

// ─── Estimate ──────────────────────────────────────────────

export interface SalaryRange {
  p25: number;
  p50: number;
  p75: number;
}

export interface MarketInsights {
  vacancies_analyzed: number;
  skill_match_percentage: number;
  top_missing_skills: string[];
  demand_trend: string;
}

export interface ShapContribution {
  feature: string;
  contribution_rub: number;
}

export interface EstimateRequest {
  job_title: string;
  experience_years: number;
  skills: string[];
  location: string;
  education_level: string;
  experience_entries: Record<string, unknown>[];
}

export interface EstimateResponse {
  id: string;
  resume_id: string;
  salary_range: SalaryRange;
  market_insights: MarketInsights;
  shap_contributions: ShapContribution[];
  recommendations: RecommendationResponse[];
  calculated_at: string;
}

// ─── Recommendation ────────────────────────────────────────

export type RecommendationCategory =
  | 'hard_skill'
  | 'soft_skill'
  | 'formatting'
  | 'certification';

export interface RecommendationResponse {
  id: string;
  priority: number;
  category: RecommendationCategory;
  title: string;
  description: string;
  impact: string;
  action: string;
}

// ─── History ───────────────────────────────────────────────

export interface EstimateHistoryItem {
  estimate_id: string;
  p25: number;
  p50: number;
  p75: number;
  skills_snapshot: string[];
  changed_fields: string[];
  calculated_at: string;
}

// ─── Wizard form state ─────────────────────────────────────

export interface WizardFormData {
  job_title: string;
  location: string;
  experience_years: number;
  experience_entries: ExperienceEntry[];
  skills: string[];
  education_level: 'none' | 'bachelor' | 'master' | 'phd';
}
