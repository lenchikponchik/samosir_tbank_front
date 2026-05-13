'use client';

import { BarChart3, TrendingUp, Search, Target } from 'lucide-react';
import type { MarketInsights as MarketInsightsType } from '@/types';

interface MarketInsightsProps {
  insights: MarketInsightsType;
}

export default function MarketInsights({ insights }: MarketInsightsProps) {
  const trendLabels: Record<string, { label: string; color: string }> = {
    growing: { label: 'Растёт', color: 'var(--success)' },
    declining: { label: 'Снижается', color: 'var(--error)' },
    stable: { label: 'Стабильный', color: 'var(--text-secondary)' },
  };
  const trend = trendLabels[insights.demand_trend] || trendLabels.stable;

  const metrics = [
    {
      icon: Search,
      label: 'Вакансий проанализировано',
      value: insights.vacancies_analyzed.toLocaleString('ru-RU'),
    },
    {
      icon: Target,
      label: 'Совпадение навыков',
      value: `${insights.skill_match_percentage.toFixed(1)}%`,
    },
    {
      icon: TrendingUp,
      label: 'Тренд спроса',
      value: trend.label,
      color: trend.color,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Metric cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 12,
        }}
      >
        {metrics.map((m) => (
          <div
            key={m.label}
            style={{
              padding: 16,
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-secondary)',
              textAlign: 'center',
            }}
          >
            <m.icon
              size={20}
              color="var(--accent-primary)"
              style={{ marginBottom: 8 }}
            />
            <div
              style={{
                fontSize: '1.3rem',
                fontWeight: 800,
                color: m.color || 'var(--text-primary)',
              }}
            >
              {m.value}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 4 }}>
              {m.label}
            </div>
          </div>
        ))}
      </div>

      {/* Missing skills */}
      {insights.top_missing_skills.length > 0 && (
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginBottom: 8,
            }}
          >
            <BarChart3 size={14} color="var(--error)" />
            <span
              style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
              }}
            >
              Недостающие навыки
            </span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {insights.top_missing_skills.map((skill) => (
              <span
                key={skill}
                style={{
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--error-light)',
                  color: 'var(--error)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
