import { DemoScenario } from '../types';

// Helper to generate clean, lightweight SVG data URLs for receipts and storefronts
const createSvgDataUrl = (svgContent: string): string => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent.trim())}`;
};

// Scenario 1: Marg ERP Medical Tax Invoice
const rameshReceiptSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 640" width="450" height="640">
  <rect width="100%" height="100%" fill="#ffffff" rx="8" />
  <rect x="12" y="12" width="426" height="616" fill="none" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="4 2" />
  
  <!-- Header -->
  <text x="225" y="48" font-family="'Courier New', monospace" font-size="20" font-weight="bold" fill="#0f172a" text-anchor="middle">RAMESH MEDICALS &amp; GENERAL</text>
  <text x="225" y="68" font-family="'Courier New', monospace" font-size="12" fill="#475569" text-anchor="middle">#14, 8th Main, 4th Block, Koramangala, Bengaluru - 560034</text>
  <text x="225" y="86" font-family="'Courier New', monospace" font-size="11" fill="#475569" text-anchor="middle">DL No: KA-B-29182/29183 | GSTIN: 29AABCR4419P1Z8</text>
  <text x="225" y="102" font-family="'Courier New', monospace" font-size="11" fill="#475569" text-anchor="middle">Ph: +91 80 2553 8812 | Marg ERP v12.4 POS</text>
  
  <!-- Line separator -->
  <line x1="24" y1="116" x2="426" y2="116" stroke="#0f172a" stroke-width="1.5" />
  
  <!-- Bill Metadata -->
  <text x="28" y="138" font-family="'Courier New', monospace" font-size="13" font-weight="bold" fill="#0f172a">TAX INVOICE: BILL #409</text>
  <text x="422" y="138" font-family="'Courier New', monospace" font-size="12" fill="#0f172a" text-anchor="end">DATE: 15-OCT-2026 16:14:22</text>
  <text x="28" y="156" font-family="'Courier New', monospace" font-size="12" fill="#475569">Customer: Walk-in (Prescription Ref #DR-901)</text>
  <text x="422" y="156" font-family="'Courier New', monospace" font-size="12" fill="#475569" text-anchor="end">Counter: Reg-01 (Pharmacist: Ramesh K.)</text>
  
  <!-- Table Header -->
  <line x1="24" y1="170" x2="426" y2="170" stroke="#94a3b8" stroke-width="1" />
  <text x="28" y="186" font-family="'Courier New', monospace" font-size="11" font-weight="bold" fill="#0f172a">ITEM DESCRIPTION</text>
  <text x="270" y="186" font-family="'Courier New', monospace" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="end">QTY</text>
  <text x="340" y="186" font-family="'Courier New', monospace" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="end">RATE</text>
  <text x="422" y="186" font-family="'Courier New', monospace" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="end">AMOUNT (INR)</text>
  <line x1="24" y1="194" x2="426" y2="194" stroke="#94a3b8" stroke-width="1" />
  
  <!-- Line Items -->
  <text x="28" y="220" font-family="'Courier New', monospace" font-size="12" fill="#0f172a">1. LACTOGEN 1 FORMULA 400G</text>
  <text x="270" y="220" font-family="'Courier New', monospace" font-size="12" fill="#0f172a" text-anchor="end">1</text>
  <text x="340" y="220" font-family="'Courier New', monospace" font-size="12" fill="#0f172a" text-anchor="end">465.00</text>
  <text x="422" y="220" font-family="'Courier New', monospace" font-size="12" font-weight="bold" fill="#0f172a" text-anchor="end">465.00</text>
  
  <text x="28" y="248" font-family="'Courier New', monospace" font-size="12" fill="#0f172a">2. AMOXICILLIN ORAL 500MG</text>
  <text x="270" y="248" font-family="'Courier New', monospace" font-size="12" fill="#0f172a" text-anchor="end">1</text>
  <text x="340" y="248" font-family="'Courier New', monospace" font-size="12" fill="#0f172a" text-anchor="end">185.00</text>
  <text x="422" y="248" font-family="'Courier New', monospace" font-size="12" font-weight="bold" fill="#0f172a" text-anchor="end">185.00</text>
  
  <text x="28" y="276" font-family="'Courier New', monospace" font-size="12" fill="#0f172a">3. DIGITAL THERMOMETER MT-101</text>
  <text x="270" y="276" font-family="'Courier New', monospace" font-size="12" fill="#0f172a" text-anchor="end">1</text>
  <text x="340" y="276" font-family="'Courier New', monospace" font-size="12" fill="#0f172a" text-anchor="end">250.00</text>
  <text x="422" y="276" font-family="'Courier New', monospace" font-size="12" font-weight="bold" fill="#0f172a" text-anchor="end">250.00</text>

  <text x="28" y="304" font-family="'Courier New', monospace" font-size="12" fill="#0f172a">4. PARACETAMOL DROPS 15ML</text>
  <text x="270" y="304" font-family="'Courier New', monospace" font-size="12" fill="#0f172a" text-anchor="end">1</text>
  <text x="340" y="304" font-family="'Courier New', monospace" font-size="12" fill="#0f172a" text-anchor="end">50.00</text>
  <text x="422" y="304" font-family="'Courier New', monospace" font-size="12" font-weight="bold" fill="#0f172a" text-anchor="end">50.00</text>

  <text x="28" y="332" font-family="'Courier New', monospace" font-size="12" fill="#0f172a">5. N95 FILTER MASK BOX (5PC)</text>
  <text x="270" y="332" font-family="'Courier New', monospace" font-size="12" fill="#0f172a" text-anchor="end">1</text>
  <text x="340" y="332" font-family="'Courier New', monospace" font-size="12" fill="#0f172a" text-anchor="end">500.00</text>
  <text x="422" y="332" font-family="'Courier New', monospace" font-size="12" font-weight="bold" fill="#0f172a" text-anchor="end">500.00</text>
  
  <!-- Line separator -->
  <line x1="24" y1="360" x2="426" y2="360" stroke="#94a3b8" stroke-width="1" />
  
  <!-- Totals -->
  <text x="250" y="386" font-family="'Courier New', monospace" font-size="12" fill="#475569">SUBTOTAL:</text>
  <text x="422" y="386" font-family="'Courier New', monospace" font-size="12" fill="#0f172a" text-anchor="end">1,450.00</text>
  
  <text x="250" y="406" font-family="'Courier New', monospace" font-size="12" fill="#475569">CGST (6%):</text>
  <text x="422" y="406" font-family="'Courier New', monospace" font-size="12" fill="#0f172a" text-anchor="end">INCLUDED</text>

  <text x="250" y="426" font-family="'Courier New', monospace" font-size="12" fill="#475569">SGST (6%):</text>
  <text x="422" y="426" font-family="'Courier New', monospace" font-size="12" fill="#0f172a" text-anchor="end">INCLUDED</text>
  
  <line x1="240" y1="440" x2="426" y2="440" stroke="#0f172a" stroke-width="2" />
  <text x="240" y="466" font-family="'Courier New', monospace" font-size="17" font-weight="bold" fill="#059669">TOTAL (INR):</text>
  <text x="422" y="466" font-family="'Courier New', monospace" font-size="18" font-weight="bold" fill="#059669" text-anchor="end">&#8377;1,450.00</text>
  
  <!-- Payment Information -->
  <rect x="24" y="490" width="402" height="74" fill="#f8fafc" stroke="#e2e8f0" rx="4" />
  <text x="36" y="512" font-family="'Courier New', monospace" font-size="11" font-weight="bold" fill="#0f172a">PAYMENT MODE: UPI QR (PhonePe Dynamic QR)</text>
  <text x="36" y="530" font-family="'Courier New', monospace" font-size="11" fill="#475569">UPI Ref: 628919248011 | Txn Status: SUCCESS</text>
  <text x="36" y="548" font-family="'Courier New', monospace" font-size="11" fill="#475569">Payer VPA: priya.sharma91@okhdfcbank (Auto-routed L3)</text>
  
  <!-- Footer -->
  <text x="225" y="596" font-family="'Courier New', monospace" font-size="11" fill="#64748b" text-anchor="middle">*** THANK YOU - WISH YOU SPEEDY RECOVERY ***</text>
  <text x="225" y="612" font-family="'Courier New', monospace" font-size="10" fill="#94a3b8" text-anchor="middle">Marg ERP System Generated Invoice - Verified Digital Signature</text>
</svg>
`);

// Scenario 1: Ramesh Medicals Storefront
const rameshShopSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
  <defs>
    <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
  </defs>
  <rect width="600" height="400" fill="url(#skyGrad)" />
  
  <!-- Shop Façade -->
  <rect x="50" y="60" width="500" height="320" fill="#334155" rx="6" />
  <rect x="65" y="75" width="470" height="70" fill="#065f46" rx="4" stroke="#10b981" stroke-width="2" />
  
  <!-- Signboard -->
  <text x="300" y="112" font-family="sans-serif" font-size="24" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="2">RAMESH MEDICALS &amp; GENERAL</text>
  <text x="300" y="132" font-family="sans-serif" font-size="11" fill="#a7f3d0" text-anchor="middle">24 HRS CHEMISTS &amp; DRUGGISTS | DL: KA-B-29182/29183</text>
  
  <!-- Pharmacy Green Cross -->
  <rect x="80" y="90" width="30" height="10" fill="#ffffff" rx="2" />
  <rect x="90" y="80" width="10" height="30" fill="#ffffff" rx="2" />
  <rect x="490" y="90" width="30" height="10" fill="#ffffff" rx="2" />
  <rect x="500" y="80" width="10" height="30" fill="#ffffff" rx="2" />

  <!-- Glass Front & Display -->
  <rect x="75" y="160" width="450" height="200" fill="#1e293b" stroke="#475569" stroke-width="2" />
  <rect x="95" y="180" width="180" height="160" fill="#0f172a" stroke="#334155" rx="2" />
  <rect x="325" y="180" width="180" height="160" fill="#0f172a" stroke="#334155" rx="2" />
  
  <!-- Medicine shelves inside glass -->
  <line x1="105" y1="220" x2="265" y2="220" stroke="#475569" stroke-width="2" />
  <line x1="105" y1="260" x2="265" y2="260" stroke="#475569" stroke-width="2" />
  <line x1="105" y1="300" x2="265" y2="300" stroke="#475569" stroke-width="2" />

  <line x1="335" y1="220" x2="495" y2="220" stroke="#475569" stroke-width="2" />
  <line x1="335" y1="260" x2="495" y2="260" stroke="#475569" stroke-width="2" />
  <line x1="335" y1="300" x2="495" y2="300" stroke="#475569" stroke-width="2" />
  
  <!-- QR Stand on Counter -->
  <rect x="280" y="270" width="40" height="50" fill="#0284c7" rx="3" />
  <rect x="285" y="275" width="30" height="30" fill="#ffffff" />
  <text x="300" y="314" font-family="sans-serif" font-size="7" font-weight="bold" fill="#ffffff" text-anchor="middle">PhonePe</text>
  
  <!-- Geotag & CCTV watermark -->
  <rect x="60" y="340" width="480" height="30" fill="rgba(0,0,0,0.7)" />
  <text x="75" y="360" font-family="monospace" font-size="11" fill="#10b981">LAT: 12.9352&#176; N, LNG: 77.6245&#176; E | BENGALURU 560034 | CCTV CAM-01 ACTIVE</text>
</svg>
`);

// Scenario 2: Singapore Uncle Tan Thermal POS Slip
const uncleTanReceiptSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 580" width="380" height="580">
  <rect width="100%" height="100%" fill="#fffdfa" rx="4" />
  
  <!-- Jagged top tear line -->
  <path d="M 10 10 L 25 2 M 25 2 L 40 10 M 40 10 L 55 2 M 55 2 L 70 10 M 70 10 L 85 2 M 85 2 L 100 10 M 100 10 L 115 2 M 115 2 L 130 10 M 130 10 L 145 2 M 145 2 L 160 10 M 160 10 L 175 2 M 175 2 L 190 10 M 190 10 L 205 2 M 205 2 L 220 10 M 220 10 L 235 2 M 235 2 L 250 10 M 250 10 L 265 2 M 265 2 L 280 10 M 280 10 L 295 2 M 295 2 L 310 10 M 310 10 L 325 2 M 325 2 L 340 10 M 340 10 L 355 2 M 355 2 L 370 10" stroke="#cbd5e1" stroke-width="1.5" fill="none" />
  
  <!-- Header -->
  <text x="190" y="52" font-family="'Courier New', monospace" font-size="18" font-weight="bold" fill="#1e293b" text-anchor="middle">UNCLE TAN HAINANESE CHICKEN RICE</text>
  <text x="190" y="72" font-family="'Courier New', monospace" font-size="12" fill="#475569" text-anchor="middle">MAXWELL FOOD CENTRE #01-28</text>
  <text x="190" y="88" font-family="'Courier New', monospace" font-size="11" fill="#475569" text-anchor="middle">1 Kadayanallur St, Singapore 069184</text>
  <text x="190" y="104" font-family="'Courier New', monospace" font-size="11" fill="#475569" text-anchor="middle">UEN: 201833918M | NEA Lic: S98012A</text>
  
  <line x1="20" y1="118" x2="360" y2="118" stroke="#334155" stroke-dasharray="3 3" />
  
  <!-- Metadata -->
  <text x="24" y="140" font-family="'Courier New', monospace" font-size="13" font-weight="bold" fill="#0f172a">ORDER CHIT: #088 (TAKEAWAY)</text>
  <text x="24" y="158" font-family="'Courier New', monospace" font-size="12" fill="#475569">DATE: 16-OCT-2026 12:34:48 SGT</text>
  <text x="24" y="174" font-family="'Courier New', monospace" font-size="12" fill="#475569">TERM: SUNMI-V2-POS-01</text>
  
  <line x1="20" y1="188" x2="360" y2="188" stroke="#334155" stroke-dasharray="3 3" />
  
  <!-- Items -->
  <text x="24" y="214" font-family="'Courier New', monospace" font-size="13" fill="#0f172a">10x STEAMED CHICKEN RICE SET</text>
  <text x="356" y="214" font-family="'Courier New', monospace" font-size="13" font-weight="bold" fill="#0f172a" text-anchor="end">$45.00</text>
  <text x="40" y="232" font-family="'Courier New', monospace" font-size="11" fill="#64748b">(@ $4.50 packet with soup &amp; chilli)</text>
  
  <text x="24" y="260" font-family="'Courier New', monospace" font-size="13" fill="#0f172a">5x BRAISED HERBAL EGG</text>
  <text x="356" y="260" font-family="'Courier New', monospace" font-size="13" font-weight="bold" fill="#0f172a" text-anchor="end">$3.50</text>
  <text x="40" y="278" font-family="'Courier New', monospace" font-size="11" fill="#64748b">(@ $0.70 each)</text>
  
  <line x1="20" y1="300" x2="360" y2="300" stroke="#334155" stroke-dasharray="3 3" />
  
  <!-- Summary -->
  <text x="24" y="326" font-family="'Courier New', monospace" font-size="13" fill="#475569">SUBTOTAL (15 items):</text>
  <text x="356" y="326" font-family="'Courier New', monospace" font-size="13" fill="#0f172a" text-anchor="end">$48.50</text>
  
  <text x="24" y="346" font-family="'Courier New', monospace" font-size="12" fill="#475569">GST 9% (Incl in Price):</text>
  <text x="356" y="346" font-family="'Courier New', monospace" font-size="12" fill="#475569" text-anchor="end">$4.01</text>
  
  <line x1="20" y1="362" x2="360" y2="362" stroke="#0f172a" stroke-width="2" />
  
  <text x="24" y="392" font-family="'Courier New', monospace" font-size="18" font-weight="bold" fill="#059669">TOTAL (SGD):</text>
  <text x="356" y="392" font-family="'Courier New', monospace" font-size="20" font-weight="bold" fill="#059669" text-anchor="end">S$48.50</text>
  
  <!-- PayNow details -->
  <rect x="20" y="416" width="340" height="66" fill="#f1f5f9" rx="4" />
  <text x="30" y="438" font-family="'Courier New', monospace" font-size="11" font-weight="bold" fill="#0f172a">PAID VIA: SGQR PayNow (DBS FAST)</text>
  <text x="30" y="456" font-family="'Courier New', monospace" font-size="11" fill="#475569">Txn Ref: SGQR99182371 | Approval: AUTH-OK</text>
  <text x="30" y="472" font-family="'Courier New', monospace" font-size="11" fill="#475569">Clearing Rail: NETS / DBS PayLah FAST Rail</text>
  
  <!-- Footer -->
  <text x="190" y="520" font-family="'Courier New', monospace" font-size="12" fill="#334155" text-anchor="middle">*** TERIMA KASIH / KAM SIAH ***</text>
  <text x="190" y="538" font-family="'Courier New', monospace" font-size="10" fill="#64748b" text-anchor="middle">Authentic Hainanese Recipe Since 2004</text>
</svg>
`);

// Scenario 2: Uncle Tan Hawker Stall Front
const uncleTanShopSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
  <rect width="600" height="400" fill="#0f172a" />
  
  <!-- Hawker Stall Structure -->
  <rect x="40" y="50" width="520" height="320" fill="#1e293b" rx="6" />
  
  <!-- Stall Signboard -->
  <rect x="60" y="65" width="480" height="70" fill="#b91c1c" rx="4" stroke="#f59e0b" stroke-width="2" />
  <text x="300" y="102" font-family="sans-serif" font-size="22" font-weight="900" fill="#ffffff" text-anchor="middle">陳叔海南雞飯 UNCLE TAN CHICKEN RICE</text>
  <text x="300" y="122" font-family="sans-serif" font-size="12" fill="#fef08a" text-anchor="middle">MAXWELL FOOD CENTRE #01-28 | EST. 2004</text>
  
  <!-- NEA Grade A Badge -->
  <circle cx="505" cy="100" r="22" fill="#15803d" stroke="#ffffff" stroke-width="2" />
  <text x="505" y="106" font-family="sans-serif" font-size="18" font-weight="900" fill="#ffffff" text-anchor="middle">A</text>
  <text x="505" y="118" font-family="sans-serif" font-size="6" fill="#dcfce7" text-anchor="middle">NEA HYGIENE</text>

  <!-- Showcase glass with roast chickens hanging -->
  <rect x="80" y="155" width="220" height="180" fill="#0f172a" stroke="#64748b" stroke-width="2" rx="2" />
  <!-- Stainless steel hanger rail -->
  <line x1="90" y1="175" x2="290" y2="175" stroke="#94a3b8" stroke-width="3" />
  
  <!-- Render hanging chickens -->
  <ellipse cx="120" cy="220" rx="16" ry="32" fill="#d97706" />
  <ellipse cx="160" cy="220" rx="16" ry="32" fill="#f59e0b" />
  <ellipse cx="200" cy="220" rx="16" ry="32" fill="#d97706" />
  <ellipse cx="240" cy="220" rx="16" ry="32" fill="#f59e0b" />
  
  <!-- SGQR Payment Stand on Counter -->
  <rect x="340" y="190" width="180" height="145" fill="#334155" rx="4" />
  <rect x="360" y="210" width="70" height="90" fill="#ffffff" rx="3" stroke="#e11d48" stroke-width="2" />
  <!-- Red SGQR banner -->
  <rect x="360" y="210" width="70" height="20" fill="#e11d48" />
  <text x="395" y="224" font-family="sans-serif" font-size="9" font-weight="900" fill="#ffffff" text-anchor="middle">SGQR</text>
  <!-- Mock QR dots -->
  <rect x="375" y="240" width="40" height="40" fill="#0f172a" />
  <text x="395" y="295" font-family="sans-serif" font-size="6" font-weight="bold" fill="#0f172a" text-anchor="middle">PAYNOW / DBS</text>
  
  <!-- Stall Owner Uncle Tan Avatar Graphic -->
  <text x="480" y="250" font-family="sans-serif" font-size="36" text-anchor="middle">&#128104;&#8205;&#127859;</text>
  <text x="480" y="280" font-family="sans-serif" font-size="11" font-weight="bold" fill="#f1f5f9" text-anchor="middle">Uncle Tan</text>

  <!-- Timestamp watermark -->
  <rect x="60" y="342" width="480" height="24" fill="rgba(0,0,0,0.75)" />
  <text x="75" y="358" font-family="monospace" font-size="11" fill="#38bdf8">SINGAPORE POLICE FORCE ASC COMPLIANCE VERIFICATION | UEN: 201833918M</text>
</svg>
`);

// Scenario 3: Mismatched Suspicious Hardware Receipt (3 WEEKS OLD, ₹12,000 vs ₹48,000)
const rajeshReceiptSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 560" width="420" height="560">
  <rect width="100%" height="100%" fill="#fffbeb" rx="4" />
  <rect x="15" y="15" width="390" height="530" fill="none" stroke="#dc2626" stroke-width="2" stroke-dasharray="8 4" />
  
  <!-- Suspicious Stamp Warning Overlay -->
  <g transform="rotate(-18 210 280)">
    <rect x="60" y="240" width="300" height="60" fill="none" stroke="#ef4444" stroke-width="4" rx="6" />
    <text x="210" y="278" font-family="'Impact', sans-serif" font-size="28" font-weight="bold" fill="#ef4444" text-anchor="middle" letter-spacing="2">MISMATCHED / SUSPICIOUS</text>
  </g>

  <!-- Entity Header: DIFFERENT NAME (Shree Ganesh Hardware vs Rajesh Trading) -->
  <text x="210" y="52" font-family="sans-serif" font-size="18" font-weight="bold" fill="#991b1b" text-anchor="middle">SHREE GANESH HARDWARE &amp; TOOLS</text>
  <text x="210" y="70" font-family="sans-serif" font-size="11" fill="#78350f" text-anchor="middle">[ENTITY NAME DOES NOT MATCH 'RAJESH TRADING CO.']</text>
  <text x="210" y="86" font-family="sans-serif" font-size="11" fill="#78350f" text-anchor="middle">Station Road, Navsari, Gujarat (Unregistered)</text>
  
  <line x1="25" y1="102" x2="395" y2="102" stroke="#b45309" stroke-width="1" />
  
  <!-- Old Date (3 WEEKS PRIOR) -->
  <rect x="25" y="112" width="370" height="40" fill="#fee2e2" rx="4" />
  <text x="35" y="130" font-family="monospace" font-size="12" font-weight="bold" fill="#b91c1c">DATE: 24-SEP-2026 (21 DAYS BEFORE TXN!)</text>
  <text x="35" y="145" font-family="monospace" font-size="11" fill="#b91c1c">ESTIMATE MEMO #112 (NON-GST RETAIL CHIT)</text>
  
  <!-- Line Items: ₹12,000 TOTAL vs ₹48,000 FROZEN AMOUNT -->
  <line x1="25" y1="166" x2="395" y2="166" stroke="#d97706" stroke-width="1" />
  <text x="30" y="186" font-family="sans-serif" font-size="12" font-weight="bold" fill="#78350f">ITEM</text>
  <text x="390" y="186" font-family="sans-serif" font-size="12" font-weight="bold" fill="#78350f" text-anchor="end">AMOUNT</text>
  <line x1="25" y1="196" x2="395" y2="196" stroke="#d97706" stroke-width="1" />
  
  <text x="30" y="224" font-family="sans-serif" font-size="12" fill="#451a03">1. M8 Hex Bolts &amp; Nuts (500 pcs)</text>
  <text x="390" y="224" font-family="sans-serif" font-size="12" fill="#451a03" text-anchor="end">&#8377;6,000.00</text>
  
  <text x="30" y="254" font-family="sans-serif" font-size="12" fill="#451a03">2. Threaded MS Rods 1m (12 pcs)</text>
  <text x="390" y="254" font-family="sans-serif" font-size="12" fill="#451a03" text-anchor="end">&#8377;6,000.00</text>
  
  <line x1="25" y1="360" x2="395" y2="360" stroke="#b45309" stroke-width="1.5" />
  
  <!-- Total Mismatch -->
  <text x="180" y="390" font-family="sans-serif" font-size="14" font-weight="bold" fill="#78350f">CHIT TOTAL:</text>
  <text x="390" y="390" font-family="sans-serif" font-size="16" font-weight="bold" fill="#b91c1c" text-anchor="end">&#8377;12,000.00</text>

  <rect x="25" y="415" width="370" height="60" fill="#fef2f2" stroke="#f87171" rx="4" />
  <text x="35" y="435" font-family="monospace" font-size="11" font-weight="bold" fill="#dc2626">CRITICAL DISCREPANCY DETECTED:</text>
  <text x="35" y="452" font-family="monospace" font-size="11" fill="#b91c1c">Frozen Transaction Amount: &#8377;48,000.00</text>
  <text x="35" y="467" font-family="monospace" font-size="11" fill="#b91c1c">Receipt Discrepancy Gap: -&#8377;36,000.00 (75% Mismatch)</text>
  
  <text x="210" y="515" font-family="sans-serif" font-size="10" fill="#991b1b" text-anchor="middle">Payment Mode: "Cash Received" (No UPI ID or QR reference found)</text>
</svg>
`);

// Scenario 3: Generic Suspicious Stock / Deserted Shed Front
const rajeshShopSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
  <rect width="600" height="400" fill="#18181b" />
  
  <!-- Empty dilapidated warehouse shed -->
  <polygon points="100,120 500,120 550,340 50,340" fill="#27272a" stroke="#52525b" stroke-width="2" />
  
  <!-- Corrugated iron roll shutter (Closed) -->
  <rect x="180" y="160" width="240" height="180" fill="#3f3f46" stroke="#71717a" stroke-width="2" />
  <line x1="180" y1="180" x2="420" y2="180" stroke="#27272a" stroke-width="2" />
  <line x1="180" y1="200" x2="420" y2="200" stroke="#27272a" stroke-width="2" />
  <line x1="180" y1="220" x2="420" y2="220" stroke="#27272a" stroke-width="2" />
  <line x1="180" y1="240" x2="420" y2="240" stroke="#27272a" stroke-width="2" />
  <line x1="180" y1="260" x2="420" y2="260" stroke="#27272a" stroke-width="2" />
  <line x1="180" y1="280" x2="420" y2="280" stroke="#27272a" stroke-width="2" />
  <line x1="180" y1="300" x2="420" y2="300" stroke="#27272a" stroke-width="2" />
  <line x1="180" y1="320" x2="420" y2="320" stroke="#27272a" stroke-width="2" />
  
  <!-- Blurred / Missing Signboard -->
  <rect x="190" y="130" width="220" height="24" fill="#52525b" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="3 3" />
  <text x="300" y="146" font-family="monospace" font-size="10" fill="#fca5a5" text-anchor="middle">[NO SIGNBOARD / ABANDONED UNIT]</text>
  
  <!-- Stock Photo Watermark Overlay -->
  <text x="300" y="250" font-family="sans-serif" font-size="42" font-weight="bold" fill="rgba(255,255,255,0.06)" text-anchor="middle" transform="rotate(-25 300 250)">GENERIC STOCK PHOTO</text>
  
  <!-- Red Warning Banner -->
  <rect x="50" y="340" width="500" height="32" fill="#7f1d1d" />
  <text x="300" y="360" font-family="monospace" font-size="11" font-weight="bold" fill="#fecaca" text-anchor="middle">GEO-LOC FAILED: IMAGE METADATA SCRUBBED | FIU-IND MULE SUSPECT</text>
</svg>
`);

export const DEMO_SCENARIOS: DemoScenario[] = [
  // ==========================================
  // SCENARIO 1: RAMESH MEDICALS (INDIA)
  // ==========================================
  {
    id: 'ramesh-medicals',
    name: 'Ramesh Medicals (Bengaluru, India)',
    description: 'Legitimate Layer-3 retail pharmacy caught in cyber lien cascade after selling infant formula and antibiotics.',
    jurisdiction: 'india',
    transaction: {
      id: 'TXN-IN-2026-98124',
      amount: 1450,
      currency: 'INR',
      timestamp: '2026-10-15T16:15:00+05:30',
      merchantName: 'Ramesh Medicals & General Store',
      merchantId: 'MERCH-UPI-IN-560034',
      merchantCategory: 'Medical Store / Pharmacy',
      merchantAddress: 'Shop #14, 8th Main, 4th Block, Koramangala, Bengaluru, Karnataka 560034',
      frozenReason: 'Layer-3 UPI Lien triggered by Karnataka Cyber Police Portal (NCRP Alert #CY-2026-89412)',
      hopChain: [
        {
          id: 'hop-1',
          label: 'Victim: Priya Sharma',
          type: 'victim',
          amount: 85000,
          timestamp: '2026-10-15T15:42:10+05:30',
          holdDuration: '0s',
          status: 'reported',
          accountNumber: 'HDFC Bank A/c **4901',
          routingDetails: 'Victim of APK Malware extortion reported on 1930 Cyber Helpline',
        },
        {
          id: 'hop-2',
          label: 'Layer-1 Mule Account',
          type: 'mule_l1',
          amount: 85000,
          timestamp: '2026-10-15T15:42:12+05:30',
          holdDuration: '2 seconds',
          status: 'frozen',
          accountNumber: 'Kotak Bank A/c **9012',
          routingDetails: 'Automated rapid split (₹42,500 x 2) within 2 seconds',
        },
        {
          id: 'hop-3',
          label: 'Layer-2 Mule Aggregator',
          type: 'mule_l2',
          amount: 42500,
          timestamp: '2026-10-15T15:42:20+05:30',
          holdDuration: '8 seconds',
          status: 'frozen',
          accountNumber: 'Axis Bank A/c **4419',
          routingDetails: 'Rapid fan-out to 29 micro-merchant QR terminals across South India',
        },
        {
          id: 'hop-4',
          label: 'Ramesh Medicals (Terminal POS)',
          type: 'merchant',
          amount: 1450,
          timestamp: '2026-10-15T16:15:00+05:30',
          holdDuration: 'Terminal POS (Zero onward routing)',
          status: 'under_review',
          accountNumber: 'Canara Bank Current A/c **1823',
          routingDetails: 'Counter retail purchase: Infant milk & antibiotics for sick infant',
        },
      ],
      jurisdiction: 'india',
      status: 'frozen',
      regulatoryReference: 'NCRP/2026/BLR-CY-89412-L3',
      customerSLADeadline: '2026-11-04T16:15:00+05:30',
      bankSLADeadline: '2026-10-25T16:15:00+05:30',
      layerNumber: 3,
    },
    evidence: {
      voiceStatement:
        'ನಮಸ್ಕಾರ ಸರ್ (Namaskara sir), on Thursday evening around 4:10 PM, a customer came in panic asking for baby formula Lactogen Stage 1 and Amoxicillin syrup for an infant running high fever. The total bill came to exactly ₹1,450. He paid via PhonePe QR code at 4:14 PM. Here is my GST tax invoice Bill #409 generated from my Marg ERP POS system, and CCTV shows the customer leaving with the sealed medicine packet. My medical license is valid till 2029. Please unfreeze my current account, my daily distributor orders for insulin are bouncing!',
      receiptImage: rameshReceiptSvg,
      shopPhoto: rameshShopSvg,
      additionalNotes:
        'Physical pharmacy operating at same Koramangala address for 9 years. GST returns filed timely for 36 consecutive months. Drug License KA-B-29182/29183 verified active with Karnataka State Pharmacy Council.',
      uploadedAt: '2026-10-16T09:12:00+05:30',
    },
    expectedCLS: {
      graphVelocityScore: 265,
      geminiMultimodalScore: 350,
      physicalLivelihoodScore: 250,
      totalScore: 865,
      riskLevel: 'low',
      recommendation: 'lift_hold',
      details: {
        fanInDiversity: '94% (Natural retail distribution across 75+ daily payers)',
        dailyTicketConsistency: '96% (Median ticket size ₹380 - ₹1,800)',
        holdingDuration: 'Terminal POS (Zero onward routing / funds retained in merchant current account)',
        inventoryConsistency: '98% (Prescription & batch logs for Lactogen Batch #L4091 correspond to invoice)',
        billSequenceIntegrity: 'Bill #409 strictly follows #408 and precedes #410 in Marg POS journal',
        disputeRate: '0.02% (Industry benchmark < 0.5%)',
      },
    },
    expectedGeminiResult: {
      vernacular_translation:
        'Greeting in Kannada/English. Merchant confirms legitimate retail transaction of infant formula (Lactogen 1) and Amoxicillin oral syrup on Oct 15 at ~4:14 PM for ₹1,450 via PhonePe QR. Confirmed CCTV footage and Marg ERP invoice #409. Vital distributor insulin payments are currently failing due to account freeze.',
      extracted_receipt_amount: 1450,
      extracted_receipt_time: '2026-10-15T16:14:22+05:30',
      amount_match_boolean: true,
      visual_authenticity_notes:
        'Marg POS bill #409 matches ₹1,450.00 exactly. Invoice timestamp is 38 seconds prior to UPI clearing webhook credit. GSTIN 29AABCR4419P1Z8 is active on GSTN portal and matches Koramangala pin code. Drug license numbers match state pharmacy registrar records.',
      ai_evidence_score: 350,
      discrepancy_flags: [],
      regulatory_compliance_memo:
        'Full compliance with Draft RBI Master Direction on Cyber Lien Harmonization (Sept 2026, Section 14b). Verified bona fide micro-merchant livelihood impact. Recommend immediate administrative unfreeze of Canara Bank A/c **1823.',
    },
  },

  // ==========================================
  // SCENARIO 2: UNCLE TAN CHICKEN RICE (SINGAPORE)
  // ==========================================
  {
    id: 'uncle-tan-chicken-rice',
    name: "Uncle Tan's Hainanese Chicken Rice (Singapore)",
    description: 'Beloved hawker stall caught in Layer-2 PayNow scam cascade after catering an office lunch order of 10 chicken rice boxes.',
    jurisdiction: 'singapore',
    transaction: {
      id: 'TXN-SG-2026-55102',
      amount: 48.5,
      currency: 'SGD',
      timestamp: '2026-10-16T12:35:00+08:00',
      merchantName: 'Uncle Tan Hainanese Chicken Rice',
      merchantId: 'UEN-201833918M',
      merchantCategory: 'Food & Beverage / Hawker Food Stall',
      merchantAddress: 'Stall #01-28, Maxwell Food Centre, 1 Kadayanallur St, Singapore 069184',
      frozenReason: 'SPF Anti-Scam Command (ASC) Tier-2 automated PayNow hold following banking malware report #SPF-ASC-2026-4401',
      hopChain: [
        {
          id: 'hop-sg-1',
          label: 'Victim: James Lim',
          type: 'victim',
          amount: 12000,
          timestamp: '2026-10-16T12:28:10+08:00',
          holdDuration: '0s',
          status: 'reported',
          accountNumber: 'OCBC Current A/c **2109',
          routingDetails: 'Victim deceived by fake CPF investment APK malware; reported to SPF ASC within 6 minutes',
        },
        {
          id: 'hop-sg-2',
          label: 'Primary PayNow Mule Account',
          type: 'mule_l1',
          amount: 12000,
          timestamp: '2026-10-16T12:28:13+08:00',
          holdDuration: '3 seconds',
          status: 'frozen',
          accountNumber: 'DBS e-Savings **7741',
          routingDetails: 'Instant automated split into 8 FAST transfers within 3 seconds',
        },
        {
          id: 'hop-sg-3',
          label: 'Uncle Tan Chicken Rice (Stall #01-28)',
          type: 'merchant',
          amount: 48.5,
          timestamp: '2026-10-16T12:35:00+08:00',
          holdDuration: 'Terminal consumer purchase (Zero onward hops)',
          status: 'under_review',
          accountNumber: 'DBS Merchant Settlement **3391',
          routingDetails: 'SGQR PayNow scan for 10 takeaway chicken rice packets during Friday peak lunch',
        },
      ],
      jurisdiction: 'singapore',
      status: 'frozen',
      regulatoryReference: 'MAS-SRF/SPF-ASC-2026-4401-T2',
      customerSLADeadline: '2026-10-30T12:35:00+08:00',
      bankSLADeadline: '2026-10-23T12:35:00+08:00',
      layerNumber: 2,
    },
    evidence: {
      voiceStatement:
        'Wah lau eh officer, I sell chicken rice at Maxwell Stall #28 for 22 years already lah! Friday peak lunch crowd around 12:30 PM, one young office guy in shirt come order 10 packets steamed chicken rice with extra braised egg and gizzard for his office colleagues, total $48.50. He scan my SGQR PayNow and show me green tick on phone. I gave him the paper bag and printed thermal chit #088 from my Sunmi POS. Why bank freeze my DBS merchant settlement? All my fresh chicken supplier from Jurong need cash on delivery tomorrow!',
      receiptImage: uncleTanReceiptSvg,
      shopPhoto: uncleTanShopSvg,
      additionalNotes:
        'NEA licensed hawker stall for 22 years at Maxwell Food Centre. ACRA business registration active. Daily turnover ~S$950 across 160+ micro-transactions. Zero prior fraud, AML, or consumer dispute history.',
      uploadedAt: '2026-10-16T14:20:00+08:00',
    },
    expectedCLS: {
      graphVelocityScore: 282,
      geminiMultimodalScore: 350,
      physicalLivelihoodScore: 250,
      totalScore: 882,
      riskLevel: 'low',
      recommendation: 'lift_hold',
      details: {
        fanInDiversity: '98% (High diversity: 150+ unique diners scanning SGQR daily)',
        dailyTicketConsistency: '99% (Average transaction S$4.50 - S$65.00 catering)',
        holdingDuration: 'Terminal consumer purchase (Zero onward hops / immediate settlement)',
        inventoryConsistency: '97% (Thermal chit line items correspond to Maxwell stall menu)',
        billSequenceIntegrity: 'POS receipt #088 matches Sunmi thermal hardware journal',
        disputeRate: '0.00% (Clean 7-year ACRA / NEA hawker compliance record)',
      },
    },
    expectedGeminiResult: {
      vernacular_translation:
        'Singlish statement translated: Hawkers operating for 22 years at Maxwell FC Stall #28. Order was for 10 boxes steamed chicken rice plus sides for an office worker during peak lunch at 12:34 PM. Total S$48.50 paid via SGQR PayNow. Fresh poultry supplier payment pending on delivery tomorrow.',
      extracted_receipt_amount: 48.5,
      extracted_receipt_time: '2026-10-16T12:34:48+08:00',
      amount_match_boolean: true,
      visual_authenticity_notes:
        'Thermal POS print format authentic to Sunmi hardware; font degradation and paper tear lines are physically consistent. SGQR reference correlates with DBS FAST clearing rail. UEN matches Singapore ACRA business registry with NEA Grade A hygiene certification.',
      ai_evidence_score: 350,
      discrepancy_flags: [],
      regulatory_compliance_memo:
        'Complies with MAS Shared Responsibility Framework (SRF) Annex 3: bona fide F&B merchant safe harbor. No evidence of collusive laundering. Immediate release recommended for DBS Merchant Settlement **3391.',
    },
  },

  // ==========================================
  // SCENARIO 3: RAJESH TRADING (CRIMINAL MULE)
  // ==========================================
  {
    id: 'rajesh-trading',
    name: 'Rajesh Trading Co. (Surat, Gujarat) [CRIMINAL MULE]',
    description: 'High-velocity pass-through shell account attempting to impersonate a hardware wholesaler while laundering proceeds of investment fraud.',
    jurisdiction: 'india',
    transaction: {
      id: 'TXN-IN-2026-10992',
      amount: 48000,
      currency: 'INR',
      timestamp: '2026-10-15T11:20:00+05:30',
      merchantName: 'Rajesh Trading Co.',
      merchantId: 'MERCH-UPI-IN-395002',
      merchantCategory: 'Wholesale Hardware & Building Materials',
      merchantAddress: 'Plot 42, GIDC Industrial Estate, Surat, Gujarat 395002',
      frozenReason: 'NCRP Urgent Multi-Victim Alert #CY-2026-90411 (Layer-1 Immediate Inflow)',
      hopChain: [
        {
          id: 'hop-rt-1',
          label: 'Victims: 7 Senior Citizens (Fake IPO Scheme)',
          type: 'victim',
          amount: 480000,
          timestamp: '2026-10-15T11:18:10+05:30',
          holdDuration: '0s',
          status: 'reported',
          accountNumber: 'Multiple Banks (SBI, ICICI, PNB)',
          routingDetails: 'Coordinated phishing campaign offering pre-IPO allotment shares; victims transferred funds to mule pool',
        },
        {
          id: 'hop-rt-2',
          label: 'Rajesh Trading Co. (Layer-1 Mule Pass-Through)',
          type: 'mule_l1',
          amount: 48000,
          timestamp: '2026-10-15T11:20:00+05:30',
          holdDuration: '110 seconds (Pass-Through Drain)',
          status: 'frozen',
          accountNumber: 'Yes Bank Current A/c **8831',
          routingDetails: 'Credited ₹48,000; 98% forwarded in 110 seconds to crypto OTC dealer wallet; account frozen with remaining balance',
        },
      ],
      jurisdiction: 'india',
      status: 'frozen',
      regulatoryReference: 'NCRP/2026/SRT-CY-90411-L1',
      customerSLADeadline: '2026-11-04T11:20:00+05:30',
      bankSLADeadline: '2026-10-25T11:20:00+05:30',
      layerNumber: 1,
    },
    evidence: {
      voiceStatement:
        "Sir we are doing wholesale business of brass fittings and sanitary pipes. Some customer came and paid cash and UPI advance for bulk order of 2-inch PVC valves. The payment came into our account and we transferred to our manufacturer in Ahmedabad immediately because we don't keep inventory. We don't know who Priya Sharma or other people are. We are honest businessmen. Please unfreeze immediately or we will file writ petition in high court.",
      receiptImage: rajeshReceiptSvg,
      shopPhoto: rajeshShopSvg,
      additionalNotes:
        'Current account opened only 18 days ago. High velocity: 34 credits from distinct states within 48 hours, immediately fanned out to offshore crypto P2P wallets within 2 minutes. Account balance depleted to under ₹500 before freeze caught remaining ₹48,000.',
      uploadedAt: '2026-10-15T18:45:00+05:30',
    },
    expectedCLS: {
      graphVelocityScore: 45,
      geminiMultimodalScore: 35,
      physicalLivelihoodScore: 45,
      totalScore: 125,
      riskLevel: 'critical',
      recommendation: 'permanent_freeze',
      details: {
        fanInDiversity: '8% (Severe anomaly: 34 unrelated individual credits fanned out within 2 minutes)',
        dailyTicketConsistency: '12% (Inconsistent lump sums: ₹48,000, ₹95,000, ₹1,20,000 with zero retail curve)',
        holdingDuration: '110 seconds average holding time (Extreme Velocity Pass-through Signature)',
        inventoryConsistency: '15% (No verified supplier invoices, warehouse inventory, or transport bilties)',
        billSequenceIntegrity: 'Receipt date discrepancy: Bill dated 21 days prior to transaction event',
        disputeRate: '14.2% chargeback/dispute rate (Threshold: > 1.0% triggers automated blacklisting)',
      },
    },
    expectedGeminiResult: {
      vernacular_translation:
        'Evasive Hindi/English statement. Claims wholesale hardware valves sale with rapid manufacturer pass-through. Mentions customer paid advance, but cannot identify counterparty. Aggressively threatens legal action without providing transaction documentation.',
      extracted_receipt_amount: 12000,
      extracted_receipt_time: '2026-09-24T14:30:00+05:30',
      amount_match_boolean: false,
      visual_authenticity_notes:
        'CRITICAL ANOMALY: Submitted receipt is from an entirely different entity ("Shree Ganesh Hardware"), dated 2026-09-24 (21 days prior to freeze transaction). Receipt amount is ₹12,000.00, mismatching ₹48,000.00 credit by ₹36,000.00. Storefront image exhibits signs of synthetic/generic stock photography with blurred entity signboards.',
      ai_evidence_score: 35,
      discrepancy_flags: [
        'SEVERE_AMOUNT_MISMATCH: Invoice shows ₹12,000 vs frozen ₹48,000 (Difference: ₹36,000)',
        'TEMPORAL_INCONSISTENCY: Invoice date (2026-09-24) is 21 days older than transaction event (2026-10-15)',
        'ENTITY_NAME_MISMATCH: Invoice entity "Shree Ganesh Hardware" differs from registered account "Rajesh Trading Co."',
        'VELOCITY_SIGNATURE: Layer-1 rapid drain (98% forwarded in 110s) matches synthetic mule profile',
        'EVASIVE_COUNTERPARTY: Merchant statement fails to provide verifiable buyer identification',
      ],
      regulatory_compliance_memo:
        'FAILS ALL CRITERIA under RBI Master Direction on Fraud Monitoring (Section 7.2) and PMLA 2002. High probability of Mule-as-a-Service (MaaS) node. Recommend permanent account freeze, SAR filing to Financial Intelligence Unit (FIU-IND), and referral to State Cyber Cell.',
    },
  },
];

export const getScenarioById = (id: string): DemoScenario | undefined => {
  return DEMO_SCENARIOS.find((scenario) => scenario.id === id);
};
