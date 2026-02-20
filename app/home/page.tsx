import Link from 'next/link';
import styles from './page.module.css';
import Background from '../component/background';
import Glass from '../component/glass';

export default function Home() {
  return (
    <main className={styles.page}>
      <Background />
      <Glass>
        <div className={styles.overlay}>
          <section className={styles.card}>
            <p className={styles.kicker}>The Wolfsonian</p>
            <h1 className={styles.title}>Harry Clarke Art Assistant</h1>
            <p className={styles.subtitle}>
              Explore exhibits with camera-assisted matching and linked primary texts.
            </p>

            <div className={styles.actions}>
              <Link href="/chat" className={styles.actionButton}>
                Enter Interface
              </Link>
              <Link href="/camera" className={styles.actionButtonSecondary}>
                Open Camera
              </Link>
            </div>
          </section>
        </div>
      </Glass>
    </main>
  );
}
