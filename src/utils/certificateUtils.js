/**
 * High-Resolution Canvas Certificate Generator for Sankalpa Siddhi
 */
import { formatDisplayDate } from './dateUtils';

export function generateSiddhiCertificate({
  sankalpaName,
  icon = '🚩',
  cycleNumber = 1,
  totalCount,
  durationDays,
  startDate,
  completedDate,
  longestStreak = 0,
  reflectionNote = '',
}) {
  const canvas = document.createElement('canvas');
  const width = 1200;
  const height = 800;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 1. Deep Obsidian Gradient Background
  const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, 700);
  bgGrad.addColorStop(0, '#15151c');
  bgGrad.addColorStop(1, '#08080b');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Ornate Golden Borders
  // Outer margin border
  ctx.strokeStyle = '#78350f'; // Dark amber
  ctx.lineWidth = 3;
  ctx.strokeRect(30, 30, width - 60, height - 60);

  // Inner margin border
  ctx.strokeStyle = '#d97706'; // Vibrant gold
  ctx.lineWidth = 1.5;
  ctx.strokeRect(42, 42, width - 84, height - 84);

  // Corner Accents
  const cornerSize = 28;
  const corners = [
    [42, 42],
    [width - 42, 42],
    [42, height - 42],
    [width - 42, height - 42],
  ];

  ctx.fillStyle = '#f59e0b';
  corners.forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fill();

    // Corner brackets
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    const dirX = cx < width / 2 ? 1 : -1;
    const dirY = cy < height / 2 ? 1 : -1;
    ctx.moveTo(cx + dirX * cornerSize, cy);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx, cy + dirY * cornerSize);
    ctx.stroke();
  });

  // 3. Top Emblem / Sacred Icon
  ctx.font = '52px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(icon, width / 2, 115);

  // 4. Header Titles
  ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, serif';
  ctx.fillStyle = '#fbbf24';
  ctx.letterSpacing = '6px';
  ctx.fillText('S A N K A L P A   S I D D H I', width / 2, 155);

  ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = '#a1a1aa';
  ctx.letterSpacing = '3px';
  ctx.fillText('CERTIFICATE OF SACRED FULFILLMENT', width / 2, 178);
  ctx.letterSpacing = '0px';

  // Decorative divider
  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 140, 195);
  ctx.lineTo(width / 2 + 140, 195);
  ctx.stroke();

  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(width / 2, 195, 3.5, 0, Math.PI * 2);
  ctx.fill();

  // 5. Dedication Subtitle
  ctx.font = '15px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = '#d4d4d8';
  ctx.fillText('This document honors the focused discipline and successful completion of', width / 2, 235);

  // 6. Sankalpa Name
  ctx.font = 'bold 44px -apple-system, BlinkMacSystemFont, "Segoe UI", serif';
  const nameGrad = ctx.createLinearGradient(0, 260, 0, 310);
  nameGrad.addColorStop(0, '#ffffff');
  nameGrad.addColorStop(1, '#fde68a');
  ctx.fillStyle = nameGrad;
  ctx.fillText(sankalpaName, width / 2, 290);

  // Cycle Tag
  ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", monospace';
  ctx.fillStyle = '#fbbf24';
  ctx.fillText(`Cycle #${cycleNumber} • ${durationDays}-Day Tapasya`, width / 2, 322);

  // 7. Stat Cards / Badges (3 Pillars)
  const cardY = 360;
  const cardW = 280;
  const cardH = 100;
  const startX = (width - (cardW * 3 + 40)) / 2;

  const stats = [
    { label: 'TOTAL RECITATIONS', val: `${totalCount} Chants`, sub: 'Vow Fulfilled' },
    {
      label: 'TIMELINE',
      val: `${durationDays} Days`,
      sub: `${formatDisplayDate(startDate)} → ${formatDisplayDate(completedDate)}`,
    },
    { label: 'BEST DAILY STREAK', val: `🔥 ${longestStreak} Days`, sub: 'Unbroken Consistency' },
  ];

  stats.forEach((st, i) => {
    const x = startX + i * (cardW + 20);

    // Card background
    ctx.fillStyle = 'rgba(24, 24, 27, 0.85)';
    ctx.beginPath();
    ctx.roundRect(x, cardY, cardW, cardH, 12);
    ctx.fill();

    // Card border
    ctx.strokeStyle = '#3f3f46';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Stat Label
    ctx.font = 'bold 10px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillStyle = '#a1a1aa';
    ctx.letterSpacing = '1.5px';
    ctx.fillText(st.label, x + cardW / 2, cardY + 28);
    ctx.letterSpacing = '0px';

    // Stat Value
    ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, "Segoe UI", serif';
    ctx.fillStyle = '#fef08a';
    ctx.fillText(st.val, x + cardW / 2, cardY + 60);

    // Stat Subtitle
    ctx.font = '11px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillStyle = '#9ca3af';
    ctx.fillText(st.sub, x + cardW / 2, cardY + 82);
  });

  // 8. Personal Reflection Note (if present)
  let nextY = 505;
  if (reflectionNote) {
    ctx.fillStyle = 'rgba(39, 39, 42, 0.5)';
    ctx.beginPath();
    ctx.roundRect(width / 2 - 380, nextY, 760, 68, 10);
    ctx.fill();

    ctx.strokeStyle = '#52525b';
    ctx.stroke();

    ctx.font = 'italic 14px serif';
    ctx.fillStyle = '#fde68a';
    const noteText = reflectionNote.length > 90 ? reflectionNote.substring(0, 87) + '...' : reflectionNote;
    ctx.fillText(`“${noteText}”`, width / 2, nextY + 38);
    nextY += 92;
  } else {
    nextY += 25;
  }

  // 9. Sanskrit Blessing & Meaning
  ctx.font = 'bold 18px serif';
  ctx.fillStyle = '#f59e0b';
  ctx.fillText('॥ संकल्पं सिद्धिरस्तु • शुभं भवतु ॥', width / 2, nextY + 30);

  ctx.font = '13px serif';
  ctx.fillStyle = '#a1a1aa';
  ctx.fillText('“May this consecrated discipline bestow clarity, tranquility, and lasting spiritual strength.”', width / 2, nextY + 58);

  // 10. Golden Circular Seal (Bottom Right)
  const sealX = width - 130;
  const sealY = height - 120;
  const sealR = 48;

  ctx.save();
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(sealX, sealY, sealR, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(sealX, sealY, sealR - 6, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#f59e0b';
  ctx.font = 'bold 9px sans-serif';
  ctx.fillText('★ SANKALPA ★', sealX, sealY - 14);
  ctx.font = 'bold 14px serif';
  ctx.fillText('SIDDHA', sealX, sealY + 4);
  ctx.font = 'bold 8px sans-serif';
  ctx.fillStyle = '#fbbf24';
  ctx.fillText('SEALED & FULFILLED', sealX, sealY + 20);
  ctx.restore();

  // 11. Trigger Download
  const dataUrl = canvas.toDataURL('image/png');
  const anchor = document.createElement('a');
  const safeName = sankalpaName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  anchor.download = `sankalpa-siddhi-${safeName}-cycle${cycleNumber}.png`;
  anchor.href = dataUrl;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}
