'use client';

import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown } from 'lucide-react';
import type { ShapContribution } from '@/types';

interface ShapChartProps {
  contributions: ShapContribution[];
  baseValue?: number;
}

function formatRub(n: number): string {
  const sign = n >= 0 ? '+' : '';
  return sign + new Intl.NumberFormat('ru-RU').format(n) + ' ₽';
}

export default function ShapChart({ contributions, baseValue = 80000 }: ShapChartProps) {
  const sorted = [...contributions].sort(
    (a, b) => Math.abs(b.contribution_rub) - Math.abs(a.contribution_rub)
  );

  const maxAbs = Math.max(...sorted.map((c) => Math.abs(c.contribution_rub)), 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Base value */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 0',
          borderBottom: '1px solid var(--border-light)',
          marginBottom: 4,
        }}
      >
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Базовая оценка</span>
        <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
          {new Intl.NumberFormat('ru-RU').format(baseValue)} ₽
        </span>
      </div>

      {/* Contribution bars */}
      {sorted.map((c, i) => {
        const isPositive = c.contribution_rub >= 0;
        const barWidth = (Math.abs(c.contribution_rub) / maxAbs) * 100;

        return (
          <motion.div
            key={c.feature}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            {/* Feature name */}
            <div
              style={{
                width: 140,
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
              title={c.feature}
            >
              {c.feature.replace('skills:', '').replace('skill:', '')}
            </div>

            {/* Bar */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${barWidth}%` }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                style={{
                  height: 24,
                  borderRadius: 6,
                  minWidth: 4,
                }}
                className={isPositive ? 'shap-positive' : 'shap-negative'}
              />
            </div>

            {/* Value */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: '0.85rem',
                fontWeight: 600,
                color: isPositive ? 'var(--success)' : 'var(--error)',
                flexShrink: 0,
                width: 100,
                justifyContent: 'flex-end',
              }}
            >
              {isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
              {formatRub(c.contribution_rub)}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
