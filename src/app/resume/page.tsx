'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WizardStepper from '@/components/forms/WizardStepper';
import PersonalInfo from '@/components/forms/PersonalInfo';
import Experience from '@/components/forms/Experience';
import Skills from '@/components/forms/Skills';
import Education from '@/components/forms/Education';
import { createEstimate } from '@/lib/api';
import type { WizardFormData } from '@/types';
import { Suspense } from 'react';

const STEPS = ['Профиль', 'Опыт', 'Навыки', 'Образование'];

const initialData: WizardFormData = {
  job_title: '',
  location: '',
  experience_years: 0,
  experience_entries: [],
  skills: [],
  education_level: 'none',
};

function WizardForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stepParam = parseInt(searchParams.get('step') || '1');
  const currentStep = Math.min(Math.max(stepParam, 1), 4);

  const [formData, setFormData] = useState<WizardFormData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const updateData = (partial: Partial<WizardFormData>) => {
    setFormData((prev) => ({ ...prev, ...partial }));
    // Clear errors for updated fields
    const updatedKeys = Object.keys(partial);
    setErrors((prev) => {
      const next = { ...prev };
      updatedKeys.forEach((k) => delete next[k]);
      return next;
    });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.job_title.trim()) newErrors.job_title = 'Укажите желаемую должность';
      if (!formData.location.trim()) newErrors.location = 'Укажите город';
    }

    if (currentStep === 2) {
      if (formData.experience_years < 0) newErrors.experience_years = 'Опыт не может быть отрицательным';
    }

    if (currentStep === 3) {
      if (formData.skills.length === 0) newErrors.skills = 'Добавьте хотя бы один навык';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goNext = () => {
    if (!validate()) return;
    if (currentStep < 4) {
      router.push(`/resume?step=${currentStep + 1}`);
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      router.push(`/resume?step=${currentStep - 1}`);
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);

    try {
      const result = await createEstimate({
        job_title: formData.job_title,
        experience_years: formData.experience_years,
        skills: formData.skills,
        location: formData.location,
        education_level: formData.education_level,
        experience_entries: formData.experience_entries.map((e) => ({
          company: e.company,
          title: e.title,
          duration_months: e.duration_months,
          description: e.description,
        })),
      });
      router.push(`/results/${result.id}`);
    } catch {
      // If backend is unavailable, redirect with mock id
      router.push('/results/demo');
    } finally {
      setLoading(false);
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction > 0 ? -80 : 80, opacity: 0 }),
  };

  const stepComponents: Record<number, React.ReactNode> = {
    1: <PersonalInfo data={formData} onChange={updateData} errors={errors} />,
    2: <Experience data={formData} onChange={updateData} errors={errors} />,
    3: <Skills data={formData} onChange={updateData} errors={errors} />,
    4: <Education data={formData} onChange={updateData} errors={errors} />,
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main style={{ flex: 1, padding: '40px 0 80px' }}>
        <div className="container-main" style={{ maxWidth: 680 }}>
          {/* Stepper */}
          <WizardStepper currentStep={currentStep} steps={STEPS} />

          {/* Form card */}
          <div
            className="glass-card"
            style={{ padding: '36px 32px', minHeight: 340 }}
          >
            <AnimatePresence mode="wait" custom={currentStep}>
              <motion.div
                key={currentStep}
                custom={1}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                {stepComponents[currentStep]}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation buttons */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 24,
              gap: 12,
            }}
          >
            <button
              type="button"
              onClick={goBack}
              disabled={currentStep === 1}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 24px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-light)',
                background: 'var(--bg-primary)',
                color: currentStep === 1 ? 'var(--text-tertiary)' : 'var(--text-secondary)',
                cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
                fontWeight: 600,
                fontSize: '0.95rem',
                transition: 'all 0.2s',
              }}
            >
              <ArrowLeft size={18} />
              Назад
            </button>

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={goNext}
                className="btn-gradient"
              >
                Далее
                <ArrowRight size={18} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="btn-gradient"
                disabled={loading}
                style={{ minWidth: 180 }}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Анализируем...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Оценить резюме
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ResumePage() {
  return (
    <Suspense>
      <WizardForm />
    </Suspense>
  );
}
