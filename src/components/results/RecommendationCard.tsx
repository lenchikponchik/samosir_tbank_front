'use client';

import { motion } from 'framer-motion';
import { Star, Zap, BookOpen, Award } from 'lucide-react';
import type { RecommendationResponse, RecommendationCategory } from '@/types';

interface RecommendationCardProps {
  rec: RecommendationResponse;
  index: number;
}

const categoryConfig: Record<
  RecommendationCategory,
  { icon: typeof Star; color: string; label: string }
> = {
  hard_skill: { icon: Zap, color: '#6366f1', label: 'Hard Skill' },
  soft_skill: { icon: Star, color: '#f59e0b', label: 'Soft Skill' },
  formatting: { icon: BookOpen, color: '#22c55e', label: 'Формат' },
  certification: { icon: Award, color: '#8b5cf6', label: 'Сертификат' },
};

export default function RecommendationCard({ rec, index }: RecommendationCardProps) {
  const config = categoryConfig[rec.category] || categoryConfig.hard_skill;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      style={{
        padding: 24,
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-light)',
        background: 'var(--bg-primary)',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        transition: 'box-shadow 0.3s, transform 0.3s',
        cursor: 'default',
      }}
      whileHover={{
        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
        y: -2,
      }}
    >
      {/* Top row: category + priority + impact */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: `${config.color}14`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon size={16} color={config.color} />
          </div>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: config.color,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            {config.label}
          </span>
        </div>

        {rec.impact && (
          <span
            style={{
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--success-light)',
              color: 'var(--success)',
              fontSize: '0.8rem',
              fontWeight: 700,
            }}
          >
            {rec.impact}
          </span>
        )}
      </div>

      {/* Title */}
      <h4
        style={{
          fontWeight: 700,
          fontSize: '1rem',
          color: 'var(--text-primary)',
          lineHeight: 1.4,
        }}
      >
        {rec.title}
      </h4>

      {/* Description */}
      <p
        style={{
          fontSize: '0.9rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
        }}
      >
        {rec.description}
      </p>

      {/* Action */}
      {rec.action && (
        <div
          style={{
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--accent-light)',
            fontSize: '0.85rem',
            color: 'var(--accent-primary)',
            fontWeight: 500,
            lineHeight: 1.5,
          }}
        >
          💡 {rec.action}
        </div>
      )}
    </motion.div>
  );
}
