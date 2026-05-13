import type { Metadata } from 'next';
import './globals.css';

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
