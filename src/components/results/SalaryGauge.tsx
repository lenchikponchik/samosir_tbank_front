'use client';

import { motion } from 'framer-motion';
import type { SalaryRange } from '@/types';

interface SalaryGaugeProps {
  salary: SalaryRange;
}

function formatSalary(n: number): string {
  return new Intl.NumberFormat('ru-RU').format(n) + ' ₽';
}

export default function SalaryGauge({ salary }: SalaryGaugeProps) {
  const max = salary.p75 * 1.2; // add headroom
  const p25Width = (salary.p25 / max) * 100;
  const p50Width = (salary.p50 / max) * 100;
  const p75Width = (salary.p75 / max) * 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--text-primary)' }}>
          {formatSalary(salary.p50)}
        </span>
        <span style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>медиана</span>
      </div>

      {/* Visual bar */}
      <div style={{ position: 'relative', paddingTop: 32 }}>
        {/* Track */}
        <div
          style={{
            height: 14,
            background: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* p75 bar */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${p75Width}%` }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: '100%',
              background: 'rgba(139, 92, 246, 0.2)',
              borderRadius: 'var(--radius-full)',
            }}
          />
          {/* p50 bar */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${p50Width}%` }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: '100%',
              background: 'rgba(99, 102, 241, 0.35)',
              borderRadius: 'var(--radius-full)',
            }}
          />
          {/* p25 bar */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${p25Width}%` }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: '100%',
              background: 'var(--accent-gradient)',
              borderRadius: 'var(--radius-full)',
            }}
          />
        </div>

        {/* Labels */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 12,
            fontSize: '0.8rem',
          }}
        >
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
              {formatSalary(salary.p25)}
            </div>
            <div style={{ color: 'var(--text-tertiary)' }}>25-й перцентиль</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>
              {formatSalary(salary.p50)}
            </div>
            <div style={{ color: 'var(--text-tertiary)' }}>Медиана</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
              {formatSalary(salary.p75)}
            </div>
            <div style={{ color: 'var(--text-tertiary)' }}>75-й перцентиль</div>
          </div>
        </div>
      </div>
    </div>
  );
}
