/**
 * ANKIT KUMAR - 3D SPATIAL DEVELOPER ROOM PORTFOLIO
 * Single-screen (100vw x 100vh), subtle cursor-driven 3D parallax (±4deg),
 * Interactive Desk & Lounge Hotspots, Glassmorphic Modals, & Audio Synthesizer
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 0. CYBER PORTAL INTRO LOADER (AS PER UPLOADED DESIGN REFERENCE)
  // =========================================================================
  const portalLoader = document.getElementById('portalLoader');
  const portalProgressCircle = document.getElementById('portalProgressCircle');
  const portalPctDisplay = document.getElementById('portalPctDisplay');
  const portalSubBadge = document.getElementById('portalSubBadge');
  const portalEnterBtn = document.getElementById('portalEnterBtn');

  if (portalLoader && portalProgressCircle && portalPctDisplay) {
    const totalCircumference = 2 * Math.PI * 100; // ~628.32
    portalProgressCircle.style.strokeDasharray = `${totalCircumference}`;
    portalProgressCircle.style.strokeDashoffset = `${totalCircumference}`;

    let currentPct = 0;
    const duration = 1600; // 1.6s smooth countdown
    const startTime = performance.now();

    const statusMilestones = [
      { max: 25, text: 'INITIALIZING 3D ENGINE...' },
      { max: 55, text: 'CONNECTING IITR NODES...' },
      { max: 80, text: 'CALIBRATING NEON SHADERS...' },
      { max: 99, text: 'SYNCHRONIZING REPOSITORIES...' },
      { max: 100, text: 'READY' }
    ];

    const updateLoader = (now) => {
      const elapsed = now - startTime;
      const ratio = Math.min(1, elapsed / duration);
      // Smooth cubic ease-out
      const eased = 1 - Math.pow(1 - ratio, 3);
      currentPct = Math.min(100, eased * 100);

      const offset = totalCircumference * (1 - (currentPct / 100));
      portalProgressCircle.style.strokeDashoffset = offset;
      portalPctDisplay.textContent = `${Math.round(currentPct)}%`;

      for (const m of statusMilestones) {
        if (currentPct <= m.max) {
          if (portalSubBadge && portalSubBadge.textContent !== m.text) {
            portalSubBadge.textContent = m.text;
          }
          break;
        }
      }

      if (ratio < 1) {
        requestAnimationFrame(updateLoader);
      } else {
        portalPctDisplay.textContent = '100%';
        if (portalSubBadge) portalSubBadge.textContent = 'READY';
        portalProgressCircle.style.strokeDashoffset = '0';
        if (portalEnterBtn) {
          portalEnterBtn.classList.add('ready');
        }
      }
    };

    requestAnimationFrame(updateLoader);

    const exitPortal = () => {
      initAudio();
      // Futuristic 4-note chord chime with rich volume
      playTone(523.25, 'sine', 0.22, 0.22); // C5
      setTimeout(() => playTone(659.25, 'sine', 0.22, 0.22), 60);  // E5
      setTimeout(() => playTone(783.99, 'sine', 0.32, 0.25), 120); // G5
      setTimeout(() => playTone(1046.50, 'sine', 0.5, 0.28), 180); // C6

      portalLoader.classList.add('fade-out');
      setTimeout(() => {
        portalLoader.style.display = 'none';
      }, 820);
    };

    if (portalEnterBtn) {
      portalEnterBtn.addEventListener('click', exitPortal);
    }

    // Dismiss on Enter or Space
    window.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && !portalLoader.classList.contains('fade-out')) {
        exitPortal();
      }
    }, { once: true });
  }

  // =========================================================================
  // 1. WEB AUDIO API SYNTHESIZER (FUTURISTIC HIGH-FIDELITY AUDIO FEEDBACK)
  // =========================================================================
  let audioCtx = null;
  let masterGain = null;
  let masterCompressor = null;
  let soundEnabled = true;

  const initAudio = () => {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
        masterGain = audioCtx.createGain();
        masterGain.gain.setValueAtTime(0.85, audioCtx.currentTime);

        masterCompressor = audioCtx.createDynamicsCompressor();
        masterCompressor.threshold.setValueAtTime(-14, audioCtx.currentTime);
        masterCompressor.knee.setValueAtTime(15, audioCtx.currentTime);
        masterCompressor.ratio.setValueAtTime(6, audioCtx.currentTime);
        masterCompressor.attack.setValueAtTime(0.003, audioCtx.currentTime);
        masterCompressor.release.setValueAtTime(0.12, audioCtx.currentTime);

        masterGain.connect(masterCompressor);
        masterCompressor.connect(audioCtx.destination);
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  };

  const playTone = (freq, type = 'sine', duration = 0.09, gainVal = 0.20) => {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx || !masterGain) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio not permitted yet
    }
  };

  // Mechanical typing click for terminal input & keyboard interactions
  const playKeyClick = (pitch = 1050) => {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx || !masterGain) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      const jitter = (Math.random() - 0.5) * 120;
      osc.frequency.setValueAtTime(pitch + jitter, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, audioCtx.currentTime + 0.03);
      gain.gain.setValueAtTime(0.16, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.03);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.03);
    } catch (e) {}
  };

  // Warp teleport sound sweep when jumping across sections
  const playWarpTeleport = () => {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx || !masterGain) return;
    try {
      const now = audioCtx.currentTime;
      // High frequency upward sci-fi harmonic sweep
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(340, now);
      osc1.frequency.exponentialRampToValueAtTime(1450, now + 0.25);
      osc1.frequency.exponentialRampToValueAtTime(840, now + 0.45);
      gain1.gain.setValueAtTime(0.02, now);
      gain1.gain.linearRampToValueAtTime(0.26, now + 0.15);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.48);
      osc1.connect(gain1);
      gain1.connect(masterGain);
      osc1.start(now);
      osc1.stop(now + 0.48);

      // Deep sub-bass energy whoosh
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(140, now);
      osc2.frequency.exponentialRampToValueAtTime(45, now + 0.4);
      gain2.gain.setValueAtTime(0.28, now);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
      osc2.connect(gain2);
      gain2.connect(masterGain);
      osc2.start(now);
      osc2.stop(now + 0.4);
    } catch (e) {}
  };

  // High-tech tactile click for buttons
  const playClickSound = () => {
    playTone(720, 'sine', 0.07, 0.22);
    setTimeout(() => playTone(520, 'triangle', 0.08, 0.18), 30);
  };

  // Hover tick for cards and links
  const playHoverSound = () => {
    playTone(640, 'triangle', 0.035, 0.12);
  };

  // Success chime
  const playSuccessChime = () => {
    playTone(523.25, 'sine', 0.18, 0.22);
    setTimeout(() => playTone(659.25, 'sine', 0.18, 0.22), 70);
    setTimeout(() => playTone(783.99, 'sine', 0.25, 0.24), 140);
  };

  const soundToggleBtn = document.getElementById('soundToggle');
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      initAudio();
      soundEnabled = !soundEnabled;
      soundToggleBtn.classList.toggle('muted', !soundEnabled);
      if (soundEnabled) {
        playSuccessChime();
      }
    });
  }

  // Trigger audio init on first gesture
  ['click', 'keydown', 'touchstart'].forEach(evt => {
    window.addEventListener(evt, () => initAudio(), { once: true });
  });


  // =========================================================================
  // 2. CUSTOM GLOWING 3D CURSOR
  // =========================================================================
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (cursorDot) {
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    }
  });

  const renderCursor = () => {
    ringX += (mouseX - ringX) * 0.2;
    ringY += (mouseY - ringY) * 0.2;
    if (cursorRing) {
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
    }
    requestAnimationFrame(renderCursor);
  };
  renderCursor();

  // Hover ring activation and audio feedback
  document.querySelectorAll('button, a, input, textarea, .zone-right-portrait, .sidebar-link, .hotspot-desk-item, .project-card, .skill-card, .edu-card, .tc-chip, .css-pill, .award-chip-gold, .filter-tab').forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (cursorRing) cursorRing.classList.add('active');
      playHoverSound();
    });
    el.addEventListener('mouseleave', () => {
      if (cursorRing) cursorRing.classList.remove('active');
    });
  });


  // =========================================================================
  // 3. 3D CINEMATIC PORTRAIT & TERRAIN BEDROCK MONOLITH PARALLAX
  // =========================================================================
  const portraitCluster = document.getElementById('portraitCluster') || document.getElementById('spatialHeroCard');
  const terrainRock = document.getElementById('terrainRock');

  if (portraitCluster) {
    let rotX = 0;
    let rotY = 0;
    let targetX = 0;
    let targetY = 0;

    window.addEventListener('mousemove', (e) => {
      const rect = portraitCluster.getBoundingClientRect();
      const clusterCenterX = rect.left + rect.width / 2;
      const clusterCenterY = rect.top + rect.height / 2;

      const deltaX = e.clientX - clusterCenterX;
      const deltaY = e.clientY - clusterCenterY;
      const dist = Math.hypot(deltaX, deltaY);

      if (dist < 900) {
        targetY = (deltaX / 450) * 7;   // ±7 deg Y tilt
        targetX = (-deltaY / 450) * 7;  // ±7 deg X tilt
      } else {
        targetX = 0;
        targetY = 0;
      }

      if (terrainRock) {
        const rockRect = terrainRock.getBoundingClientRect();
        const rDeltaX = (e.clientX - (rockRect.left + rockRect.width / 2)) / 600;
        const rDeltaY = (e.clientY - (rockRect.top + rockRect.height / 2)) / 600;
        terrainRock.style.transform = `perspective(600px) rotateX(${10 - rDeltaY * 4}deg) rotateY(${12 + rDeltaX * 4}deg) rotateZ(2deg)`;
      }
    });

    const animatePortraitTilt = () => {
      rotX += (targetX - rotX) * 0.08;
      rotY += (targetY - rotY) * 0.08;

      portraitCluster.style.transform = `
        rotateX(${rotX}deg)
        rotateY(${rotY}deg)
        translateZ(15px)
      `;

      requestAnimationFrame(animatePortraitTilt);
    };
    animatePortraitTilt();
  }


  // =========================================================================
  // 4. INTERACTIVE 3D COSMIC PARTICLES CANVAS (STARDUST & NEBULA SPECKS)
  // =========================================================================
  const canvas = document.getElementById('cinematic-particles-canvas') || document.getElementById('spatial-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    });

    const numParticles = Math.min(75, Math.floor((w * h) / 16000));
    const particles = [];

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        radius: Math.random() * 2 + 0.8,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        alpha: Math.random() * 0.7 + 0.3,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        color: Math.random() > 0.4 ? '192, 132, 252' : '56, 189, 248'
      });
    }

    const drawParticles = () => {
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        p.alpha += Math.sin(Date.now() * p.pulseSpeed) * 0.015;
        const currentAlpha = Math.max(0.2, Math.min(0.95, p.alpha));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${currentAlpha})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(${p.color}, 0.8)`;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Subtle stardust connecting strands
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 110) {
            const strandAlpha = (1 - dist / 110) * 0.18;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(168, 85, 247, ${strandAlpha})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(drawParticles);
    };
    drawParticles();
  }


  // =========================================================================
  // 5. INTERACTIVE DESK & LOUNGE HOTSPOTS
  // =========================================================================
  
  // Globe Lamp: Toggles Warm Room Lighting Overlay
  const lampToggleBtn = document.getElementById('deskGlobeLamp') || document.getElementById('lampToggleBtn');
  const warmLampGlow = document.getElementById('warmRoomGlow') || document.getElementById('warmLampGlow');
  let lampWarmOn = false;

  if (lampToggleBtn && warmLampGlow) {
    lampToggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      initAudio();
      lampWarmOn = !lampWarmOn;
      warmLampGlow.classList.toggle('active', lampWarmOn);
      playTone(lampWarmOn ? 880 : 440, 'sine', 0.12, 0.22);
    });
  }

  // iMac Monitor: Smooth Scroll to Projects
  const imacMonitorBtn = document.querySelector('.imac-monitor') || document.getElementById('imacMonitorBtn');
  if (imacMonitorBtn) {
    imacMonitorBtn.addEventListener('click', (e) => {
      initAudio();
      playTone(660, 'sine', 0.1, 0.22);
      const projSec = document.getElementById('projects');
      if (projSec) {
        e.preventDefault();
        projSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Laptop: Smooth Scroll to Terminal Console
  const laptopCodeBtn = document.querySelector('.code-laptop') || document.getElementById('laptopCodeBtn');
  if (laptopCodeBtn) {
    laptopCodeBtn.addEventListener('click', (e) => {
      initAudio();
      playTone(740, 'sine', 0.1, 0.22);
      const termSec = document.getElementById('terminal-section');
      if (termSec) {
        e.preventDefault();
        termSec.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          const inp = document.getElementById('cliInput');
          if (inp) inp.focus();
        }, 600);
      }
    });
  }

  // Coffee Table Crystal Orb: Ambient Cyber Harmonic Chime
  const crystalOrbBtn = document.getElementById('crystalOrbHotspot') || document.getElementById('crystalOrbBtn');
  if (crystalOrbBtn) {
    crystalOrbBtn.addEventListener('click', (e) => {
      e.preventDefault();
      initAudio();
      // Cyber harmonic chord
      playTone(523.25, 'sine', 0.35, 0.22); // C5
      setTimeout(() => playTone(659.25, 'sine', 0.35, 0.22), 80);  // E5
      setTimeout(() => playTone(783.99, 'sine', 0.45, 0.25), 160); // G5
      setTimeout(() => playTone(1046.50, 'sine', 0.6, 0.26), 240); // C6
    });
  }

  // Astronaut Mascot on Floating Shelf: Zero-G Float
  const shelfAstronaut = document.getElementById('shelfAstronaut');
  if (shelfAstronaut) {
    shelfAstronaut.addEventListener('click', () => {
      initAudio();
      playTone(880, 'triangle', 0.15, 0.22);
      shelfAstronaut.style.transition = 'transform 0.4s ease';
      shelfAstronaut.style.transform = 'translateX(-50%) translateY(-14px) rotate(-10deg)';
      setTimeout(() => {
        shelfAstronaut.style.transform = 'translateX(-50%) translateY(0) rotate(0deg)';
      }, 500);
    });
  }

  // Right Wall Portrait Click: Smooth scroll to About
  const zonePortrait = document.getElementById('portraitFrameCard') || document.getElementById('zonePortrait');
  if (zonePortrait) {
    zonePortrait.addEventListener('click', (e) => {
      initAudio();
      playTone(600, 'sine', 0.1, 0.04);
      const aboutSec = document.getElementById('about');
      if (aboutSec) {
        e.preventDefault();
        aboutSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }


  // =========================================================================
  // 6. MODAL SYSTEM & PROJECT ARCHITECTURE INSPECTION
  // =========================================================================
  const projectModal = document.getElementById('projectModalBackdrop');
  const projectModalContent = document.getElementById('modalDynamicContent');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  const resumeModal = document.getElementById('resumeModalBackdrop');
  const resumeModalCloseBtn = document.getElementById('resumeModalCloseBtn');
  const printResumeBtn = document.getElementById('printResumeBtn');

  const projectDetailsData = {
    ewaste: {
      title: 'Socithon — E-Waste Management & Circular Economy Platform',
      badge: '🥇 1st Position Grand Winner • National Socithon 2026',
      lead: 'End-to-end circular economy digital platform integrating ElevenLabs conversational AI voice, dynamic pickup routing, and carbon-offset rewards to systematically solve urban electronic waste disposal.',
      pillars: [
        {
          title: 'ElevenLabs AI Multilingual Voice Guidance',
          desc: 'Integrated ElevenLabs conversational voice agents allowing citizens from any linguistic background to voice-describe broken electronics and receive immediate classification, hazard ratings, and disposal procedures.'
        },
        {
          title: 'Algorithmic Reverse Logistics',
          desc: 'Clustering algorithms group nearby disposal requests to optimize municipal pickup paths, routing items directly to verified government recyclers and authorized dismantlers.'
        },
        {
          title: 'Tokenized Green Credits & Incentivization',
          desc: 'Gamified reward ledger calculating verified kilograms recycled into redeemable carbon credits, discounts on sustainable electronics, and certificates.'
        }
      ],
      metrics: [
        { num: '#1 Winner', lbl: 'National Hackathon' },
        { num: 'ElevenLabs', lbl: 'AI Voice Partner' },
        { num: '100% Zero-Loss', lbl: 'Traceability Flow' }
      ],
      stack: ['Node.js', 'Express.js', 'ElevenLabs API', 'Web Audio API', 'Reverse Logistics', 'REST APIs', 'Sustainability']
    },
    campuspoint: {
      title: 'Campus Point — Higher Education & JEE Intelligence',
      badge: 'Founder & CTO • Production Scale Platform',
      lead: 'All-in-one scalable portal empowering thousands of engineering aspirants with algorithmic rank prediction, JoSAA/CSAB counselling simulators, and real-time alerts.',
      pillars: [
        {
          title: 'Algorithmic Rank & Cutoff Engine',
          desc: 'Dynamic indexing of 5+ years of JoSAA, CSAB, and state counselling closing ranks across 100+ IITs, NITs, and IIITs.'
        },
        {
          title: 'Counselling Decision Simulator',
          desc: 'Calculates personalized choice-filling strategies based on aspirant rank, home-state quota, category, and preferred branches.'
        },
        {
          title: 'Automated Admission Alerts',
          desc: 'Web push notifications and SMS gateways providing real-time alerts on registration windows and document verification deadlines.'
        }
      ],
      metrics: [
        { num: '100+ Colleges', lbl: 'Cataloged' },
        { num: 'Real-Time', lbl: 'Alert Pipeline' },
        { num: 'Scalable', lbl: 'Node.js Backend' }
      ],
      stack: ['Node.js', 'MongoDB', 'Express.js', 'React.js', 'REST APIs', 'Algorithms']
    },
    cognizance: {
      title: 'Cognizance Official Festival Web Platform',
      badge: '50,000+ Concurrent Visitors • Zero Downtime',
      lead: 'Mission-critical web infrastructure built for Asia’s 2nd largest technical festival at IIT Roorkee, handling heavy surges of registrations, workshop enrollments, and payment routing.',
      pillars: [
        {
          title: 'High Concurrency Architecture',
          desc: 'Distributed Node.js microservices with Redis caching layers ensuring instantaneous page loads and zero server crashes during peak registration rush.'
        },
        {
          title: 'Secure Payment & Registration Pipelines',
          desc: 'Bulletproof payment webhook verification, automated participant ticket generation, and team registration management for 5,000+ participants.'
        },
        {
          title: 'Live Event Roster & Scoreboards',
          desc: 'Low-latency updates for hackathons, guest lectures, robotics competitions, and esports matches.'
        }
      ],
      metrics: [
        { num: '50,000+', lbl: 'Users Handled' },
        { num: '5,000+', lbl: 'Participants Managed' },
        { num: '0.00%', lbl: 'Downtime Recorded' }
      ],
      stack: ['Web Architecture', 'High Concurrency', 'Node.js', 'Payment Routing', 'Caching', 'Scalability']
    },
    thinkindia: {
      title: 'Think India Club Official Web Platform',
      badge: 'Web Development Manager • Concept to Deployment',
      lead: 'Dynamic digital front door for Think India IIT Roorkee, providing live campus event schedules, executive directories, and high-conversion registration pipelines.',
      pillars: [
        {
          title: 'Dynamic Content Management',
          desc: 'Custom headless publishing flow allowing non-technical club executives to push live event updates, press notes, and photo galleries without redeployment.'
        },
        {
          title: 'Smooth Registration Pipeline',
          desc: 'Single-click event signups integrated with IIT Roorkee student verification, lifting participant turnouts across campus symposiums.'
        },
        {
          title: 'Executive & Alumni Directory',
          desc: 'Interactive visual directory of current leadership councils and alumni mentors across national sectors.'
        }
      ],
      metrics: [
        { num: '100%', lbl: 'Custom CMS' },
        { num: 'Zero-Lag', lbl: 'Responsive UI' },
        { num: 'Citation', lbl: 'Awarded Leadership' }
      ],
      stack: ['Node.js', 'Express', 'Responsive UI', 'CMS Architecture', 'REST APIs']
    },
    '24kmedia': {
      title: '24KMedia — Creator Intelligence & Performance Engine',
      badge: 'CTO & Web/AI Analytics Infrastructure',
      lead: 'Technical infrastructure and AI-driven performance analytics engine for 24KMedia, optimizing campaign workflows, ROI forecasting, and analytics for creators.',
      pillars: [
        {
          title: 'Multi-Platform Data Ingestion',
          desc: 'Automated data connectors polling social metrics, engagement velocity, and retention trends across multiple digital channels.'
        },
        {
          title: 'AI Campaign ROI Forecasting',
          desc: 'Predictive modules correlating audience demographics with brand niches to maximize advertiser return-on-ad-spend.'
        },
        {
          title: 'Real-Time Creator Dashboards',
          desc: 'Clean, customizable data visualizers providing talent managers and creators with live insights.'
        }
      ],
      metrics: [
        { num: 'Real-Time', lbl: 'Data Ingestion' },
        { num: 'AI Insights', lbl: 'Predictive Models' },
        { num: 'Enterprise', lbl: 'Grade Dashboards' }
      ],
      stack: ['AI Analytics', 'Data Pipelines', 'Node.js', 'REST APIs', 'Predictive Modeling']
    },
    appetizer: {
      title: 'Appetizer App — Campus Food Discovery Platform',
      badge: 'Chief Developer • Deployed at IIT Roorkee',
      lead: 'Official food discovery and canteen management platform architected for IIT Roorkee students and staff with real-time menu updates, vendor sync, and authentication.',
      pillars: [
        {
          title: 'Live Menu & Inventory Sync',
          desc: 'Instant sync of daily canteen menus, out-of-stock indicators, and meal-hour schedules across multiple campus eateries.'
        },
        {
          title: 'Campus Authentication',
          desc: 'Lightweight login flow verified against campus student credentials for seamless order placement.'
        },
        {
          title: 'Mobile-First Performance',
          desc: 'Ultra-lightweight frontend assets designed for lightning-fast loads even on congested campus Wi-Fi networks.'
        }
      ],
      metrics: [
        { num: 'Campus Deployed', lbl: 'IIT Roorkee' },
        { num: '<1.2s', lbl: 'Page Load' },
        { num: '100%', lbl: 'Mobile Optimized' }
      ],
      stack: ['Mobile-First', 'Node.js', 'Auth Pipelines', 'Campus Tech', 'REST APIs']
    }
  };

  const openProjectModal = (key) => {
    const data = projectDetailsData[key];
    if (!data || !projectModal || !projectModalContent) return;
    initAudio();
    playTone(660, 'sine', 0.1, 0.05);

    projectModalContent.innerHTML = `
      <div style="margin-bottom: 16px;">
        <span style="display:inline-block; font-size:10.5px; font-weight:700; color:var(--accent-gold); background:rgba(245,158,11,0.12); border:1px solid rgba(245,158,11,0.3); padding:4px 12px; border-radius:9999px; margin-bottom:10px;">
          ${data.badge}
        </span>
        <h2 style="font-family:var(--font-display); font-size:20px; font-weight:700; color:#fff; line-height:1.3; margin-bottom:10px;">
          ${data.title}
        </h2>
        <p style="font-size:12.5px; color:#cbd5e1; line-height:1.6;">
          ${data.lead}
        </p>
      </div>

      <!-- Quick Metrics -->
      <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:10px; margin: 18px 0;">
        ${data.metrics.map(m => `
          <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); padding:10px; border-radius:10px; text-align:center;">
            <div style="font-family:var(--font-display); font-size:15px; font-weight:700; color:var(--accent-cyan-light);">${m.num}</div>
            <div style="font-size:9.5px; color:var(--text-dim); margin-top:2px;">${m.lbl}</div>
          </div>
        `).join('')}
      </div>

      <!-- Architecture Highlights -->
      <div style="margin: 18px 0;">
        <h4 style="font-family:var(--font-mono); font-size:11px; letter-spacing:0.06em; color:var(--accent-purple-light); text-transform:uppercase; margin-bottom:10px;">
          Core System Highlights
        </h4>
        <div style="display:flex; flex-direction:column; gap:10px;">
          ${data.pillars.map(p => `
            <div style="background:rgba(255,255,255,0.025); border-left:3px solid var(--accent-purple); padding:10px 14px; border-radius:0 8px 8px 0;">
              <div style="font-size:12px; font-weight:700; color:#fff; margin-bottom:4px;">${p.title}</div>
              <div style="font-size:11px; color:#94a3b8; line-height:1.5;">${p.desc}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Tech Stack -->
      <div style="margin-top: 18px;">
        <h4 style="font-family:var(--font-mono); font-size:11px; letter-spacing:0.06em; color:var(--accent-cyan); text-transform:uppercase; margin-bottom:8px;">
          Engineered With
        </h4>
        <div style="display:flex; flex-wrap:wrap; gap:6px;">
          ${data.stack.map(s => `
            <span style="background:rgba(168,85,247,0.12); border:1px solid rgba(168,85,247,0.28); color:var(--accent-purple-light); font-family:var(--font-mono); font-size:10px; padding:3px 9px; border-radius:6px;">
              ${s}
            </span>
          `).join('')}
        </div>
      </div>
    `;

    projectModal.classList.add('open');
  };

  // Attach click listener to project inspect buttons
  document.querySelectorAll('.pc-inspect-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const key = btn.getAttribute('data-detail');
      openProjectModal(key);
    });
  });

  if (modalCloseBtn && projectModal) {
    modalCloseBtn.addEventListener('click', () => {
      projectModal.classList.remove('open');
      playTone(460, 'sine', 0.08, 0.04);
    });
  }

  // =========================================================================
  // 7. RESUME MODAL & PRINTING
  // =========================================================================
  const openResume = () => {
    initAudio();
    playTone(720, 'sine', 0.1, 0.05);
    if (resumeModal) resumeModal.classList.add('open');
  };

  const closeResume = () => {
    if (resumeModal) {
      resumeModal.classList.remove('open');
      playTone(460, 'sine', 0.08, 0.04);
    }
  };

  const quickResumeBtn = document.getElementById('openResumeBtn');
  if (quickResumeBtn) quickResumeBtn.addEventListener('click', openResume);

  const heroResumeBtn = document.getElementById('btnHeroResume');
  if (heroResumeBtn) heroResumeBtn.addEventListener('click', openResume);

  if (resumeModalCloseBtn) resumeModalCloseBtn.addEventListener('click', closeResume);

  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Close modals on outside click or escape
  window.addEventListener('click', (e) => {
    if (e.target === projectModal) projectModal.classList.remove('open');
    if (e.target === resumeModal) resumeModal.classList.remove('open');
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (projectModal) projectModal.classList.remove('open');
      if (resumeModal) resumeModal.classList.remove('open');
    }
  });


  // =========================================================================
  // 8. PROJECT CATEGORY FILTER TABS
  // =========================================================================
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectCards = document.querySelectorAll('.project-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      initAudio();
      playTone(600, 'sine', 0.08, 0.20);

      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterVal = tab.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cat = card.getAttribute('data-category') || '';
        if (filterVal === 'all' || cat.includes(filterVal)) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });


  // =========================================================================
  // 9. FLOATING GLASS TOP NAVIGATION & DYNAMIC SCROLLSPY
  // =========================================================================
  const navLinks = document.querySelectorAll('.dock-link, .sidebar-link');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const targetSec = document.querySelector(href);
        if (targetSec) {
          e.preventDefault();
          initAudio();
          playTone(640, 'sine', 0.08, 0.20);
          navLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
          targetSec.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // Dynamic Scrollspy with IntersectionObserver
  const spySections = document.querySelectorAll('section[id]');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${id}`) {
              navLinks.forEach(l => l.classList.remove('active'));
              link.classList.add('active');
            }
          });
        }
      });
    }, { threshold: 0.35 });

    spySections.forEach(s => observer.observe(s));
  }

  // Hero CTAs smooth scroll
  const btnExploreWork = document.getElementById('btnExploreWork');
  if (btnExploreWork) {
    btnExploreWork.addEventListener('click', (e) => {
      e.preventDefault();
      initAudio();
      playTone(660, 'sine', 0.08, 0.20);
      const target = document.getElementById('projects');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  }

  const btnAboutMe = document.getElementById('btnAboutMe');
  if (btnAboutMe) {
    btnAboutMe.addEventListener('click', (e) => {
      e.preventDefault();
      initAudio();
      playTone(600, 'sine', 0.08, 0.20);
      const target = document.getElementById('about');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  }

  const dockContactBtn = document.getElementById('dockContactBtn');
  if (dockContactBtn) {
    dockContactBtn.addEventListener('click', (e) => {
      e.preventDefault();
      initAudio();
      playTone(720, 'sine', 0.1, 0.22);
      const target = document.getElementById('contact');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Theme Switch (Sun / Moon)
  const themeSwitch = document.getElementById('themeSwitch');
  let currentThemeDark = true;

  if (themeSwitch) {
    themeSwitch.addEventListener('click', () => {
      initAudio();
      currentThemeDark = !currentThemeDark;
      document.body.classList.toggle('theme-midnight', !currentThemeDark);
      playTone(currentThemeDark ? 740 : 540, 'sine', 0.1, 0.22);
    });
  }


  // =========================================================================
  // 10. DEVELOPER TERMINAL CLI (INTERACTIVE CONSOLE WITH LIVE CODE TYPING & TELEPORT)
  // =========================================================================
  const termOutput = document.getElementById('terminalBody') || document.getElementById('termOutput');
  const termInput = document.getElementById('terminalInput') || document.getElementById('termInput');
  const termRunBtn = document.getElementById('termSubmitBtn') || document.getElementById('termRunBtn');

  const addTermLine = (htmlText) => {
    if (!termOutput) return;
    const row = document.createElement('div');
    row.className = 'tc-row';
    row.innerHTML = htmlText;
    termOutput.appendChild(row);
    termOutput.scrollTop = termOutput.scrollHeight;
  };

  const teleportToElement = (elementId, highlightType = 'normal') => {
    const el = document.getElementById(elementId) || document.querySelector(elementId);
    if (!el) return;

    playWarpTeleport();

    const yOffset = -90;
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });

    const highlightClass = highlightType === 'gold' ? 'terminal-nav-highlight-gold' : 'terminal-nav-highlight';
    el.classList.remove('terminal-nav-highlight', 'terminal-nav-highlight-gold');
    void el.offsetWidth; // Force CSS reflow to re-trigger keyframe
    el.classList.add(highlightClass);

    setTimeout(() => {
      el.classList.remove(highlightClass);
    }, 4000);
  };

  let isTermExecuting = false;

  const typeTermLines = async (lines, options = {}) => {
    isTermExecuting = true;
    for (const line of lines) {
      addTermLine(line);
      playKeyClick(Math.random() > 0.5 ? 1160 : 980);
      await new Promise(r => setTimeout(r, 65));
    }
    isTermExecuting = false;

    if (options.targetId) {
      setTimeout(() => {
        teleportToElement(options.targetId, options.highlightType || 'normal');
        if (options.callback) options.callback();
      }, 180);
    }
  };

  const executeTermCommand = async (cmdRaw) => {
    const cmd = cmdRaw.trim().toLowerCase();
    if (!cmd) return;
    if (isTermExecuting) return;

    addTermLine(`<span class="tc-prompt">ankit@iitr:~$</span> <span style="color:#fff; font-weight:600;">${cmdRaw}</span>`);
    playKeyClick(1200);

    switch (cmd) {
      case 'help':
        await typeTermLines([
          `<div class="tc-code-line"><span class="tc-code-kw">Interactive Terminal Commands</span> (type or click quick chips below):</div>`,
          `<div class="tc-code-line">&bull; <span class="text-cyan font-bold">projects</span> &mdash; Compile and inspect all 6 engineered systems</div>`,
          `<div class="tc-code-line">&bull; <span class="text-cyan font-bold">campuspoint</span> &mdash; Founder &amp; CTO higher-ed admission platform</div>`,
          `<div class="tc-code-line">&bull; <span class="text-gold font-bold">socithon</span> &mdash; 🥇 1st Position Grand Winner (IITR NSS &times; ElevenLabs)</div>`,
          `<div class="tc-code-line">&bull; <span class="text-gold font-bold">jee</span> &mdash; AIR 4846 &bull; IIT Roorkee Electrical Engineering credential</div>`,
          `<div class="tc-code-line">&bull; <span class="text-cyan font-bold">skills</span> &mdash; Technical stack &amp; competencies (Node.js, React, C++)</div>`,
          `<div class="tc-code-line">&bull; <span class="text-cyan font-bold">cognizance</span> &mdash; 50,000+ users zero-downtime festival operations</div>`,
          `<div class="tc-code-line">&bull; <span class="text-cyan font-bold">thinkindia</span> &mdash; Web dev manager dynamic CMS &amp; portals</div>`,
          `<div class="tc-code-line">&bull; <span class="text-cyan font-bold">24kmedia</span> &mdash; CTO &amp; AI creator intelligence dashboard</div>`,
          `<div class="tc-code-line">&bull; <span class="text-cyan font-bold">appetizer</span> &mdash; IIT Roorkee campus food ordering app</div>`,
          `<div class="tc-code-line">&bull; <span class="text-cyan font-bold">about</span> &mdash; Bio, vision &amp; electrical engineering background</div>`,
          `<div class="tc-code-line">&bull; <span class="text-cyan font-bold">experience</span> &mdash; Leadership timeline &amp; hostel welfare roles</div>`,
          `<div class="tc-code-line">&bull; <span class="text-cyan font-bold">contact</span> &mdash; Direct email, phone coordinates &amp; inquiry desk</div>`,
          `<div class="tc-code-line">&bull; <span class="text-cyan font-bold">home</span> &mdash; Return to cinematic 3D hero stage</div>`,
          `<div class="tc-code-line">&bull; <span class="text-cyan font-bold">clear</span> &mdash; Clear terminal buffer</div>`
        ]);
        break;

      case 'projects':
      case 'project':
        await typeTermLines([
          `<div class="tc-code-line"><span class="tc-code-kw">import</span> { <span class="tc-code-fn">ProjectRegistry</span> } <span class="tc-code-kw">from</span> <span class="tc-code-str">'@iitr/portfolio'</span>;</div>`,
          `<div class="tc-code-line"><span class="tc-code-kw">const</span> <span class="tc-code-var">systems</span> = <span class="tc-code-kw">await</span> ProjectRegistry.<span class="tc-code-fn">loadProduction</span>();</div>`,
          `<div class="tc-code-line"><span class="tc-code-comment">// Active: Campus Point (CTO), Socithon (1st), Cognizance (50k), Think India, 24K, Appetizer</span></div>`,
          `<div class="tc-code-line"><span class="tc-log-success">[STATUS 200 OK]</span> 6 engineered platforms mounted in memory.</div>`,
          `<div class="tc-code-line"><span class="tc-log-info">[WARP TELEPORT]</span> Routing viewport to Featured Projects showcase...</div>`
        ], { targetId: 'projects', highlightType: 'normal' });
        break;

      case 'campuspoint':
      case 'campus point':
      case 'campus':
      case 'cp':
        await typeTermLines([
          `<div class="tc-code-line"><span class="tc-code-kw">import</span> { <span class="tc-code-fn">CampusPointEngine</span> } <span class="tc-code-kw">from</span> <span class="tc-code-str">'@campuspoint/core'</span>;</div>`,
          `<div class="tc-code-line"><span class="tc-code-kw">const</span> <span class="tc-code-var">platform</span> = <span class="tc-code-kw">new</span> <span class="tc-code-fn">CampusPointEngine</span>({ founder: <span class="tc-code-str">'Ankit Kumar'</span>, role: <span class="tc-code-str">'Founder &amp; CTO'</span> });</div>`,
          `<div class="tc-code-line"><span class="tc-code-kw">await</span> platform.<span class="tc-code-fn">mountJEEPredictor</span>({ cutoffs: <span class="tc-code-str">'JoSAA/CSAB-v2'</span>, scale: <span class="tc-code-num">50000</span> });</div>`,
          `<div class="tc-code-line"><span class="tc-log-success">[STATUS 200 OK]</span> Higher-Ed admission algorithms deployed.</div>`,
          `<div class="tc-code-line"><span class="tc-log-info">[WARP TELEPORT]</span> Viewport jumping to Campus Point showcase card...</div>`
        ], { targetId: 'project-campuspoint', highlightType: 'normal' });
        break;

      case 'socithon':
      case 'ewaste':
      case 'e-waste':
      case 'winner':
      case 'award':
      case 'achieve':
        await typeTermLines([
          `<div class="tc-code-line"><span class="tc-code-kw">import</span> { <span class="tc-code-fn">SocithonGrandWinner</span> } <span class="tc-code-kw">from</span> <span class="tc-code-str">'@iitr-nss/awards'</span>;</div>`,
          `<div class="tc-code-line"><span class="tc-code-comment">// Host: IIT Roorkee NSS &times; ElevenLabs &times; OSEN &times; Craftora</span></div>`,
          `<div class="tc-code-line"><span class="tc-code-kw">const</span> <span class="tc-code-var">ecoLoop</span> = <span class="tc-code-kw">await</span> SocithonGrandWinner.<span class="tc-code-fn">getSubmission</span>();</div>`,
          `<div class="tc-code-line"><span class="tc-log-gold">[🥇 1ST POSITION]</span> Circular Economy AI Voice Reverse Logistics verified!</div>`,
          `<div class="tc-code-line"><span class="tc-log-info">[WARP TELEPORT]</span> Viewport routing to Socithon Grand Spotlight...</div>`
        ], { targetId: 'spotlight-socithon', highlightType: 'gold' });
        break;

      case 'jee':
      case 'rank':
      case 'air':
      case 'jee advanced':
      case 'jeeadvanced':
        await typeTermLines([
          `<div class="tc-code-line"><span class="tc-code-comment">// National Engineering Entrance Examination Verification</span></div>`,
          `<div class="tc-code-line"><span class="tc-code-kw">const</span> <span class="tc-code-var">candidate</span> = { exam: <span class="tc-code-str">'JEE Advanced 2024'</span>, rank: <span class="tc-code-num">4846</span>, institute: <span class="tc-code-str">'IIT Roorkee'</span>, dept: <span class="tc-code-str">'Electrical Engineering'</span> };</div>`,
          `<div class="tc-code-line"><span class="tc-log-gold">[VERIFIED]</span> All India Rank 4846 &bull; Top 0.1% National Percentile.</div>`,
          `<div class="tc-code-line"><span class="tc-log-info">[WARP TELEPORT]</span> Jumping to JEE Advanced credential...</div>`
        ], { targetId: 'card-jee', highlightType: 'gold' });
        break;

      case 'skills':
      case 'skill':
      case 'stack':
      case 'tech':
        await typeTermLines([
          `<div class="tc-code-line"><span class="tc-code-kw">const</span> <span class="tc-code-var">arsenal</span> = {</div>`,
          `<div class="tc-code-line">&nbsp;&nbsp;backend: [<span class="tc-code-str">'Node.js'</span>, <span class="tc-code-str">'Express.js'</span>, <span class="tc-code-str">'REST APIs'</span>, <span class="tc-code-str">'Auth'</span>],</div>`,
          `<div class="tc-code-line">&nbsp;&nbsp;frontend: [<span class="tc-code-str">'React.js'</span>, <span class="tc-code-str">'WebGL/Canvas'</span>, <span class="tc-code-str">'HTML5'</span>, <span class="tc-code-str">'CSS3'</span>, <span class="tc-code-str">'EJS'</span>],</div>`,
          `<div class="tc-code-line">&nbsp;&nbsp;languages: [<span class="tc-code-str">'JavaScript (ES6+)'</span>, <span class="tc-code-str">'C++ (OOP/DSA)'</span>, <span class="tc-code-str">'Python'</span>]</div>`,
          `<div class="tc-code-line">};</div>`,
          `<div class="tc-code-line"><span class="tc-log-success">[STATUS 200 OK]</span> Technical competencies compiled.</div>`,
          `<div class="tc-code-line"><span class="tc-log-info">[WARP TELEPORT]</span> Scrolling to Skills Matrix...</div>`
        ], { targetId: 'skills', highlightType: 'normal' });
        break;

      case 'about':
      case 'whoami':
      case 'bio':
        await typeTermLines([
          `<div class="tc-code-line"><span class="tc-code-kw">class</span> <span class="tc-code-fn">AnkitKumar</span> <span class="tc-code-kw">extends</span> <span class="tc-code-var">IITREngineer</span> {</div>`,
          `<div class="tc-code-line">&nbsp;&nbsp;campus = <span class="tc-code-str">'IIT Roorkee (Electrical Engineering 2nd Year)'</span>;</div>`,
          `<div class="tc-code-line">&nbsp;&nbsp;leadership = [<span class="tc-code-str">'Campus Point CTO'</span>, <span class="tc-code-str">'Hostel Wellness Secretary (484 residents)'</span>];</div>`,
          `<div class="tc-code-line">}</div>`,
          `<div class="tc-code-line"><span class="tc-log-success">[LOADED]</span> Ankit Kumar profile metadata ready.</div>`,
          `<div class="tc-code-line"><span class="tc-log-info">[WARP TELEPORT]</span> Viewport jumping to About Section...</div>`
        ], { targetId: 'about', highlightType: 'normal' });
        break;

      case 'experience':
      case 'roles':
      case 'timeline':
      case 'leadership':
        await typeTermLines([
          `<div class="tc-code-line"><span class="tc-code-kw">const</span> <span class="tc-code-var">timeline</span> = <span class="tc-code-kw">await</span> LeadershipRegistry.<span class="tc-code-fn">getTimeline</span>();</div>`,
          `<div class="tc-code-line"><span class="tc-code-comment">// Founder &amp; CTO @ Campus Point &bull; Mgr @ Think India &bull; Exec @ Cognizance (50k)</span></div>`,
          `<div class="tc-code-line"><span class="tc-log-success">[STATUS 200 OK]</span> 5 leadership roles fetched.</div>`,
          `<div class="tc-code-line"><span class="tc-log-info">[WARP TELEPORT]</span> Viewport navigating to Experience Timeline...</div>`
        ], { targetId: 'experience', highlightType: 'normal' });
        break;

      case 'contact':
      case 'hire':
      case 'email':
      case 'talk':
        await typeTermLines([
          `<div class="tc-code-line"><span class="tc-code-kw">const</span> <span class="tc-code-var">channel</span> = <span class="tc-code-kw">new</span> <span class="tc-code-fn">DirectCommsGateway</span>({</div>`,
          `<div class="tc-code-line">&nbsp;&nbsp;email: <span class="tc-code-str">'ankityadav08022008@gmail.com'</span>, phone: <span class="tc-code-str">'+91 8118826194'</span></div>`,
          `<div class="tc-code-line">});</div>`,
          `<div class="tc-code-line"><span class="tc-log-success">[OPEN]</span> Open to internships, freelance &amp; full-stack engineering collaborations.</div>`,
          `<div class="tc-code-line"><span class="tc-log-info">[WARP TELEPORT]</span> Routing to Direct Contact Desk...</div>`
        ], {
          targetId: 'contact',
          highlightType: 'normal',
          callback: () => {
            const inputEl = document.getElementById('formName');
            if (inputEl) inputEl.focus();
          }
        });
        break;

      case 'cognizance':
      case 'cog':
        await typeTermLines([
          `<div class="tc-code-line"><span class="tc-code-kw">const</span> <span class="tc-code-var">ops</span> = <span class="tc-code-kw">new</span> <span class="tc-code-fn">HighConcurrencyEngine</span>({ event: <span class="tc-code-str">'Cognizance 2026'</span>, users: <span class="tc-code-num">50000</span>, downtime: <span class="tc-code-num">0</span> });</div>`,
          `<div class="tc-code-line"><span class="tc-log-success">[VERIFIED]</span> High-concurrency operations serving 50,000+ users.</div>`,
          `<div class="tc-code-line"><span class="tc-log-info">[WARP TELEPORT]</span> Viewport jumping to Cognizance festival platform...</div>`
        ], { targetId: 'project-cognizance', highlightType: 'normal' });
        break;

      case 'thinkindia':
      case 'think india':
      case 'ti':
        await typeTermLines([
          `<div class="tc-code-line"><span class="tc-code-kw">const</span> <span class="tc-code-var">portal</span> = <span class="tc-code-kw">new</span> <span class="tc-code-fn">ThinkIndiaPortal</span>({ role: <span class="tc-code-str">'Web Dev Manager'</span>, cms: <span class="tc-code-str">'Dynamic RSVPs'</span> });</div>`,
          `<div class="tc-code-line"><span class="tc-log-success">[DEPLOYED]</span> Think India official web ecosystem active.</div>`,
          `<div class="tc-code-line"><span class="tc-log-info">[WARP TELEPORT]</span> Jumping to Think India platform card...</div>`
        ], { targetId: 'project-thinkindia', highlightType: 'normal' });
        break;

      case '24kmedia':
      case '24k':
        await typeTermLines([
          `<div class="tc-code-line"><span class="tc-code-kw">const</span> <span class="tc-code-var">analytics</span> = <span class="tc-code-kw">new</span> <span class="tc-code-fn">CreatorAIEngine</span>({ client: <span class="tc-code-str">'24KMedia'</span>, role: <span class="tc-code-str">'CTO &amp; Web Architect'</span> });</div>`,
          `<div class="tc-code-line"><span class="tc-log-success">[OK]</span> Performance dashboards &amp; ROI forecast pipelines verified.</div>`,
          `<div class="tc-code-line"><span class="tc-log-info">[WARP TELEPORT]</span> Jumping to 24KMedia showcase card...</div>`
        ], { targetId: 'project-24kmedia', highlightType: 'normal' });
        break;

      case 'appetizer':
      case 'food':
        await typeTermLines([
          `<div class="tc-code-line"><span class="tc-code-kw">const</span> <span class="tc-code-var">app</span> = <span class="tc-code-kw">new</span> <span class="tc-code-fn">CampusFoodSystem</span>({ campus: <span class="tc-code-str">'IIT Roorkee'</span>, role: <span class="tc-code-str">'Chief Developer'</span> });</div>`,
          `<div class="tc-code-line"><span class="tc-log-success">[OK]</span> Real-time menu &amp; authentication active.</div>`,
          `<div class="tc-code-line"><span class="tc-log-info">[WARP TELEPORT]</span> Jumping to Appetizer showcase card...</div>`
        ], { targetId: 'project-appetizer', highlightType: 'normal' });
        break;

      case 'home':
      case 'top':
        await typeTermLines([
          `<div class="tc-code-line"><span class="tc-log-info">[WARP TELEPORT]</span> Returning to Cinematic 3D Hero stage...</div>`
        ], { targetId: 'hero', highlightType: 'normal' });
        break;

      case 'clear':
      case 'cls':
        termOutput.innerHTML = '';
        playKeyClick(800);
        break;

      default:
        addTermLine(`<span class="tc-log-error">command not found: ${cmdRaw}</span>. Type <span class="text-cyan font-bold" style="cursor:pointer;" onclick="document.getElementById('terminalInput').value='help'; document.getElementById('termSubmitBtn').click();">help</span> to list commands.`);
        playTone(380, 'sawtooth', 0.1, 0.20);
    }
  };

  if (termInput) {
    // Mechanical click feedback on typing in terminal input
    termInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = termInput.value;
        termInput.value = '';
        executeTermCommand(val);
      } else if (e.key !== 'Shift' && e.key !== 'Control' && e.key !== 'Alt') {
        playKeyClick();
      }
    });
  }

  if (termRunBtn && termInput) {
    termRunBtn.addEventListener('click', () => {
      const val = termInput.value;
      termInput.value = '';
      executeTermCommand(val);
    });
  }

  // Quick navigation chips click handling
  document.querySelectorAll('.tc-chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
      e.preventDefault();
      const cmd = chip.getAttribute('data-cmd');
      if (termInput) termInput.value = cmd;
      playClickSound();
      executeTermCommand(cmd);
    });
  });


  // =========================================================================
  // 11. CONTACT FORM
  // =========================================================================
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');

  if (contactForm && formFeedback) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      playSuccessChime();

      const name = document.getElementById('formName').value;
      const email = document.getElementById('formEmail').value;
      const sub = document.getElementById('formSubject').value;
      const msg = document.getElementById('formMessage').value;

      formFeedback.innerHTML = `<span style="color:var(--accent-cyan); font-weight:600;">✓ Thank you, ${name}! Opening email client to send message...</span>`;

      const mailtoLink = `mailto:ankityadav08022008@gmail.com?subject=${encodeURIComponent(sub)}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${msg}`)}`;
      setTimeout(() => {
        window.location.href = mailtoLink;
      }, 700);
      contactForm.reset();
    });
  }

});
