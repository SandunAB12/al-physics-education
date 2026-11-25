(() => {
    const artwork = `
        <svg class="theme-botanical-art" viewBox="0 0 360 280" aria-hidden="true" focusable="false">
            <defs>
                <symbol id="botanical-leaf" viewBox="0 0 80 52">
                    <path d="M6 42C16 9 47 2 74 7 68 35 40 51 6 42Z" fill="currentColor" fill-opacity=".14" stroke="currentColor" stroke-width="2"></path>
                    <path d="M9 42Q39 29 70 9" fill="none" stroke="currentColor" stroke-width="1.5"></path>
                </symbol>
                <symbol id="botanical-bloom" viewBox="0 0 72 72">
                    <g fill="currentColor" fill-opacity=".14" stroke="currentColor" stroke-width="1.8">
                        <ellipse cx="36" cy="17" rx="8" ry="15"></ellipse>
                        <ellipse cx="36" cy="17" rx="8" ry="15" transform="rotate(72 36 36)"></ellipse>
                        <ellipse cx="36" cy="17" rx="8" ry="15" transform="rotate(144 36 36)"></ellipse>
                        <ellipse cx="36" cy="17" rx="8" ry="15" transform="rotate(216 36 36)"></ellipse>
                        <ellipse cx="36" cy="17" rx="8" ry="15" transform="rotate(288 36 36)"></ellipse>
                    </g>
                    <circle cx="36" cy="36" r="6" fill="currentColor"></circle>
                </symbol>
                <symbol id="botanical-lavender" viewBox="0 0 50 130">
                    <path d="M25 126Q25 72 27 9" fill="none" stroke="currentColor" stroke-width="2"></path>
                    <g fill="currentColor" fill-opacity=".22" stroke="currentColor" stroke-width="1.4">
                        <ellipse cx="20" cy="22" rx="5" ry="9" transform="rotate(-35 20 22)"></ellipse>
                        <ellipse cx="31" cy="32" rx="5" ry="9" transform="rotate(35 31 32)"></ellipse>
                        <ellipse cx="19" cy="43" rx="5" ry="9" transform="rotate(-35 19 43)"></ellipse>
                        <ellipse cx="31" cy="54" rx="5" ry="9" transform="rotate(35 31 54)"></ellipse>
                        <ellipse cx="19" cy="65" rx="5" ry="9" transform="rotate(-35 19 65)"></ellipse>
                    </g>
                    <path d="M25 94q-15-12-19-4 8 13 19 10M26 108q14-12 20-5-8 13-20 11" fill="currentColor" fill-opacity=".12" stroke="currentColor" stroke-width="1.5"></path>
                </symbol>
                <symbol id="botanical-butterfly" viewBox="0 0 72 62">
                    <path d="M35 29C19 2 3 8 8 23c3 9 14 12 25 10C18 36 14 53 24 55c7 1 11-9 12-18 2 9 6 19 13 18 10-2 6-19-9-22 11 2 22-1 25-10 5-15-11-21-27 6Z" fill="currentColor" fill-opacity=".14" stroke="currentColor" stroke-width="2"></path>
                    <path d="M36 25v25M34 25l-6-8M38 25l6-8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                </symbol>
                <symbol id="botanical-snowflake" viewBox="0 0 72 72">
                    <g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M36 5v62M9 20l54 32M9 52l54-32"></path>
                        <path d="m29 13 7 7 7-7M29 59l7-7 7 7M15 30l10-2-2-10M57 42l-10 2 2 10M15 42l10 2-2 10M57 30l-10-2 2-10"></path>
                    </g>
                </symbol>
                <symbol id="botanical-sun" viewBox="0 0 84 84">
                    <g fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="42" cy="42" r="17" fill="currentColor" fill-opacity=".14"></circle>
                        <path d="M42 3v13M42 68v13M3 42h13M68 42h13M14 14l10 10M60 60l10 10M70 14 60 24M24 60 14 70"></path>
                    </g>
                </symbol>
                <symbol id="botanical-wave" viewBox="0 0 120 48">
                    <path d="M2 25q15-22 30 0t30 0 30 0 26 0M2 42q15-22 30 0t30 0 30 0 26 0" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"></path>
                </symbol>
                <symbol id="botanical-berry" viewBox="0 0 72 72">
                    <g fill="currentColor" fill-opacity=".2" stroke="currentColor" stroke-width="1.8">
                        <circle cx="25" cy="39" r="12"></circle>
                        <circle cx="45" cy="39" r="12"></circle>
                        <circle cx="35" cy="55" r="12"></circle>
                    </g>
                    <path d="M34 29q-2-13 8-20M34 30q-12-9-19-3 6 10 18 8" fill="none" stroke="currentColor" stroke-width="2"></path>
                </symbol>
                <symbol id="botanical-crescent" viewBox="0 0 72 72">
                    <path d="M48 9A29 29 0 1 0 63 50 25 25 0 0 1 48 9Z" fill="currentColor" fill-opacity=".15" stroke="currentColor" stroke-width="2"></path>
                </symbol>
                <symbol id="botanical-avocado" viewBox="0 0 76 100">
                    <path d="M38 4C26 4 22 22 13 40 2 63 11 91 38 96c27-5 36-33 25-56C54 22 50 4 38 4Z" fill="currentColor" fill-opacity=".12" stroke="currentColor" stroke-width="2.2"></path>
                    <circle cx="38" cy="66" r="13" fill="currentColor" fill-opacity=".22" stroke="currentColor" stroke-width="1.8"></circle>
                    <path d="M38 15q-2 18 0 34" fill="none" stroke="currentColor" stroke-width="1.6"></path>
                </symbol>
                <symbol id="botanical-coffee-bean" viewBox="0 0 54 72">
                    <path d="M27 5C7 8 4 27 10 46c5 17 20 24 34 14 13-10 9-30 3-43C42 8 35 4 27 5Z" fill="currentColor" fill-opacity=".14" stroke="currentColor" stroke-width="2"></path>
                    <path d="M37 9Q13 34 22 66" fill="none" stroke="currentColor" stroke-width="2"></path>
                </symbol>
                <symbol id="botanical-iris" viewBox="0 0 88 100">
                    <path d="M43 57C17 45 12 21 24 12c12 5 18 18 20 34C42 24 52 7 66 8c9 12 1 35-20 49 17-11 34-8 37 5-10 13-27 13-39 1-13 12-31 11-38-2 4-13 20-16 37-4Z" fill="currentColor" fill-opacity=".14" stroke="currentColor" stroke-width="2"></path>
                    <path d="M44 60q-2 20-2 37M42 78q-17-13-25-5M43 84q16-14 25-7" fill="none" stroke="currentColor" stroke-width="2"></path>
                </symbol>
                <symbol id="botanical-star" viewBox="0 0 72 72">
                    <path d="m36 4 8 22 23 1-18 14 7 23-20-13-20 13 7-23L5 27l23-1z" fill="currentColor" fill-opacity=".15" stroke="currentColor" stroke-width="2" stroke-linejoin="round"></path>
                </symbol>
            </defs>
            <g class="theme-motif motif-pink-blossom">
                <path class="flora-line flora-main" d="M26 250Q104 201 143 140T285 25"></path>
                <use href="#botanical-bloom" x="85" y="160" width="70" height="70" class="flora-alt"></use>
                <use href="#botanical-bloom" x="202" y="64" width="58" height="58" class="flora-main"></use>
                <use href="#botanical-leaf" x="36" y="192" width="72" height="48" transform="rotate(-26 72 216)" class="flora-soft"></use>
                <use href="#botanical-leaf" x="153" y="110" width="68" height="44" transform="rotate(20 187 132)" class="flora-main"></use>
                <use href="#botanical-bloom" x="275" y="12" width="42" height="42" class="flora-soft"></use>
            </g>
            <g class="theme-motif motif-lavender-dream">
                <use href="#botanical-lavender" x="70" y="88" width="50" height="150" class="flora-main"></use>
                <use href="#botanical-lavender" x="130" y="47" width="58" height="190" class="flora-alt"></use>
                <use href="#botanical-lavender" x="198" y="72" width="50" height="164" class="flora-soft"></use>
                <use href="#botanical-lavender" x="255" y="106" width="44" height="132" class="flora-main"></use>
                <path class="flora-line flora-soft" d="M47 240q105 20 265-2"></path>
            </g>
            <g class="theme-motif motif-peach-glow">
                <path class="flora-line flora-main" d="M73 221Q147 166 221 103t76-65"></path>
                <circle cx="132" cy="158" r="36" fill="currentColor" class="flora-soft" opacity=".8"></circle>
                <path d="M132 123q-22 30 0 70M129 124q15-21 36-16-9 18-34 22" fill="none" stroke="currentColor" stroke-width="2" class="flora-main"></path>
                <circle cx="237" cy="76" r="29" fill="currentColor" class="flora-alt" opacity=".65"></circle>
                <path d="M237 48q-18 24 0 56M235 50q13-19 31-13-8 15-29 19" fill="none" stroke="currentColor" stroke-width="2" class="flora-main"></path>
                <use href="#botanical-leaf" x="47" y="177" width="72" height="46" transform="rotate(-20 83 200)" class="flora-main"></use>
                <use href="#botanical-leaf" x="255" y="32" width="66" height="44" transform="rotate(25 288 54)" class="flora-soft"></use>
            </g>
            <g class="theme-motif motif-cherry-blossom">
                <path class="flora-line flora-main" d="M45 233Q109 176 135 118T290 36M136 120q-38-30-62-53M186 87q36-29 73-25"></path>
                <use href="#botanical-bloom" x="48" y="39" width="54" height="54" class="flora-soft"></use>
                <use href="#botanical-bloom" x="112" y="91" width="67" height="67" class="flora-main"></use>
                <use href="#botanical-bloom" x="238" y="37" width="56" height="56" class="flora-alt"></use>
                <path d="M195 144q-13 9-8 23 13-4 14-17M236 162q-14 4-13 19 14 0 19-13M72 126q-11 7-7 19 12-3 14-14" fill="currentColor" class="flora-soft" opacity=".7"></path>
            </g>
            <g class="theme-motif motif-arctic-blue">
                <use href="#botanical-snowflake" x="55" y="75" width="112" height="112" class="flora-main"></use>
                <use href="#botanical-snowflake" x="192" y="24" width="74" height="74" class="flora-alt"></use>
                <use href="#botanical-snowflake" x="210" y="152" width="58" height="58" class="flora-soft"></use>
                <path class="flora-line flora-main" d="m53 219 22-22 22 22-22 22zM280 126l16-16 16 16-16 16z"></path>
            </g>
            <g class="theme-motif motif-hot-pink-pop">
                <use href="#botanical-bloom" x="104" y="79" width="138" height="138" class="flora-main"></use>
                <use href="#botanical-butterfly" x="247" y="48" width="72" height="62" class="flora-alt"></use>
                <use href="#botanical-star" x="43" y="68" width="38" height="38" class="flora-soft"></use>
                <use href="#botanical-star" x="265" y="166" width="34" height="34" class="flora-main"></use>
                <circle cx="74" cy="172" r="5" fill="currentColor" class="flora-alt"></circle>
                <circle cx="304" cy="124" r="4" fill="currentColor" class="flora-soft"></circle>
            </g>
            <g class="theme-motif motif-electric-ocean">
                <use href="#botanical-wave" x="37" y="179" width="286" height="70" class="flora-main"></use>
                <path class="flora-line flora-alt" d="M111 206q-8-64 4-130m-3 75q-23-18-28-39m31 18q23-19 26-40M226 196q-6-54 2-111m-1 68q-19-18-23-34m24 19q18-17 22-36"></path>
                <use href="#botanical-leaf" x="72" y="64" width="44" height="28" transform="rotate(18 94 78)" class="flora-soft"></use>
                <use href="#botanical-leaf" x="235" y="75" width="43" height="28" transform="rotate(-18 256 89)" class="flora-main"></use>
                <circle cx="68" cy="117" r="5" fill="currentColor" class="flora-alt"></circle>
                <circle cx="290" cy="101" r="4" fill="currentColor" class="flora-soft"></circle>
            </g>
            <g class="theme-motif motif-sunset-fire">
                <use href="#botanical-sun" x="140" y="50" width="112" height="112" class="flora-main"></use>
                <path d="M75 227q31-26 20-61 34 18 35 53 11-25 34-37-4 55-48 72-22-3-41-27ZM252 225q25-20 17-48 29 16 29 42 10-19 29-29-3 45-40 59-18-2-35-24Z" fill="currentColor" fill-opacity=".12" stroke="currentColor" stroke-width="2" class="flora-alt"></path>
                <use href="#botanical-leaf" x="34" y="192" width="62" height="40" transform="rotate(-22 65 212)" class="flora-soft"></use>
                <use href="#botanical-leaf" x="276" y="182" width="58" height="38" transform="rotate(25 305 201)" class="flora-main"></use>
            </g>
            <g class="theme-motif motif-royal-violet">
                <use href="#botanical-iris" x="43" y="53" width="104" height="132" class="flora-main"></use>
                <use href="#botanical-iris" x="174" y="83" width="96" height="116" class="flora-alt"></use>
                <path class="flora-line flora-soft" d="M92 181q5 38 2 65m123-53q-7 29-3 53"></path>
                <use href="#botanical-leaf" x="76" y="207" width="67" height="43" transform="rotate(-18 109 228)" class="flora-main"></use>
                <use href="#botanical-leaf" x="186" y="212" width="67" height="43" transform="rotate(18 220 234)" class="flora-soft"></use>
            </g>
            <g class="theme-motif motif-midnight-blue">
                <use href="#botanical-crescent" x="168" y="27" width="112" height="112" class="flora-main"></use>
                <use href="#botanical-star" x="82" y="45" width="26" height="26" class="flora-soft"></use>
                <use href="#botanical-star" x="286" y="82" width="22" height="22" class="flora-alt"></use>
                <path class="flora-line flora-alt" d="M63 238q74-48 83-119m-52 90q-27-5-38-25m56 2q22-18 25-39M269 236q-12-27-9-57"></path>
                <use href="#botanical-leaf" x="45" y="167" width="55" height="36" transform="rotate(10 72 185)" class="flora-main"></use>
                <use href="#botanical-leaf" x="121" y="112" width="51" height="33" transform="rotate(-18 146 129)" class="flora-soft"></use>
                <circle cx="130" cy="63" r="3" fill="currentColor" class="flora-main"></circle>
                <circle cx="310" cy="145" r="3" fill="currentColor" class="flora-soft"></circle>
            </g>
            <g class="theme-motif motif-avocado-fresh">
                <use href="#botanical-avocado" x="103" y="72" width="88" height="120" class="flora-main"></use>
                <use href="#botanical-avocado" x="195" y="111" width="65" height="88" class="flora-soft"></use>
                <use href="#botanical-leaf" x="45" y="122" width="72" height="46" transform="rotate(-24 81 145)" class="flora-alt"></use>
                <use href="#botanical-leaf" x="233" y="46" width="70" height="45" transform="rotate(18 268 68)" class="flora-main"></use>
                <path class="flora-line flora-soft" d="M84 231q92 20 190-8"></path>
            </g>
            <g class="theme-motif motif-forest-luxe">
                <path class="flora-line flora-main" d="M166 250Q160 158 85 43M163 220Q219 142 288 63"></path>
                <use href="#botanical-leaf" x="61" y="61" width="66" height="42" transform="rotate(25 94 82)" class="flora-soft"></use>
                <use href="#botanical-leaf" x="88" y="103" width="69" height="44" transform="rotate(-18 122 125)" class="flora-main"></use>
                <use href="#botanical-leaf" x="112" y="147" width="68" height="44" transform="rotate(22 146 169)" class="flora-alt"></use>
                <use href="#botanical-leaf" x="202" y="78" width="67" height="43" transform="rotate(-20 235 99)" class="flora-main"></use>
                <use href="#botanical-leaf" x="178" y="128" width="68" height="44" transform="rotate(19 212 150)" class="flora-soft"></use>
                <use href="#botanical-leaf" x="151" y="177" width="66" height="43" transform="rotate(-14 184 198)" class="flora-alt"></use>
            </g>
            <g class="theme-motif motif-emerald-green">
                <path class="flora-line flora-main" d="M42 218Q154 146 300 48"></path>
                <use href="#botanical-leaf" x="74" y="163" width="74" height="48" transform="rotate(-24 111 187)" class="flora-soft"></use>
                <use href="#botanical-leaf" x="99" y="126" width="70" height="45" transform="rotate(22 134 148)" class="flora-main"></use>
                <use href="#botanical-leaf" x="155" y="109" width="75" height="48" transform="rotate(-22 192 133)" class="flora-alt"></use>
                <use href="#botanical-leaf" x="188" y="72" width="70" height="45" transform="rotate(22 223 94)" class="flora-soft"></use>
                <use href="#botanical-leaf" x="244" y="44" width="69" height="44" transform="rotate(-16 278 66)" class="flora-main"></use>
            </g>
            <g class="theme-motif motif-mint-energy">
                <use href="#botanical-leaf" x="105" y="71" width="92" height="60" transform="rotate(-48 151 101)" class="flora-main"></use>
                <use href="#botanical-leaf" x="159" y="76" width="94" height="61" transform="rotate(42 206 106)" class="flora-soft"></use>
                <use href="#botanical-leaf" x="91" y="135" width="88" height="57" transform="rotate(-18 135 163)" class="flora-alt"></use>
                <use href="#botanical-leaf" x="183" y="137" width="87" height="56" transform="rotate(18 226 165)" class="flora-main"></use>
                <path class="flora-line flora-soft" d="M163 233q-8-47 8-82m-5 42q-21-14-31-30m30 7q22-13 30-28"></path>
                <circle cx="77" cy="77" r="4" fill="currentColor" class="flora-main"></circle>
                <circle cx="286" cy="198" r="4" fill="currentColor" class="flora-soft"></circle>
            </g>
            <g class="theme-motif motif-sunshine">
                <use href="#botanical-sun" x="111" y="49" width="136" height="136" class="flora-main"></use>
                <use href="#botanical-bloom" x="138" y="78" width="84" height="84" class="flora-soft"></use>
                <path class="flora-line flora-alt" d="M179 179q-3 32-2 61m-2-23q-23-18-41-9m42-2q19-19 37-15"></path>
                <use href="#botanical-leaf" x="102" y="200" width="68" height="44" transform="rotate(-18 136 222)" class="flora-main"></use>
                <use href="#botanical-leaf" x="185" y="198" width="68" height="44" transform="rotate(18 219 220)" class="flora-soft"></use>
            </g>
            <g class="theme-motif motif-royal-navy">
                <use href="#botanical-star" x="128" y="63" width="104" height="104" class="flora-main"></use>
                <circle cx="180" cy="115" r="21" fill="none" stroke="currentColor" stroke-width="2" class="flora-soft"></circle>
                <path class="flora-line flora-alt" d="M180 169q-2 34-3 67M177 204q-28-20-49-12m50-3q24-18 47-14"></path>
                <use href="#botanical-leaf" x="97" y="179" width="64" height="41" transform="rotate(-18 129 199)" class="flora-main"></use>
                <use href="#botanical-leaf" x="197" y="173" width="64" height="41" transform="rotate(20 229 193)" class="flora-soft"></use>
                <circle cx="70" cy="74" r="4" fill="currentColor" class="flora-soft"></circle>
                <circle cx="291" cy="202" r="4" fill="currentColor" class="flora-main"></circle>
            </g>
            <g class="theme-motif motif-ocean-breeze">
                <use href="#botanical-wave" x="40" y="198" width="282" height="68" class="flora-main"></use>
                <path class="flora-line flora-soft" d="M116 204q-13-73 7-137m-8 44q-26-12-34-34m39 12q24-17 28-38M235 209q-11-57 9-108m-9 72q-22-11-28-30m36 15q20-16 23-35"></path>
                <use href="#botanical-bloom" x="163" y="54" width="51" height="51" class="flora-alt"></use>
                <path d="M63 128q18-18 36 0-18 19-36 0ZM274 142q17-17 34 0-17 18-34 0Z" fill="currentColor" fill-opacity=".16" stroke="currentColor" stroke-width="1.6" class="flora-soft"></path>
            </g>
            <g class="theme-motif motif-coffee-cream">
                <path class="flora-line flora-main" d="M47 228Q141 157 270 49"></path>
                <use href="#botanical-leaf" x="62" y="158" width="73" height="47" transform="rotate(-25 98 181)" class="flora-soft"></use>
                <use href="#botanical-leaf" x="116" y="124" width="72" height="46" transform="rotate(19 152 147)" class="flora-main"></use>
                <use href="#botanical-leaf" x="178" y="84" width="70" height="45" transform="rotate(-20 213 106)" class="flora-alt"></use>
                <use href="#botanical-coffee-bean" x="128" y="169" width="31" height="43" transform="rotate(-24 144 190)" class="flora-main"></use>
                <use href="#botanical-coffee-bean" x="234" y="83" width="28" height="38" transform="rotate(23 248 102)" class="flora-soft"></use>
                <use href="#botanical-berry" x="245" y="36" width="49" height="49" class="flora-alt"></use>
            </g>
            <g class="theme-motif motif-royal-purple">
                <path class="flora-line flora-main" d="M92 28q-12 83 4 217m87-236q-9 111 3 237m81-198q-8 91 3 181"></path>
                <use href="#botanical-lavender" x="47" y="42" width="49" height="135" class="flora-soft"></use>
                <use href="#botanical-lavender" x="77" y="94" width="49" height="134" class="flora-main"></use>
                <use href="#botanical-lavender" x="148" y="27" width="52" height="150" class="flora-alt"></use>
                <use href="#botanical-lavender" x="177" y="85" width="52" height="145" class="flora-soft"></use>
                <use href="#botanical-lavender" x="245" y="60" width="48" height="140" class="flora-main"></use>
                <use href="#botanical-lavender" x="269" y="119" width="44" height="122" class="flora-alt"></use>
            </g>
        </svg>`;

    if (!document.querySelector(".theme-page-art")) {
        const pageArt = document.createElement("div");
        pageArt.className = "theme-page-art";
        pageArt.setAttribute("aria-hidden", "true");
        pageArt.innerHTML = artwork;
        document.body.prepend(pageArt);
    }
})();
