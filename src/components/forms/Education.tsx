'use client';

import type { WizardFormData } from '@/types';
import { GraduationCap } from 'lucide-react';

interface EducationProps {
  data: WizardFormData;
  onChange: (data: Partial<WizardFormData>) => void;
  errors: Record<string, string>;
}

const EDUCATION_OPTIONS = [
  { value: 'none', label: 'Без высшего образования', desc: 'Среднее / среднее специальное' },
  { value: 'bachelor', label: 'Бакалавриат', desc: '4 года обучения' },
  { value: 'master', label: 'Магистратура', desc: '6 лет обучения' },
  { value: 'phd', label: 'PhD / Кандидат наук', desc: 'Учёная степень' },
] as const;

export default function Education({ data, onChange, errors }: EducationProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
          Образование
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Выберите уровень образования — это влияет на оценку
        </p>
      </div>

      <div>
        <label className="input-label">
          <GraduationCap size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
          Уровень образования
        </label>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {EDUCATION_OPTIONS.map((opt) => {
            const isSelected = data.education_level === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange({ education_level: opt.value })}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '16px 20px',
                  borderRadius: 'var(--radius-md)',
                  border: `2px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-light)'}`,
                  background: isSelected ? 'var(--accent-light)' : 'var(--bg-primary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  width: '100%',
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    border: `2px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-medium)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.2s',
                  }}
                >
                  {isSelected && (
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background: 'var(--accent-primary)',
                      }}
                    />
                  )}
                </div>
                <div>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)',
                    }}
                  >
                    {opt.label}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: 2 }}>
                    {opt.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        {errors.education_level && <p className="input-error">{errors.education_level}</p>}
      </div>
    </div>
  );
}
