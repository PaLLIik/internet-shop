// Подвал сайта: логотип слева, подпись по центру, иконки соцсетей справа
export default function Footer() {
  return (
    <footer className="site-footer">
      <span className="footer-logo">
        <span className="logo-dollar">$</span>TUFF
      </span>

      <span className="footer-text">
        Developed by <span className="footer-name">Belozerskikh</span>
      </span>

      {/* Ссылки на соцсети открываются в новой вкладке; адреса-заглушки, их нужно заменить на свои */}
      <div className="social">
        <a
          href="https://www.youtube.com/"
          target="_blank"
          rel="noreferrer"
          className="social-icon"
          aria-label="YouTube"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="2" y="5" width="20" height="14" rx="4" />
            <path d="M10 9l5 3-5 3z" />
          </svg>
        </a>
        <a
          href="https://www.facebook.com/"
          target="_blank"
          rel="noreferrer"
          className="social-icon"
          aria-label="Facebook"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="4" />
            <path d="M13.5 21v-7h2.4l.4-2.8h-2.8V9.5c0-.8.3-1.4 1.4-1.4h1.5V5.6c-.3 0-1.1-.1-2.1-.1-2.1 0-3.5 1.3-3.5 3.6v2.1H9.5V14h2.3v7" />
          </svg>
        </a>
        <a
          href="https://www.instagram.com/"
          target="_blank"
          rel="noreferrer"
          className="social-icon"
          aria-label="Instagram"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="0.6" />
          </svg>
        </a>
      </div>
    </footer>
  )
}
