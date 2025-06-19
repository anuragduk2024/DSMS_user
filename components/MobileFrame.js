import React from 'react';
import styles from './MobileFrame.module.css';

export default function MobileFrame({ children }) {
  return (
    <div className={styles.mobileBg}>
      <div className={styles.phoneFrame}>
        <div className={styles.content}>{children}</div>
        {/* Optional: Add bottom nav here if needed */}
      </div>
    </div>
  );
} 