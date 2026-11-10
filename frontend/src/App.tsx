import { useRef, useEffect } from 'react';
import styles from './App.module.css';
import bgImage from './assets/background.svg';
import logoImage from './assets/logo.svg';

// --- ИКОНКИ ---
const HomeIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const MapIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>;
const TrophyIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>;
const SettingsIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;

const generateLevels = () => {
  return Array.from({ length: 30 }, (_, i) => {
    const id = i + 1;
    return {
      id,
      status: id <= 3 ? 'completed' : id === 4 ? 'active' : 'locked',
      top: `${68 + Math.sin(i * 0.6) * 8}%`, 
    };
  });
};

const levels = generateLevels();

const LevelNode = ({ level, index }: { level: any, index: number }) => {
  return (
    <div 
      className={styles.levelWrapper} 
      style={{ top: level.top, left: `${150 + index * 180}px` }}
    >
      <div className={`${styles.levelCircle} ${styles[level.status]}`}>
        <span className={styles.levelNumber}>{level.id}</span>
      </div>
    </div>
  );
};

function App() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const targetScroll = useRef(0);
  const animationFrame = useRef<number | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Инициализируем целевую позицию текущим скроллом
    targetScroll.current = el.scrollLeft;

    const handleWheel = (e: WheelEvent) => {
      // Если крутят колесико (вверх или вниз)
      if (e.deltaY !== 0) {
        e.preventDefault(); // Отключаем стандартное поведение
        
        // Добавляем к целевой позиции (deltaY > 0 - вниз, deltaY < 0 - вверх)
        // Умножаем на 1.5 для скорости
        targetScroll.current += e.deltaY * 1.5; 
        
        // Ограничиваем, чтобы не улететь за края
        const maxScroll = el.scrollWidth - el.clientWidth;
        targetScroll.current = Math.max(0, Math.min(targetScroll.current, maxScroll));

        // Запускаем плавную анимацию, если она еще не идет
        if (!animationFrame.current) {
          const smoothScroll = () => {
            const diff = targetScroll.current - el.scrollLeft;
            
            // Плавное приближение (0.1 - коэффициент плавности)
            el.scrollLeft += diff * 0.1;

            // Если разница большая, продолжаем анимацию
            if (Math.abs(diff) > 0.5) {
              animationFrame.current = requestAnimationFrame(smoothScroll);
            } else {
              el.scrollLeft = targetScroll.current; // Фиксируем точное значение
              animationFrame.current = null;
            }
          };
          animationFrame.current = requestAnimationFrame(smoothScroll);
        }
      }
    };

    // Добавляем слушатель (passive: false нужен для preventDefault)
    el.addEventListener('wheel', handleWheel, { passive: false });
    
    // Убираем слушатель при размонтировании компонента
    return () => {
      el.removeEventListener('wheel', handleWheel);
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    };
  }, []);

  return (
    <div className={styles.mainScreen} style={{ backgroundImage: `url(${bgImage})` }}>
      
      <aside className={styles.sidebar}>
        <div className={styles.logoContainer}>
          <img src={logoImage} alt="Логотип" className={styles.logoImg} />
        </div>
        <nav className={styles.navMenu}>
          <button className={`${styles.navButton} ${styles.active}`}><HomeIcon /></button>
          <button className={styles.navButton}><MapIcon /></button>
          <button className={styles.navButton}><TrophyIcon /></button>
        </nav>
        <div className={styles.bottomMenu}>
          <button className={styles.navButton}><SettingsIcon /></button>
        </div>
      </aside>

      {/* Привязываем ref к контейнеру скролла */}
      <div className={styles.scrollArea} ref={scrollRef}>
        <div className={styles.levelsTrack}>
          {levels.map((lvl, index) => (
            <LevelNode key={lvl.id} level={lvl} index={index} />
          ))}
        </div>
      </div>

    </div>
  );
}

export default App;