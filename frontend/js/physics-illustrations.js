(() => {
    const spriteMarkup = `
        <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" width="0" height="0" style="position:absolute;overflow:hidden;pointer-events:none">
            <defs>
                <linearGradient id="art-metal" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stop-color="var(--warm-white)"/>
                    <stop offset="1" stop-color="var(--soft-surface-alt)"/>
                </linearGradient>
                <linearGradient id="art-accent" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stop-color="var(--accent-bright)"/>
                    <stop offset="1" stop-color="var(--accent-strong)"/>
                </linearGradient>
            </defs>

            <symbol id="measurement" viewBox="0 0 320 210">
                <g fill="none" stroke="var(--art-grid)" stroke-width="1.2">
                    <path d="M28 40h264M28 178h264"/>
                    <circle cx="256" cy="54" r="24" stroke-dasharray="3 5"/>
                    <circle cx="256" cy="54" r="3" fill="var(--art-bright)" stroke="none"/>
                </g>
                <path d="M52 54h22v18h204v28H74v56l-22-18V54z" fill="url(#art-metal)" stroke="var(--art-structure)" stroke-linejoin="round" stroke-width="2"/>
                <g fill="none" stroke="var(--art-tick)" stroke-linecap="round" stroke-width="1.4">
                    <path d="M88 72v14m14-14v9m14-9v14m14-14v9m14-9v14m14-14v9m14-9v14m14-14v9m14-9v14m14-14v9m14-9v14m14-14v9m14-9v14"/>
                </g>
                <circle cx="96" cy="126" r="22" fill="url(#art-accent)" stroke="var(--art-stroke)" stroke-width="2"/>
                <path d="M87 115a14 14 0 0 1 14-3" fill="none" stroke="var(--art-contrast)" stroke-linecap="round" stroke-width="2.2" opacity=".8"/>
                <path d="M118 54h16v14h76v36h-76v52l-16-14V54z" fill="var(--art-plate-alt)" stroke="var(--art-stroke)" stroke-linejoin="round" stroke-width="2"/>
                <rect x="142" y="84" width="56" height="14" rx="2" fill="var(--art-plate)" stroke="var(--art-stroke)" stroke-width="1.4"/>
                <path d="M148 84v10m6-10v7m6-7v10m6-10v7m6-10v10m6-10v7m6-10v10m6-10v7" fill="none" stroke="var(--art-accent)" stroke-width="1.4"/>
                <rect x="164" y="60" width="12" height="8" rx="2" fill="var(--art-deep)" stroke="var(--art-structure)" stroke-width="1.4"/>
                <g fill="none" stroke="var(--art-stroke)" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7">
                    <path d="M74 160v14m44-14v14" stroke-dasharray="2 3"/>
                    <path d="M74 169h44m-44 0 7-4m-7 4 7 4m37-4-7-4m7 4-7 4"/>
                </g>
                <text x="89" y="189" fill="var(--art-label)" font-family="Georgia,serif" font-size="13" font-style="italic" font-weight="700">Δx</text>
            </symbol>

            <symbol id="mechanics" viewBox="0 0 320 210">
                <g fill="none" stroke="var(--art-grid)" stroke-width="1.3">
                    <path d="M26 172h268"/>
                    <path d="M40 70q76-48 164-12" stroke-dasharray="4 5"/>
                    <circle cx="204" cy="58" r="3" fill="var(--art-bright)" stroke="none"/>
                </g>
                <path d="M42 164 218 82l44 22-176 82z" fill="url(#art-metal)" stroke="var(--art-structure)" stroke-linejoin="round" stroke-width="1.8"/>
                <path d="M86 186 262 104v14L86 200z" fill="var(--art-plate-soft)" stroke="var(--art-structure)" stroke-linejoin="round" stroke-width="1.5"/>
                <path d="M42 164 86 186v14l-44-22z" fill="var(--art-plate-alt)" stroke="var(--art-structure)" stroke-linejoin="round" stroke-width="1.5"/>
                <g stroke="var(--art-stroke)" stroke-linejoin="round" stroke-width="1.6">
                    <path d="M112 108 148 91v30l-36 17z" fill="var(--art-deep)"/>
                    <path d="M148 91l28 14v30l-28-14z" fill="var(--art-stroke)"/>
                    <path d="M112 108l36-17 28 14-36 17z" fill="url(#art-accent)"/>
                </g>
                <g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2">
                    <path d="M143 105l-16-42m0 0-2 9m2-9 8 6" stroke="var(--art-bright)"/>
                    <path d="M174 108l54-25m0 0-9-1m9 1-4 8" stroke="var(--art-stroke)"/>
                    <path d="M150 124v52m0 0-5-8m5 8 5-8" stroke="var(--art-stroke)"/>
                    <path d="M112 126l-34 16m0 0 9 1m-9-1 4-8" stroke="var(--art-bright)"/>
                </g>
                <path d="M42 164h42m-12-14a28 28 0 0 1 6 14" fill="none" stroke="var(--art-muted)" stroke-width="1.4"/>
                <g fill="var(--art-label)" font-family="Georgia,serif" font-size="12" font-style="italic" font-weight="700">
                    <text x="115" y="58">N</text>
                    <text x="233" y="84">v</text>
                    <text x="157" y="177">mg</text>
                    <text x="69" y="135">f</text>
                    <text x="86" y="160">θ</text>
                </g>
            </symbol>

            <symbol id="oscillations-waves" viewBox="0 0 320 210">
                <path d="M42 28h128" stroke="var(--art-structure)" stroke-linecap="round" stroke-width="3"/>
                <path d="M106 28v72" stroke="var(--art-grid)" stroke-dasharray="4 4" stroke-width="1.5"/>
                <path d="M64 82a58 58 0 0 0 84 0" fill="none" stroke="var(--art-grid)" stroke-dasharray="3 4" stroke-width="1.5"/>
                <path d="M106 28 68 82" stroke="var(--art-grid)" stroke-dasharray="3 4" stroke-width="1.4"/>
                <circle cx="68" cy="82" r="10" fill="var(--art-plate-soft)" stroke="var(--art-grid)" stroke-width="1.4"/>
                <path d="M106 28l44 52" stroke="var(--art-structure)" stroke-linecap="round" stroke-width="2.2"/>
                <circle cx="106" cy="28" r="4" fill="var(--art-stroke)"/>
                <circle cx="150" cy="80" r="14" fill="url(#art-accent)" stroke="var(--art-stroke)" stroke-width="2"/>
                <text x="169" y="84" fill="var(--art-label)" font-family="Georgia,serif" font-size="12" font-style="italic" font-weight="700">θ</text>
                <path d="M30 150h262" stroke="var(--art-grid)" stroke-width="1.5"/>
                <path d="M40 150c15-36 30-36 45 0s30 36 45 0 30-36 45 0 30 36 45 0 30-36 45 0" fill="none" stroke="var(--art-stroke)" stroke-linecap="round" stroke-width="2.8"/>
                <path d="M62 150v-26m0 0-4 6m4-6 4 6" fill="none" stroke="var(--art-bright)" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"/>
                <text x="68" y="143" fill="var(--art-label)" font-family="Georgia,serif" font-size="11" font-style="italic" font-weight="700">A</text>
                <g fill="none" stroke="var(--art-bright)" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7">
                    <path d="M152 123v-14m90 14v-14" stroke-dasharray="2 3"/>
                    <path d="M152 112h90m-90 0 6-4m-6 4 6 4m84-4-6-4m6 4-6 4"/>
                </g>
                <text x="193" y="106" fill="var(--art-label)" font-family="Georgia,serif" font-size="13" font-style="italic" font-weight="700">λ</text>
            </symbol>

            <symbol id="thermal-physics" viewBox="0 0 320 210">
                <g fill="none" stroke="var(--art-bright)" stroke-linecap="round" stroke-width="2">
                    <path d="M84 190c-7-9 7-13 0-22m30 22c-7-9 7-13 0-22m30 22c-7-9 7-13 0-22"/>
                    <path d="M144 166l-4 6m4-6 4 6" stroke-width="1.6"/>
                </g>
                <text x="160" y="186" fill="var(--art-label)" font-family="Georgia,serif" font-size="12" font-style="italic" font-weight="700">Q</text>
                <path d="M62 56h126v108H62z" fill="url(#art-metal)" stroke="var(--art-structure)" stroke-linejoin="round" stroke-width="2.2"/>
                <rect x="68" y="88" width="114" height="70" fill="var(--art-plate-soft)" opacity=".75"/>
                <rect x="64" y="76" width="122" height="14" rx="2" fill="var(--art-deep)" stroke="var(--art-structure)" stroke-width="1.8"/>
                <path d="M125 32v44" stroke="var(--art-structure)" stroke-linecap="round" stroke-width="5"/>
                <path d="M108 32h34" stroke="var(--art-stroke)" stroke-linecap="round" stroke-width="3"/>
                <path d="M146 42v20m0 0-4-6m4 6 4-6" fill="none" stroke="var(--art-bright)" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"/>
                <g fill="var(--art-stroke)" stroke="var(--art-stroke)" stroke-linecap="round" stroke-width="1.5">
                    <circle cx="92" cy="118" r="4"/><path d="M96 116l13-9m0 0-5 1m5-1-2 5" fill="none"/>
                    <circle cx="136" cy="136" r="4"/><path d="M140 133l12-10m0 0-5 1m5-1-2 5" fill="none"/>
                    <circle cx="158" cy="108" r="4"/><path d="M154 106l-13-7m0 0 3 5m-3-5 5-1" fill="none"/>
                    <circle cx="102" cy="145" r="3.5"/><path d="M105 142l10 8" fill="none"/>
                    <circle cx="164" cy="144" r="3.5"/>
                </g>
                <path d="M242 40a8 8 0 0 1 16 0v96a16 16 0 1 1-16 0V40z" fill="url(#art-metal)" stroke="var(--art-structure)" stroke-width="2"/>
                <circle cx="250" cy="150" r="9" fill="url(#art-accent)" stroke="var(--art-stroke)" stroke-width="1.5"/>
                <path d="M250 72v72" stroke="var(--art-accent)" stroke-linecap="round" stroke-width="5"/>
                <g stroke="var(--art-structure)" stroke-linecap="round" stroke-width="1.4">
                    <path d="M226 52h10m-7 14h7m-10 14h10m-7 14h7m-10 14h10m-7 14h7"/>
                </g>
                <text x="266" y="54" fill="var(--art-label)" font-family="Georgia,serif" font-size="12" font-style="italic" font-weight="700">T</text>
            </symbol>

            <symbol id="gravitational-field" viewBox="0 0 320 210">
                <g fill="none" stroke="var(--art-grid)" stroke-width="1.5">
                    <ellipse cx="152" cy="108" rx="116" ry="50" transform="rotate(-20 152 108)" stroke-dasharray="5 5"/>
                    <ellipse cx="152" cy="108" rx="78" ry="34" transform="rotate(-20 152 108)"/>
                </g>
                <circle cx="152" cy="108" r="38" fill="url(#art-accent)" stroke="var(--art-stroke)" stroke-width="2.2"/>
                <path d="M126 92c14-14 38-15 53-3m-49 38c14 14 37 15 52 2" fill="none" stroke="var(--art-contrast)" stroke-linecap="round" stroke-width="2.5" opacity=".65"/>
                <circle cx="152" cy="108" r="4" fill="var(--art-contrast)"/>
                <g fill="none" stroke="var(--art-stroke)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                    <path d="M62 74l42 15m0 0-8-1m8 1-5 6"/>
                    <path d="M242 142l-42-15m0 0 8 1m-8-1 5-6"/>
                    <path d="M84 164l32-24m0 0-8 1m8-1-3 7"/>
                    <path d="M212 52l-28 22m0 0 8-1m-8 1 2-7"/>
                </g>
                <g transform="translate(242 54) rotate(-20)">
                    <rect x="-12" y="-7" width="24" height="14" rx="2" fill="url(#art-metal)" stroke="var(--art-structure)" stroke-width="1.6"/>
                    <rect x="-26" y="-5" width="12" height="10" rx="1" fill="var(--art-plate-soft)" stroke="var(--art-stroke)" stroke-width="1.3"/>
                    <rect x="14" y="-5" width="12" height="10" rx="1" fill="var(--art-plate-soft)" stroke="var(--art-stroke)" stroke-width="1.3"/>
                    <path d="M-12-11l-22-14m0 0 8 1m-8-1 4 7" fill="none" stroke="var(--art-bright)" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.9"/>
                </g>
                <g fill="var(--art-label)" font-family="Georgia,serif" font-size="12" font-style="italic" font-weight="700">
                    <text x="53" y="67">g</text>
                    <text x="195" y="34">v</text>
                </g>
            </symbol>

            <symbol id="electrostatic-field" viewBox="0 0 320 210">
                <g fill="none" stroke="var(--art-grid)" stroke-dasharray="3 4" stroke-width="1.3">
                    <circle cx="88" cy="105" r="44"/>
                    <circle cx="232" cy="105" r="44"/>
                </g>
                <g fill="none" stroke="var(--art-bright)" stroke-linecap="round" stroke-width="1.9">
                    <path d="M114 105h92"/>
                    <path d="M98 83C126 32 194 32 222 83"/>
                    <path d="M98 127C126 178 194 178 222 127"/>
                    <path d="M108 90c26-26 78-26 104 0"/>
                    <path d="M108 120c26 26 78 26 104 0"/>
                    <path d="M64 90C44 74 34 58 28 42"/>
                    <path d="M64 120C44 136 34 152 28 168"/>
                    <path d="M256 90c20-16 30-32 36-48"/>
                    <path d="M256 120c20 16 30 32 36 48"/>
                </g>
                <g fill="none" stroke="var(--art-stroke)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                    <path d="M156 105h10m0 0-6-4m6 4-6 4"/>
                    <path d="M155 45h10m0 0-6-4m6 4-6 4"/>
                    <path d="M155 165h10m0 0-6-4m6 4-6 4"/>
                    <path d="M155 71h10m0 0-6-4m6 4-6 4"/>
                    <path d="M155 139h10m0 0-6-4m6 4-6 4"/>
                </g>
                <circle cx="88" cy="105" r="26" fill="url(#art-accent)" stroke="var(--art-stroke)" stroke-width="2.2"/>
                <circle cx="232" cy="105" r="26" fill="url(#art-metal)" stroke="var(--art-structure)" stroke-width="2.2"/>
                <path d="M77 105h22m-11-11v22" stroke="var(--art-contrast)" stroke-linecap="round" stroke-width="3.6"/>
                <path d="M221 105h22" stroke="var(--art-stroke)" stroke-linecap="round" stroke-width="3.6"/>
                <g fill="var(--art-label)" font-family="Georgia,serif" font-size="12" font-style="italic" font-weight="700">
                    <text x="80" y="148">+q</text>
                    <text x="225" y="148">−q</text>
                    <text x="155" y="29">E</text>
                </g>
            </symbol>

            <symbol id="magnetic-field" viewBox="0 0 320 210">
                <g fill="none" stroke="var(--art-bright)" stroke-linecap="round" stroke-width="1.9">
                    <path d="M74 108C74 28 246 28 246 108"/>
                    <path d="M88 108C88 50 232 50 232 108"/>
                    <path d="M74 128C74 196 246 196 246 128"/>
                    <path d="M88 128C88 176 232 176 232 128"/>
                </g>
                <g fill="none" stroke="var(--art-stroke)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                    <path d="M155 48h10m0 0-6-4m6 4-6 4"/>
                    <path d="M155 65h10m0 0-6-4m6 4-6 4"/>
                    <path d="M155 178h10m0 0-6-4m6 4-6 4"/>
                </g>
                <path d="M74 100h86v36H74a6 6 0 0 1-6-6v-24a6 6 0 0 1 6-6z" fill="url(#art-accent)" stroke="var(--art-stroke)" stroke-width="2"/>
                <path d="M160 100h86a6 6 0 0 1 6 6v24a6 6 0 0 1-6 6h-86z" fill="var(--art-deep)" stroke="var(--art-structure)" stroke-width="2"/>
                <text x="104" y="124" fill="var(--art-contrast)" font-family="Arial,sans-serif" font-size="16" font-weight="800">N</text>
                <text x="198" y="124" fill="var(--art-contrast)" font-family="Arial,sans-serif" font-size="16" font-weight="800">S</text>
                <circle cx="160" cy="30" r="16" fill="url(#art-metal)" stroke="var(--art-structure)" stroke-width="1.8"/>
                <path d="M151 30l9-4v8z" fill="var(--art-plate-soft)" stroke="var(--art-structure)" stroke-width="1"/>
                <path d="M169 30l-9-4v8z" fill="var(--art-accent)" stroke="var(--art-stroke)" stroke-width="1"/>
                <circle cx="160" cy="30" r="2" fill="var(--art-structure)"/>
                <text x="260" y="64" fill="var(--art-label)" font-family="Georgia,serif" font-size="12" font-style="italic" font-weight="700">B</text>
            </symbol>

            <symbol id="current-electricity" viewBox="0 0 320 210">
                <g fill="none" stroke="var(--art-structure)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.4">
                    <path d="M60 56h72m20 0h108v100h-46m-108 0H60V56"/>
                    <path d="M96 156v32h38m52 0h38v-32" stroke-width="1.8"/>
                </g>
                <path d="M132 41v30" stroke="var(--art-stroke)" stroke-linecap="round" stroke-width="2.6"/>
                <path d="M144 48v16" stroke="var(--art-structure)" stroke-linecap="round" stroke-width="4"/>
                <text x="120" y="39" fill="var(--art-label)" font-family="Arial,sans-serif" font-size="11" font-weight="800">+</text>
                <path d="M106 156h12l6-11 10 22 10-22 10 22 10-22 10 22 6-11h34" fill="none" stroke="var(--art-stroke)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"/>
                <text x="155" y="137" fill="var(--art-label)" font-family="Georgia,serif" font-size="12" font-style="italic" font-weight="700">R</text>
                <circle cx="260" cy="106" r="20" fill="url(#art-metal)" stroke="var(--art-stroke)" stroke-width="2.2"/>
                <text x="254" y="112" fill="var(--art-tick)" font-family="Georgia,serif" font-size="16" font-weight="700">A</text>
                <circle cx="160" cy="188" r="16" fill="url(#art-metal)" stroke="var(--art-stroke)" stroke-width="2"/>
                <text x="154" y="193" fill="var(--art-tick)" font-family="Georgia,serif" font-size="14" font-weight="700">V</text>
                <g fill="none" stroke="var(--art-bright)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.1">
                    <path d="M192 56h28m0 0-6-4m6 4-6 4"/>
                    <path d="M60 116V88m0 0-4 6m4-6 4 6"/>
                </g>
                <text x="200" y="45" fill="var(--art-label)" font-family="Georgia,serif" font-size="12" font-style="italic" font-weight="700">I</text>
            </symbol>

            <symbol id="electronics" viewBox="0 0 320 210">
                <g fill="none" stroke="var(--art-grid)" stroke-linecap="round" stroke-width="1.5">
                    <path d="M26 76h58m-58 58h58m152-29h58"/>
                    <circle cx="26" cy="76" r="3.5" fill="var(--art-bright)" stroke="none"/>
                    <circle cx="26" cy="134" r="3.5" fill="var(--art-bright)" stroke="none"/>
                    <circle cx="294" cy="105" r="3.5" fill="var(--art-bright)" stroke="none"/>
                </g>
                <path d="M28 52c8-16 16-16 24 0s16 16 24 0" fill="none" stroke="var(--art-bright)" stroke-linecap="round" stroke-width="2.2"/>
                <rect x="84" y="48" width="152" height="114" rx="8" fill="url(#art-metal)" stroke="var(--art-structure)" stroke-width="2"/>
                <path d="M114 68v74l72-37z" fill="url(#art-accent)" stroke="var(--art-stroke)" stroke-linejoin="round" stroke-width="2.2"/>
                <path d="M124 91h12m-6-6v12m-6 23h12" stroke="var(--art-contrast)" stroke-linecap="round" stroke-width="2.2"/>
                <path d="M198 92l18 13-18 13z" fill="var(--art-plate-soft)" stroke="var(--art-stroke)" stroke-linejoin="round" stroke-width="1.8"/>
                <path d="M216 90v30" stroke="var(--art-structure)" stroke-linecap="round" stroke-width="2.6"/>
                <path d="M244 82c7-18 15-18 22 0 7-18 15-18 22 0" fill="none" stroke="var(--art-stroke)" stroke-linecap="round" stroke-width="2.4"/>
                <path d="M242 82h48" stroke="var(--art-grid)" stroke-width="1.2"/>
                <text x="252" y="128" fill="var(--art-label)" font-family="Georgia,serif" font-size="12" font-style="italic" font-weight="700">Vout</text>
            </symbol>

            <symbol id="mechanical-properties" viewBox="0 0 320 210">
                <path d="M44 30h80" stroke="var(--art-structure)" stroke-linecap="round" stroke-width="3"/>
                <path d="M84 30v14l-14 6 28 10-28 10 28 10-28 10 28 10-14 6v14" fill="none" stroke="var(--art-stroke)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.4"/>
                <rect x="64" y="120" width="40" height="28" rx="4" fill="url(#art-accent)" stroke="var(--art-stroke)" stroke-width="2"/>
                <path d="M84 152v28m0 0-5-7m5 7 5-7" fill="none" stroke="var(--art-stroke)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.1"/>
                <path d="M48 48h-7v68h7" fill="none" stroke="var(--art-muted)" stroke-width="1.4"/>
                <text x="19" y="86" fill="var(--art-label)" font-family="Georgia,serif" font-size="12" font-style="italic" font-weight="700">ΔL</text>
                <text x="94" y="177" fill="var(--art-label)" font-family="Georgia,serif" font-size="12" font-style="italic" font-weight="700">F</text>
                <path d="M174 44v96a42 42 0 0 0 84 0V70" fill="none" stroke="var(--art-structure)" stroke-linecap="round" stroke-width="18" opacity=".2"/>
                <path d="M165 44v96a51 51 0 0 0 102 0V70M183 44v96a33 33 0 0 0 66 0V70" fill="none" stroke="var(--art-structure)" stroke-linecap="round" stroke-width="2"/>
                <path d="M174 106v34a42 42 0 0 0 84 0V82" fill="none" stroke="var(--art-accent)" stroke-linecap="round" stroke-width="12" opacity=".88"/>
                <g fill="none" stroke="var(--art-bright)" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6">
                    <path d="M276 82v24m0-24-4 5m4-5 4 5m-4 19-4-5m4 5 4-5"/>
                    <path d="M250 82h28m-108 24h108" stroke-dasharray="2 3" stroke="var(--art-grid)"/>
                </g>
                <text x="284" y="98" fill="var(--art-label)" font-family="Georgia,serif" font-size="12" font-style="italic" font-weight="700">h</text>
            </symbol>

            <symbol id="matter-radiation" viewBox="0 0 320 210">
                <g fill="none" stroke="var(--art-bright)" stroke-width="1.6">
                    <ellipse cx="132" cy="108" rx="76" ry="30" transform="rotate(-28 132 108)"/>
                    <ellipse cx="132" cy="108" rx="76" ry="30" transform="rotate(32 132 108)"/>
                    <ellipse cx="132" cy="108" rx="76" ry="30" transform="rotate(90 132 108)"/>
                </g>
                <circle cx="132" cy="108" r="20" fill="var(--art-deep)" stroke="var(--art-stroke)" stroke-width="2"/>
                <circle cx="126" cy="102" r="5" fill="var(--art-bright)"/>
                <circle cx="138" cy="112" r="5" fill="var(--art-contrast)"/>
                <circle cx="127" cy="115" r="4" fill="var(--art-accent)"/>
                <circle cx="138" cy="100" r="4" fill="var(--art-bright)"/>
                <g fill="var(--art-stroke)" stroke="var(--art-contrast)" stroke-width="1.5">
                    <circle cx="66" cy="72" r="5.5"/>
                    <circle cx="196" cy="68" r="5.5"/>
                    <circle cx="164" cy="176" r="5.5"/>
                </g>
                <path d="M26 36c8-8 14 8 22 0s14 8 22 0l14 14" fill="none" stroke="var(--art-stroke)" stroke-linecap="round" stroke-width="2"/>
                <path d="M84 50l-8-2m8 2-2-8" fill="none" stroke="var(--art-stroke)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                <text x="34" y="25" fill="var(--art-label)" font-family="Georgia,serif" font-size="12" font-style="italic" font-weight="700">hν</text>
                <path d="M199 66l64-24m0 0-9-1m9 1-4 8" fill="none" stroke="var(--art-stroke)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2"/>
                <text x="266" y="42" fill="var(--art-label)" font-family="Georgia,serif" font-size="12" font-style="italic" font-weight="700">e⁻</text>
                <path d="M224 152c6-12 12 12 18 0s12 12 18 0h20m0 0-6-4m6 4-6 4" fill="none" stroke="var(--art-bright)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                <text x="242" y="176" fill="var(--art-label)" font-family="Georgia,serif" font-size="12" font-style="italic" font-weight="700">α, β, γ</text>
            </symbol>
        </svg>`;

    if (!document.querySelector("#physics-lesson-artwork-sprite")) {
        const container = document.createElement("div");
        container.innerHTML = spriteMarkup.trim();
        const sprite = container.firstElementChild;
        if (sprite) {
            sprite.id = "physics-lesson-artwork-sprite";
            document.body.prepend(sprite);
        }
    }
})();
