import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Заработок — Узнай свою рыночную стоимость',
  description:
    'Сервис предиктивной оценки резюме на базе ML. Получите точную зарплатную вилку и персональные рекомендации по улучшению профиля.',
  keywords: ['зарплата', 'резюме', 'оценка', 'ML', 'рынок труда', 'карьера'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" data-scroll-behavior="smooth">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
