import Image from "next/image";
import styles from "./landingpage.module.css"; // Ensure you're using CSS modules if this is in a module.css file
import Link from "next/link";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.textContent}>
          <h1 className={styles.heading}>upNote.ai</h1>
          <p className={styles.subHeading}>
            Elevate your note-taking with our advanced, full-stack LLM-based application.
          </p>
        </div>
        <div className={styles.overlay}></div>
      </div>
    </main>
  );
}
