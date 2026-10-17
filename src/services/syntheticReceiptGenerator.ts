/**
 * NexusClear Synthetic Evidence Image Generator
 * Generates photorealistic receipts and shop photos using Canvas 2D API.
 * All functions return pure base64 PNG strings (WITHOUT data:image/png;base64, prefix).
 */

function createCanvas(width: number, height: number): HTMLCanvasElement {
  if (typeof document !== 'undefined') {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }
  throw new Error('Canvas rendering requires a browser or DOM environment.');
}

function canvasToBase64(canvas: HTMLCanvasElement): string {
  const dataUrl = canvas.toDataURL('image/png');
  return dataUrl.replace(/^data:image\/png;base64,/, '');
}

/**
 * Adds subtle paper noise/grain texture to a canvas.
 */
function addPaperNoise(ctx: CanvasRenderingContext2D, width: number, height: number, density = 0.03, alpha = 0.08) {
  const count = width * height * density;
  ctx.save();
  for (let i = 0; i < count; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const shade = Math.floor(Math.random() * 80);
    ctx.fillStyle = `rgba(${shade}, ${shade}, ${shade}, ${Math.random() * alpha})`;
    ctx.fillRect(x, y, 1, 1);
  }
  ctx.restore();
}

/**
 * 1. Indian Medical Store Carbon-Copy Style Receipt
 * Ramesh Medicals, Udupi, Karnataka
 */
export function generateMedicalReceipt(data?: {
  billNo?: string;
  date?: string;
  time?: string;
  amount?: number;
}): string {
  const outerWidth = 430;
  const outerHeight = 630;
  const canvas = createCanvas(outerWidth, outerHeight);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2d context');

  // Outer transparent / desk surface background
  ctx.fillStyle = 'rgba(240, 238, 230, 0.4)';
  ctx.fillRect(0, 0, outerWidth, outerHeight);

  // Apply slight rotation for realistic photograph look
  ctx.save();
  ctx.translate(outerWidth / 2, outerHeight / 2);
  ctx.rotate((1.4 * Math.PI) / 180); // 1.4 degrees tilt
  ctx.translate(-195, -295);

  const billW = 390;
  const billH = 590;

  // Drop shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.16)';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetX = 4;
  ctx.shadowOffsetY = 6;

  // Aged carbon-copy paper (light yellowed tone)
  ctx.fillStyle = '#faf6e8';
  ctx.fillRect(0, 0, billW, billH);

  // Reset shadow for inner elements
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // Draw ruled carbon guidelines
  ctx.strokeStyle = 'rgba(210, 200, 175, 0.45)';
  ctx.lineWidth = 1;
  for (let y = 140; y < 490; y += 22) {
    ctx.beginPath();
    ctx.moveTo(15, y);
    ctx.lineTo(billW - 15, y);
    ctx.stroke();
  }

  // Paper noise
  addPaperNoise(ctx, billW, billH, 0.04, 0.06);

  // Perforated left margin holes (carbon duplicate pad)
  ctx.fillStyle = '#e5dfcb';
  for (let y = 30; y < billH; y += 45) {
    ctx.beginPath();
    ctx.arc(8, y, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Dark violet-blue carbon ink color
  const inkColor = '#1d234d';
  ctx.fillStyle = inkColor;

  // Header
  ctx.textAlign = 'center';
  ctx.font = 'bold 20px "Segoe UI", Arial, sans-serif';
  ctx.fillText('RAMESH MEDICALS', billW / 2, 40);

  ctx.font = 'bold 11px Arial, sans-serif';
  ctx.fillText('CHEMIST & DRUGGIST • DISPENSING PHARMACY', billW / 2, 58);

  ctx.font = '10px Arial, sans-serif';
  ctx.fillText('Car Street, Udupi, Karnataka - 576101', billW / 2, 73);

  // Drug License box
  ctx.strokeRect(25, 82, billW - 50, 22);
  ctx.font = 'bold 9.5px "Courier New", monospace';
  ctx.fillText('Drug License No: KA-UD-2019-04521 | GST: 29AABCR1234F1Z8', billW / 2, 97);

  // Metadata row
  ctx.textAlign = 'left';
  ctx.font = 'bold 11px "Courier New", monospace';
  const billNum = data?.billNo || '#409';
  const billDate = data?.date || '15/10/2026';
  const billTime = data?.time || '20:42 IST';

  ctx.fillText(`Bill No: ${billNum}`, 25, 126);
  ctx.textAlign = 'right';
  ctx.fillText(`Date: ${billDate} ${billTime}`, billW - 25, 126);

  // Table header
  ctx.strokeStyle = inkColor;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(20, 134);
  ctx.lineTo(billW - 20, 134);
  ctx.stroke();

  ctx.textAlign = 'left';
  ctx.font = 'bold 10px Arial, sans-serif';
  ctx.fillText('SN  ITEM DESCRIPTION', 25, 148);
  ctx.textAlign = 'center';
  ctx.fillText('QTY', 260, 148);
  ctx.textAlign = 'right';
  ctx.fillText('RATE', 315, 148);
  ctx.fillText('AMOUNT', billW - 25, 148);

  ctx.beginPath();
  ctx.moveTo(20, 155);
  ctx.lineTo(billW - 20, 155);
  ctx.stroke();

  // Line items
  ctx.font = '11px "Courier New", monospace';
  ctx.textAlign = 'left';
  ctx.fillText('1.  Lactogen-2 Baby Formula (400g)', 25, 178);
  ctx.font = '9px Arial, sans-serif';
  ctx.fillText('    Batch #LF2-0988  Exp: 08/2027', 25, 192);
  ctx.font = '11px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('x1', 260, 178);
  ctx.textAlign = 'right';
  ctx.fillText('890.00', 315, 178);
  ctx.fillText('890.00', billW - 25, 178);

  ctx.textAlign = 'left';
  ctx.fillText('2.  Amoxicillin 500mg (Strip of 10)', 25, 222);
  ctx.font = '9px Arial, sans-serif';
  ctx.fillText('    Cipla Novamox  Exp: 11/2027', 25, 236);
  ctx.font = '11px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('x10', 260, 222);
  ctx.textAlign = 'right';
  ctx.fillText('56.00', 315, 222);
  ctx.fillText('560.00', billW - 25, 222);

  // Total calculation box
  ctx.strokeStyle = inkColor;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(20, 310, billW - 40, 60);

  ctx.textAlign = 'left';
  ctx.font = '10px Arial, sans-serif';
  ctx.fillText('CGST 6% + SGST 6% Included in MRP', 28, 330);
  ctx.fillText('Payment: UPI - PhonePe QR (Verified)', 28, 348);
  ctx.fillText('Ref No: 428901239845 (Layer-3 Hold)', 28, 362);

  const totalAmt = (data?.amount || 1450).toLocaleString('en-IN');
  ctx.textAlign = 'right';
  ctx.font = 'bold 15px "Courier New", monospace';
  ctx.fillText(`TOTAL: ₹${totalAmt}`, billW - 30, 345);

  // Circular stamp (slightly tilted)
  ctx.save();
  ctx.translate(billW - 90, 440);
  ctx.rotate((-12 * Math.PI) / 180);
  ctx.strokeStyle = 'rgba(107, 33, 168, 0.7)';
  ctx.fillStyle = 'rgba(107, 33, 168, 0.8)';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.arc(0, 0, 42, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, 38, 0, Math.PI * 2);
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.font = 'bold 7.5px Arial, sans-serif';
  ctx.fillText('RAMESH MEDICALS', 0, -22);
  ctx.font = 'bold 9px Arial, sans-serif';
  ctx.fillText('★ PAID ★', 0, 0);
  ctx.fillText('15 OCT 2026', 0, 12);
  ctx.font = 'bold 7px Arial, sans-serif';
  ctx.fillText('UDUPI - 576101', 0, 24);
  ctx.restore();

  // Footer message
  ctx.textAlign = 'center';
  ctx.font = 'italic 11px Georgia, serif';
  ctx.fillStyle = '#333';
  ctx.fillText('Thank You — Visit Again — Get Well Soon', billW / 2, 530);
  ctx.font = '9px Arial, sans-serif';
  ctx.fillText('Goods once sold will be taken back as per Drug & Cosmetics Rules', billW / 2, 550);

  ctx.restore();
  return canvasToBase64(canvas);
}

/**
 * 2. Singapore Hawker Stall Thermal POS Receipt
 * Uncle Tan Hainanese Chicken Rice, Maxwell Food Centre
 */
export function generateHawkerReceipt(data?: {
  receiptNo?: string;
  date?: string;
  amount?: number;
}): string {
  const width = 350;
  const height = 500;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2d context');

  // Thermal paper off-white
  ctx.fillStyle = '#fafafa';
  ctx.fillRect(0, 0, width, height);

  // Subtle jagged thermal paper edge at top and bottom
  ctx.fillStyle = '#e8e8e8';
  for (let x = 0; x < width; x += 10) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 5, 5);
    ctx.lineTo(x + 10, 0);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x, height);
    ctx.lineTo(x + 5, height - 5);
    ctx.lineTo(x + 10, height);
    ctx.fill();
  }

  // Slight thermal paper texture
  addPaperNoise(ctx, width, height, 0.02, 0.04);

  // Thermal monospace ink (slightly softened black)
  ctx.fillStyle = '#222222';
  ctx.font = 'bold 15px "Courier New", Consolas, monospace';
  ctx.textAlign = 'center';

  ctx.fillText('UNCLE TAN HAINANESE CHICKEN RICE', width / 2, 45);
  ctx.font = '11.5px "Courier New", Consolas, monospace';
  ctx.fillText('Maxwell Food Centre #01-45', width / 2, 65);
  ctx.fillText('1 Kadayanallur St, Singapore 069184', width / 2, 80);
  ctx.fillText('UEN / GST Reg: 53123456M', width / 2, 95);

  // Dashed separator line
  ctx.font = '11px "Courier New", Consolas, monospace';
  ctx.fillText('------------------------------------------', width / 2, 115);

  ctx.textAlign = 'left';
  const rNo = data?.receiptNo || 'MFC-20261015-0847';
  const rDate = data?.date || '15-OCT-2026 12:31:05';
  ctx.fillText(`Receipt #: ${rNo}`, 20, 135);
  ctx.fillText(`Date/Time: ${rDate}`, 20, 152);
  ctx.fillText('Table: TAKEAWAY (CATERING)', 20, 169);
  ctx.fillText('Cashier: Uncle Tan / Terminal 1', 20, 186);

  ctx.textAlign = 'center';
  ctx.fillText('------------------------------------------', width / 2, 204);

  // Table items
  ctx.textAlign = 'left';
  ctx.font = 'bold 11.5px "Courier New", Consolas, monospace';
  ctx.fillText('QTY  ITEM DESCRIPTION             AMOUNT', 20, 222);
  ctx.font = '11px "Courier New", Consolas, monospace';
  ctx.fillText('10x  Roasted Chicken Rice Set     $48.50', 20, 245);
  ctx.font = '9.5px "Courier New", Consolas, monospace';
  ctx.fillText('     (@ $4.85 / set with cucumber & soup)', 20, 260);

  ctx.textAlign = 'center';
  ctx.fillText('------------------------------------------', width / 2, 282);

  // Calculation breakdown
  const amt = data?.amount || 48.5;
  const gst = (amt * 0.09).toFixed(2);
  const subtotal = (amt - parseFloat(gst)).toFixed(2);

  ctx.textAlign = 'left';
  ctx.fillText('Subtotal:', 20, 302);
  ctx.textAlign = 'right';
  ctx.fillText(`$${subtotal}`, width - 20, 302);

  ctx.textAlign = 'left';
  ctx.fillText('GST 9% (Included):', 20, 320);
  ctx.textAlign = 'right';
  ctx.fillText(`$${gst}`, width - 20, 320);

  ctx.textAlign = 'center';
  ctx.fillText('==========================================', width / 2, 338);

  ctx.font = 'bold 16px "Courier New", Consolas, monospace';
  ctx.textAlign = 'left';
  ctx.fillText('TOTAL (SGD):', 20, 360);
  ctx.textAlign = 'right';
  ctx.fillText(`$${amt.toFixed(2)}`, width - 20, 360);

  ctx.font = '10.5px "Courier New", Consolas, monospace';
  ctx.textAlign = 'left';
  ctx.fillText('Payment Mode: PayNow QR (SGQR)', 20, 385);
  ctx.fillText('Ref ID: SG-PN-982347101-L2', 20, 400);

  // Barcode
  ctx.fillStyle = '#111';
  const startX = 60;
  const barY = 418;
  const barH = 26;
  const barPattern = [2, 1, 3, 1, 2, 2, 1, 3, 2, 1, 1, 3, 2, 1, 4, 1, 2, 1, 3, 2, 1, 2, 3, 1, 2];
  let curX = startX;
  for (const b of barPattern) {
    ctx.fillRect(curX, barY, b * 1.6, barH);
    curX += b * 1.6 + 2.5;
  }

  ctx.textAlign = 'center';
  ctx.font = '9px Arial, sans-serif';
  ctx.fillStyle = '#444';
  ctx.fillText('Thank you for supporting Singapore Hawker Culture!', width / 2, 465);
  ctx.fillText('UNESCO Intangible Cultural Heritage', width / 2, 478);

  return canvasToBase64(canvas);
}

/**
 * 3. Suspicious / Mismatched Hardware Store Receipt
 * Rajesh Hardware & Trading (Photocopy artifact, 3-week stale date, ₹12,000 vs ₹48,000)
 */
export function generateFakeReceipt(data?: {
  amount?: number;
}): string {
  const width = 380;
  const height = 550;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2d context');

  // Washed-out photocopy gray background
  ctx.fillStyle = '#e2e2e2';
  ctx.fillRect(0, 0, width, height);

  // Photocopier dark edge burn artifact on left margin
  const grad = ctx.createLinearGradient(0, 0, 35, 0);
  grad.addColorStop(0, 'rgba(40, 40, 40, 0.45)');
  grad.addColorStop(1, 'rgba(40, 40, 40, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 35, height);

  // Heavy photocopy noise and speckles
  addPaperNoise(ctx, width, height, 0.08, 0.15);

  ctx.save();
  // Crooked scanner alignment (2.8 degrees)
  ctx.translate(width / 2, height / 2);
  ctx.rotate((-2.8 * Math.PI) / 180);
  ctx.translate(-width / 2 + 10, -height / 2 + 15);

  // Faded toner / smudged ink
  ctx.fillStyle = '#2b2b2b';
  ctx.textAlign = 'center';
  ctx.font = 'bold 18px "Courier New", monospace';
  ctx.fillText('RAJESH HARDWARE & TRADING', width / 2, 55);

  ctx.font = '10px "Courier New", monospace';
  ctx.fillText('Plot 42, GIDC Industrial Estate, Vapi, Gujarat', width / 2, 75);
  ctx.fillText('GSTIN: UNREGISTERED / NOT PROVIDED', width / 2, 90);

  ctx.strokeRect(20, 105, width - 60, 1);

  // STALE DATE: 3 WEEKS PRIOR!
  ctx.textAlign = 'left';
  ctx.font = 'bold 12px "Courier New", monospace';
  ctx.fillText('DATE: 24/09/2026', 25, 130); // 3 weeks before October transaction
  ctx.fillText('MEMO NO: 0012', 25, 150);

  ctx.strokeRect(20, 165, width - 60, 1);

  // VAGUE LINE ITEM
  ctx.font = '12px "Courier New", monospace';
  ctx.fillText('ITEMS:', 25, 190);
  ctx.font = 'bold 13px "Courier New", monospace';
  ctx.fillText('Misc Hardware Items', 40, 220);

  ctx.font = '11px "Courier New", monospace';
  ctx.fillText('(No serial numbers / rates / quantities listed)', 40, 240);

  // AMOUNT MISMATCH: ₹12,000 (Transaction is ₹48,000!)
  const displayAmt = (data?.amount || 12000).toLocaleString('en-IN');
  ctx.font = 'bold 16px "Courier New", monospace';
  ctx.fillText(`TOTAL AMOUNT: ₹${displayAmt}`, 40, 290);

  ctx.font = '10px "Courier New", monospace';
  ctx.fillText('Payment: Part Cash / Split Online Transfer', 25, 330);
  ctx.fillText('Customer: Walk-in / Counter', 25, 350);

  // Photocopier streak artifact (vertical line)
  ctx.strokeStyle = 'rgba(60, 60, 60, 0.4)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(110, 30);
  ctx.lineTo(105, height - 30);
  ctx.stroke();

  // Smudge on corner
  ctx.fillStyle = 'rgba(70, 70, 70, 0.25)';
  ctx.beginPath();
  ctx.arc(310, 380, 22, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = 'italic 11px Arial, sans-serif';
  ctx.fillText('Authorized Signature: ____________', 40, 420);

  ctx.restore();
  return canvasToBase64(canvas);
}

/**
 * 4. Synthetic Shop Interior / Storefront Photo Generator
 */
export function generateShopPhoto(type: 'medical' | 'hawker' | 'suspicious'): string {
  const width = 400;
  const height = 300;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2d context');

  if (type === 'medical') {
    // Pharmacy interior: shelves with medicines, green cross, counter
    // Back wall
    ctx.fillStyle = '#eef2f6';
    ctx.fillRect(0, 0, width, height);

    // Floor tiles
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(0, 210, width, 90);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 210);
      ctx.lineTo(x, 300);
      ctx.stroke();
    }

    // Wall shelves (3 rows)
    const shelfY = [40, 95, 150];
    for (const sy of shelfY) {
      ctx.fillStyle = '#64748b';
      ctx.fillRect(20, sy + 35, 230, 6);

      // Colorful medicine boxes & bottles
      const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];
      for (let bx = 30; bx < 230; bx += 18) {
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        const boxH = 20 + Math.floor(Math.sin(bx) * 10);
        ctx.fillRect(bx, sy + 35 - boxH, 14, boxH);
      }
    }

    // Glowing Green Pharmacy Cross on right wall
    ctx.fillStyle = '#10b981';
    ctx.shadowColor = 'rgba(16, 185, 129, 0.4)';
    ctx.shadowBlur = 15;
    // Cross center
    ctx.fillRect(305, 50, 24, 60);
    ctx.fillRect(287, 68, 60, 24);
    ctx.shadowBlur = 0;

    // Pharmacy Counter
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(150, 180, 230, 70);
    ctx.fillStyle = '#334155';
    ctx.fillRect(145, 175, 240, 10);

    // Computer Monitor on counter
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(180, 130, 45, 35);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(184, 134, 37, 27); // Screen glow
    ctx.fillStyle = '#64748b';
    ctx.fillRect(198, 165, 8, 10); // Monitor stand

    // QR Code display stand on counter
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(260, 145, 25, 30);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(264, 150, 17, 18);
  } else if (type === 'hawker') {
    // Singapore Hawker Stall: stainless steel counter, signage, hanging chickens
    // Warm kitchen background
    ctx.fillStyle = '#3f3f46';
    ctx.fillRect(0, 0, width, height);

    // Overhead stall header sign (Yellow banner with red text)
    ctx.fillStyle = '#facc15';
    ctx.fillRect(20, 15, width - 40, 50);
    ctx.fillStyle = '#b91c1c';
    ctx.font = 'bold 15px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('UNCLE TAN HAINANESE CHICKEN RICE #01-45', width / 2, 45);

    // Glass display case
    ctx.strokeStyle = '#a1a1aa';
    ctx.lineWidth = 2;
    ctx.strokeRect(30, 75, 220, 120);

    // Hanging roasted chickens (golden-amber silhouettes)
    ctx.fillStyle = '#b45309';
    for (let cx = 60; cx <= 210; cx += 45) {
      // Hanging hook
      ctx.strokeStyle = '#d4d4d8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx, 75);
      ctx.lineTo(cx, 95);
      ctx.stroke();

      // Roasted chicken shape
      ctx.beginPath();
      ctx.ellipse(cx, 125, 16, 26, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Stainless steel prep counter
    const steelGrad = ctx.createLinearGradient(0, 195, 0, 270);
    steelGrad.addColorStop(0, '#e4e4e7');
    steelGrad.addColorStop(0.5, '#a1a1aa');
    steelGrad.addColorStop(1, '#71717a');
    ctx.fillStyle = steelGrad;
    ctx.fillRect(0, 195, width, 105);

    // PayNow SGQR stand on counter
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(280, 130, 45, 60);
    ctx.fillStyle = '#7c2d12'; // SGQR maroon header
    ctx.fillRect(280, 130, 45, 12);
    ctx.fillStyle = '#111';
    ctx.fillRect(288, 148, 28, 28); // QR matrix
  } else {
    // Suspicious Mule account: Bare, empty unpainted room, flickering bulb
    ctx.fillStyle = '#78716c';
    ctx.fillRect(0, 0, width, height);

    // Wall cracks & stains
    ctx.strokeStyle = '#44403c';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(80, 20);
    ctx.lineTo(110, 90);
    ctx.lineTo(100, 140);
    ctx.stroke();

    // Bare hanging light wire & bulb
    ctx.strokeStyle = '#1c1917';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, 70);
    ctx.stroke();

    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(width / 2, 76, 8, 0, Math.PI * 2);
    ctx.fill();

    // Bare folding table with nothing on it
    ctx.fillStyle = '#a8a29e';
    ctx.fillRect(90, 180, 220, 12);
    ctx.fillStyle = '#292524';
    ctx.fillRect(100, 192, 6, 70);
    ctx.fillRect(294, 192, 6, 70);

    // Cardboard box on floor
    ctx.fillStyle = '#92400e';
    ctx.fillRect(260, 230, 45, 40);

    // Notice text in scene
    ctx.fillStyle = '#dc2626';
    ctx.font = 'bold 11px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('[ NO RETAIL INVENTORY / UNSTAFFED SHELL FACILITY ]', width / 2, 285);
  }

  return canvasToBase64(canvas);
}
