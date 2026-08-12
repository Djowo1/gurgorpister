import { motion } from 'framer-motion';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import styles from './About.module.css';

const socials = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/gurgor_pister',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="0.1" fill="currentColor" strokeWidth="3"/>
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@mysticxtarot',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/447535958319',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
      </svg>
    ),
  },
    {
    label: 'Twitter/X',
    href: 'https://x.com/gurgorpiser',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    )
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/profile.php?id=61590943714931',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
    )
  }
];

export default function About() {
  const { ref: textRef, isVisible: textVisible } = useIntersectionObserver();
  const { ref: imgRef, isVisible: imgVisible } = useIntersectionObserver();

  return (
    <section className={styles.section} id="about">
      <div className={styles.container}>
        <motion.div
          ref={textRef}
          className={styles.text}
          initial={{ opacity: 0, x: -32 }}
          animate={textVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="section-label" style={{ justifyContent: 'flex-start' }}>The Gift</span>

          <h2 className={styles.title}>
            Some truths live<br />
            <em>between the cards.</em>
          </h2>

          <div className={styles.body}>
            <p>
              GURGORPISTER was built around one belief: that the right reading, from the right reader,
              at the right moment, changes things.
            </p>
            <p>
              Our four readers bring different gifts — different ways of seeing.
              What they share is honesty, depth, and the discipline to tell you
              what the cards actually say, not what you want to hear.
            </p>
             <motion.div
          ref={imgRef}
          className={styles.imageWrap}
          initial={{ opacity: 0, x: 32 }}
          animate={imgVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <img
            src="https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?w=700&h=900&fit=crop&auto=format&q=80"
            alt="Starfield atmosphere"
            className={styles.image}
            loading="lazy"
          />
          <div className={styles.imageOverlay} />
        </motion.div>
            <p>
              Every session is private. Every reading is done by hand.
              No algorithms. No automation. Just the cards and the person reading them.
            </p>
          </div>

          <a href="#readers" className={styles.cta} onClick={e => {
            e.preventDefault();
            document.getElementById('readers')?.scrollIntoView({ behavior: 'smooth' });
          }}>
            Book Your First Reading
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>

          <div className={styles.socials}>
            {socials.map(s => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialBtn}
                aria-label={s.label}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </motion.div>

        {/* <motion.div
          ref={imgRef}
          className={styles.imageWrap}
          initial={{ opacity: 0, x: 32 }}
          animate={imgVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <img
            src="https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?w=700&h=900&fit=crop&auto=format&q=80"
            alt="Starfield atmosphere"
            className={styles.image}
            loading="lazy"
          />
          <div className={styles.imageOverlay} />
        </motion.div> */}
      </div>
    </section>
  );
}
