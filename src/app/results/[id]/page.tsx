'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  RefreshCw,
  Download,
  Sparkles,
  BarChart3,
  MessageSquare,
  Globe,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SalaryGauge from '@/components/results/SalaryGauge';
import ShapChart from '@/components/results/ShapChart';
import RecommendationCard from '@/components/results/RecommendationCard';
import MarketInsights from '@/components/results/MarketInsights';
import type { EstimateResponse } from '@/types';

/* ─── Mock data for demo / when backend is unavailable ───── */
const MOCK_DATA: EstimateResponse = {
  id: 'demo',
  resume_id: 'demo-resume',
  salary_range: { p25: 120000, p50: 175000, p75: 240000 },
  market_insights: {
    vacancies_analyzed: 1247,
    skill_match_percentage: 72.5,
    top_missing_skills: ['Docker', 'Kubernetes', 'CI/CD'],
    demand_trend: 'growing',
  },
  shap_contributions: [
    { feature: 'experience_years', contribution_rub: 45000 },
    { feature: 'skills:Python', contribution_rub: 25000 },
    { feature: 'skills:FastAPI', contribution_rub: 18000 },
    { feature: 'skills:PostgreSQL', contribution_rub: 12000 },
    { feature: 'location:Москва', contribution_rub: 15000 },
    { feature: 'skills:Docker (отсутствует)', contribution_rub: -20000 },
    { feature: 'skills:Kubernetes (отсутствует)', contribution_rub: -15000 },
    { feature: 'education:bachelor', contribution_rub: 5000 },
  ],
  recommendations: [
    {
      id: '1',
      priority: 1,
      category: 'hard_skill',
      title: 'Добавьте навык Docker',
      description:
        'Docker — один из самых востребованных навыков для backend-разработчиков. 85% вакансий Senior Python Developer требуют его знание. Контейнеризация приложений критически важна для современных CI/CD пайплайнов.',
      impact: '+20 000 ₽',
      action:
        'Добавьте "Docker" в раздел навыков и опишите опыт контейнеризации в блоке опыта работы.',
    },
    {
      id: '2',
      priority: 2,
      category: 'hard_skill',
      title: 'Изучите Kubernetes',
      description:
        'Kubernetes дополняет Docker и значительно повышает ценность специалиста. Компании активно ищут DevOps-навыки у бекенд-разработчиков — это ваш рычаг роста.',
      impact: '+15 000 ₽',
      action:
        'Пройдите курс по K8s (2-3 недели), добавьте навык и опишите опыт работы с кластерами.',
    },
    {
      id: '3',
      priority: 3,
      category: 'certification',
      title: 'Получите сертификат AWS/GCP',
      description:
        'Облачные сертификации демонстрируют системное мышление и повышают доверие работодателей. AWS Solutions Architect — наиболее ценный на рынке.',
      impact: '+10 000 ₽',
      action:
        'Подготовьтесь к AWS SAA (4-6 недель) и добавьте сертификат в резюме.',
    },
  ],
  calculated_at: new Date().toISOString(),
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const estimateId = params.id as string;

  const [data, setData] = useState<EstimateResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        if (estimateId === 'demo') {
          // Simulate loading delay
          await new Promise((r) => setTimeout(r, 800));
          setData(MOCK_DATA);
        } else {
          const { getEstimate } = await import('@/lib/api');
          const result = await getEstimate(estimateId);
          setData(result);
        }
      } catch {
        // Fallback to mock data if backend is unavailable
        setData(MOCK_DATA);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [estimateId]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main style={{ flex: 1, padding: '60px 0' }}>
          <div className="container-main" style={{ maxWidth: 960 }}>
            {/* Skeleton loading */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div className="skeleton" style={{ height: 32, width: 300 }} />
              <div className="glass-card" style={{ padding: 32 }}>
                <div className="skeleton" style={{ height: 48, width: '60%', marginBottom: 16 }} />
                <div className="skeleton" style={{ height: 14, width: '100%', marginBottom: 16 }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div className="skeleton" style={{ height: 20, width: 100 }} />
                  <div className="skeleton" style={{ height: 20, width: 100 }} />
                  <div className="skeleton" style={{ height: 20, width: 100 }} />
                </div>
              </div>
              <div className="bento-grid">
                <div className="skeleton" style={{ height: 200 }} />
                <div className="skeleton" style={{ height: 200 }} />
                <div className="skeleton" style={{ height: 200 }} />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main style={{ flex: 1, padding: '40px 0 80px' }}>
        <div className="container-main" style={{ maxWidth: 960 }}>
          {/* Top bar */}
          <motion.div
            custom={0}
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 28,
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <button
              onClick={() => router.push('/resume')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
                fontWeight: 500,
                fontSize: '0.9rem',
              }}
            >
              <ArrowLeft size={18} />
              Изменить резюме
            </button>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className="btn-gradient"
                style={{ padding: '8px 18px', fontSize: '0.85rem' }}
                onClick={() => router.push('/resume')}
              >
                <RefreshCw size={16} />
                Пересчитать
              </button>
            </div>
          </motion.div>

          {/* ─── Salary Card (full width) ──────────────── */}
          <motion.div
            custom={1}
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="glass-card"
            style={{ padding: '32px 36px', marginBottom: 24 }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 20,
              }}
            >
              <Sparkles size={18} color="var(--accent-primary)" />
              <h2
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                }}
              >
                Ваша зарплатная вилка
              </h2>
            </div>
            <SalaryGauge salary={data.salary_range} />
          </motion.div>

          {/* ─── Bento Grid ────────────────────────────── */}
          <div className="bento-grid">
            {/* SHAP Analysis */}
            <motion.div
              custom={2}
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              className="glass-card"
              style={{
                padding: 28,
                gridColumn: 'span 2',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 20,
                }}
              >
                <BarChart3 size={18} color="var(--accent-primary)" />
                <h3
                  style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                  }}
                >
                  Факторы влияния (SHAP)
                </h3>
              </div>
              <ShapChart contributions={data.shap_contributions} />
            </motion.div>

            {/* Market Insights */}
            <motion.div
              custom={3}
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              className="glass-card"
              style={{ padding: 28 }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 20,
                }}
              >
                <Globe size={18} color="var(--accent-primary)" />
                <h3
                  style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                  }}
                >
                  Обзор рынка
                </h3>
              </div>
              <MarketInsights insights={data.market_insights} />
            </motion.div>
          </div>

          {/* ─── Recommendations ──────────────────────── */}
          {data.recommendations.length > 0 && (
            <motion.div
              custom={4}
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              style={{ marginTop: 32 }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 20,
                }}
              >
                <MessageSquare size={18} color="var(--accent-primary)" />
                <h3
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                  }}
                >
                  Рекомендации по улучшению
                </h3>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: 16,
                }}
              >
                {data.recommendations.map((rec, i) => (
                  <RecommendationCard key={rec.id} rec={rec} index={i} />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
