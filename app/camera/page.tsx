'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { exhibitHashMap, exhibits, PrimaryText, type Exhibit } from './schema';
import styles from './camera.module.css';

function frameHashFromCanvas(canvas: HTMLCanvasElement): string {
  const context = canvas.getContext('2d');
  if (!context) {
    return 'fallback';
  }

  const sampleWidth = 16;
  const sampleHeight = 16;
  const downsample = document.createElement('canvas');
  downsample.width = sampleWidth;
  downsample.height = sampleHeight;

  const downsampleContext = downsample.getContext('2d');
  if (!downsampleContext) {
    return 'fallback';
  }

  downsampleContext.drawImage(canvas, 0, 0, sampleWidth, sampleHeight);
  const imageData = downsampleContext.getImageData(0, 0, sampleWidth, sampleHeight).data;

  let total = 0;
  for (let i = 0; i < imageData.length; i += 4) {
    const red = imageData[i];
    const green = imageData[i + 1];
    const blue = imageData[i + 2];
    total += red + green + blue;
  }

  const normalized = total % 7;
  return `h${normalized}`;
}

export default function Camera() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [selectedExhibitId, setSelectedExhibitId] = useState(exhibits[0]?.id ?? '');
  const [lastHash, setLastHash] = useState<string>('none');

  const selectedExhibit = useMemo<Exhibit | undefined>(
    () => exhibits.find((item) => item.id === selectedExhibitId),
    [selectedExhibitId]
  );

  const stopCamera = useCallback(() => {
    const stream = streamRef.current;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  const startCamera = useCallback(async () => {
    setPermissionError(null);
    try {
      if (typeof window === 'undefined' || typeof navigator === 'undefined') {
        setPermissionError('Camera is only available in a browser context.');
        return;
      }

      if (!window.isSecureContext) {
        setPermissionError('Camera requires HTTPS on iPhone browsers (including Chrome).');
        return;
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setPermissionError(
          'Camera API unavailable. On iPhone Chrome, open this app via HTTPS and allow camera permission.'
        );
        return;
      }

      // Stop any existing stream before starting a new one.
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
      } catch {
        // Fallback for iOS devices that reject richer constraints.
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);
    } catch (error) {
      const domError = error as DOMException | undefined;
      const name = domError?.name ?? 'UnknownError';
      const message = domError?.message || String(error);

      if (name === 'NotAllowedError') {
        setPermissionError(
          'Camera blocked. In iPhone Settings > Chrome > Camera, allow access, then reload the page.'
        );
      } else if (name === 'NotFoundError') {
        setPermissionError('No camera device was found on this phone.');
      } else if (name === 'NotReadableError') {
        setPermissionError('Camera is busy in another app. Close other camera apps and try again.');
      } else if (name === 'OverconstrainedError') {
        setPermissionError('Camera constraints unsupported on this device. Retry and allow fallback.');
      } else {
        setPermissionError(`Camera access failed (${name}): ${message}`);
      }
      console.error(error);
    }
  }, []);

  const analyzeFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || !video.videoWidth || !video.videoHeight) {
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const hash = frameHashFromCanvas(canvas);
    setLastHash(hash);

    const matchedExhibitId = exhibitHashMap.get(hash) ?? exhibitHashMap.get('fallback');
    if (matchedExhibitId) {
      setSelectedExhibitId(matchedExhibitId);
    }
  }, []);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <main className={styles.layout}>
      <section className={styles.infoPanel}>
        <h2 className={styles.panelHeading}>Exhibit Knowledge Map</h2>
        <p className={styles.panelBody}>
          Primary text context for the currently matched exhibit.
        </p>

        <label htmlFor="exhibit-select" className={styles.selectLabel}>
          Active exhibit
        </label>
        <select
          id="exhibit-select"
          value={selectedExhibitId}
          onChange={(event) => setSelectedExhibitId(event.target.value)}
          className={styles.select}
        >
          {exhibits.map((exhibit) => (
            <option key={exhibit.id} value={exhibit.id}>
              {exhibit.name}
            </option>
          ))}
        </select>

        <h3 className={styles.exhibitTitle}>{selectedExhibit?.name}</h3>
        <p className={styles.exhibitDescription}>{selectedExhibit?.description}</p>

        <h4 className={styles.primaryHeading}>Primary Texts</h4>
        <ul className={styles.primaryList}>
          {(selectedExhibit?.primaryTexts ?? []).map((text: PrimaryText) => (
            <li key={text.id} className={styles.primaryItem}>
              <p className={styles.primaryTitle}>{text.title}</p>
              <p className={styles.primaryMeta}>
                {text.source}, {text.year}
              </p>
              <p className={styles.primaryExcerpt}>{text.excerpt}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.cameraStage}>
        <header className={styles.headerRow}>
          <h1 className={styles.title}>Camera Mode</h1>
          <Link href="/chat" className={styles.backLink}>
            Back
          </Link>
        </header>

        <div className={styles.cameraWindow}>
          <video ref={videoRef} className={styles.video} muted playsInline autoPlay />

          {selectedExhibit?.hotspots.map((hotspot) => (
            <button
              key={hotspot.id}
              type="button"
              onClick={() => setSelectedExhibitId(hotspot.exhibitId)}
              title={hotspot.label}
              style={{
                position: 'absolute',
                left: `${hotspot.xPercent}%`,
                top: `${hotspot.yPercent}%`,
                transform: 'translate(-50%, -50%)',
                width: '20px',
                height: '20px',
                borderRadius: '999px',
                border: '2px solid #fff',
                background: hotspot.exhibitId === selectedExhibitId ? '#ef4444' : '#f59e0b',
                boxShadow: '0 0 0 4px rgba(255,255,255,0.25)',
                cursor: 'pointer',
              }}
            />
          ))}
        </div>

        <div className={styles.controls}>
          <button
            type="button"
            onClick={cameraActive ? stopCamera : startCamera}
            className={styles.primaryButton}
          >
            {cameraActive ? 'Stop Camera' : 'Start Camera'}
          </button>

          <button
            type="button"
            onClick={analyzeFrame}
            disabled={!cameraActive}
            className={styles.secondaryButton}
          >
            Analyze Frame
          </button>
        </div>

        <p className={styles.hashText}>
          Frame hash: <strong>{lastHash}</strong>
        </p>
        {permissionError && <p className={styles.errorText}>{permissionError}</p>}
      </section>

      <aside className={styles.legendPanel}>
        <h3 className={styles.panelHeading}>Camera to Text Flow</h3>
        <p className={styles.panelBody}>Live view in center, context panels around it for quick reading.</p>
        <div className={styles.legendRow}>
          <span className={styles.legendDotActive} />
          <span>Selected hotspot</span>
        </div>
        <div className={styles.legendRow}>
          <span className={styles.legendDotIdle} />
          <span>Available hotspot</span>
        </div>
      </aside>

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </main>
  );
}
