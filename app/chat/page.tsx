import { CiSettings } from "react-icons/ci";
import { FaUniversalAccess } from "react-icons/fa";
import { CiCamera } from "react-icons/ci";
import { CiCompass1 } from "react-icons/ci";
import Button from "../component/button";
import Background from "../component/background";
import Glass from "../component/glass";
import Image from "next/image";
import styles from "./page.module.css";

export default function Chat() {
  return (
    <div className="relative w-screen h-screen">
      <Background />

      <Glass>
        <div className={styles.shell}>
          <div className={styles.brandWrap}>
            <Image
              src="/assets/the-wolfsonian.png"
              alt="The Wolfsonian"
              width={190}
              height={90}
              className={styles.logo}
              priority
            />
            <span className={styles.brandLabel}>Harry Clarke Art Assistant</span>
          </div>

          <div className={styles.utilityButtons}>
            <Button
              href="/settings"
              icon={<CiSettings size={28} />}
              className={styles.utilityButton}
            />
            <Button
              href="/accessibility"
              icon={<FaUniversalAccess size={28} />}
              className={styles.utilityButton}
            />
          </div>

          <div className={styles.centerButtons}>
            <Button
              href="/camera"
              icon={<CiCamera size={34} />}
              label="Camera Mode"
              className={styles.mainButton}
            />
            <Button
              href="/panel"
              icon={<CiCompass1 size={34} />}
              label="Panel Mode"
              className={styles.mainButton}
            />
          </div>
        </div>
      </Glass>
    </div>
  );
}
