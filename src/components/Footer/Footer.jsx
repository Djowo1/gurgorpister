import { Twitter, Send, Facebook, Instagram, MessageCircle } from 'lucide-react';
import Logo from '../Logo/Logo';
import styles from './Footer.module.css';

const quickLinks = [
  { label: 'Home', href: '#home' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'About', href: '#about' },
  { label: 'FAQ', href: '#faq' },
];

const readerLinks = [
  { label: 'Seraphine Voss', href: '#readers' },
  { label: 'Dorian Ashcroft', href: '#readers' },
  { label: 'Isolde Maren', href: '#readers' },
  { label: 'Cassian Vale', href: '#readers' },
];

const socials = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/gurgor_pister',
    icon: <Instagram size={18} />,
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@mysticxtarot',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/447535958319',
    icon: <MessageCircle size={18} />,
  },
  {
    label: 'Twitter',
    href: 'https://x.com/gurgorpiser',
    icon: <Twitter size={18} />,
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/profile.php?id=61590943714931',
    icon: <Facebook size={18} />,
  },
];

const handleNavClick = (e, href) => {
  e.preventDefault();
  document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
};

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Brand */}
          <div className={styles.brand}>
            <Logo size="md" />
            <p className={styles.tagline}>
              <em>The cards have always known.</em>
            </p>
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
          </div>

          {/* Quick Links */}
          <div className={styles.col}>
            <h3 className={styles.colTitle}>Quick Links</h3>
            <ul className={styles.linkList}>
              {quickLinks.map(l => (
                <li key={l.label}>
                  <a href={l.href} onClick={e => handleNavClick(e, l.href)} className={styles.link}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Readers */}
          <div className={styles.col}>
            <h3 className={styles.colTitle}>Our Readers</h3>
            <ul className={styles.linkList}>
              {readerLinks.map(l => (
                <li key={l.label}>
                  <a href={l.href} onClick={e => handleNavClick(e, l.href)} className={styles.link}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className={styles.col}>
            <h3 className={styles.colTitle}>Connect</h3>
            <ul className={styles.linkList}>
              {socials.map(s => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    {s.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="#faq" onClick={e => handleNavClick(e, '#faq')} className={styles.link}>FAQ</a>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} GURGORPISTER. All rights reserved.
          </p>
          <p className={styles.made}>Made with intention.</p>
        </div>
      </div>
    </footer>
  );
}
