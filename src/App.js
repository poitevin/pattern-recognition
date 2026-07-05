import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import "./App.css";
import airportData from "./airportData.json";
import linesData from "./linesData.json";

// Toggle this off to disable fade transition between poem and codes.
const ENABLE_FADE_TRANSITION = true;
const FADE_OUT_DURATION = 220; // milliseconds
const FADE_IN_DURATION = 260; // milliseconds

const airportCodes = `PAT-TER-NRE-COG-NIT-ION

THE-GLA-SSI-SBL-URR-YST-REA-KED-BEL-OWA-GLA-CIA-LLI-NEU-NCO-ILS
INT-OAN-END-LES-SFJ-ORD-IWA-TCH-APL-UME-ASC-END
FRO-MAF-ACT-ORY-TOW-ARD-THE-TUR-NIN-GNI-MBI

IRE-STM-YHE-ADA-GAI-NST-THE-RIM-AND-PIC-TUR-ETH-ECA-RBO-NLI-NEC-AST-BEH-IND
CHA-RCO-ALM-IST-THI-NNI-NGA-FAI-NTT-RAC-ING-CON-TRA-ILS
FRA-CTU-REI-NTO-ROR-SCH-ACH-BLO-OMS

MYO-WNS-TRA-NGE-SMU-DGE-MYF-ATH-ERS-PIP-EWO-ULD-ALS-ODR-EAM-UPL-OSS
DIS-SIP-ATE-SAS-TUR-BUL-ENC-ETH-ICK-ENS-MET-ALL-ICT-AST-ESW-ELL-ING
MEM-ORY-SCO-MPA-SSF-REE-INM-YMO-UTH

BER-LIN-IWA-SBA-REL-YEI-GHT-LAM-PSG-LAZ-ING-THE-STA-IRS
ILE-ARN-EDE-XIL-EST-EXT-URE-COU-NTI-NGS-TAT-ION-SLI-KEC-AND-IES
JOT-TIN-GHA-SHE-SIN-ANU-NDE-RGR-OUN-DLE-DGE-RIB-ELI-EVE-DIN

THE-REC-ORD-ONL-YIW-OUL-DCA-RET-OTR-ACK-SOM-EKI-DCA-LLE-DME-AUS-LAN-DER
AND-EVE-NIF-IHA-DNO-GER-MAN-STI-LLI-ROD-ETH-EGE-OME-TRI-CUB-AHN
COL-LEC-TIN-GST-ATI-ONS-ACH-ILD-SAT-TEM-PTA-TAH-OME

THE-CAB-INH-UMS-AMU-RMU-ROF-VOI-CES-SPA-NIS-HMI-NGL-ING-WIT-HMA-NDA-RIN
EAR-BUD-SLE-AKI-NGB-RAZ-ILI-ANF-UNK-FAR-OFF-ANI-CES-HEL-FTE-ARS-CON-DEN-SAT-ION
RIN-GSS-HIM-MER-UND-ERN-EAT-HMY-CUP-MIM-ICK-ING-MEL-TWA-TER

AWA-RNI-NGI-IGN-ORE-IRE-MEM-BER-MYL-AST-OBS-ESS-ION-TEM-PEL-HOF
THE-STA-TIO-NIN-EVE-RCR-OSS-EDO-FFT-HEL-IST-THE-PIE-CEH-IDI-NGO-UTO-FSI-GHT
MAY-BEU-NDE-RMY-BED-MOR-EPA-LPA-BLE-INA-BSE-NCE-THA-NAL-LOT-HER-PIE-CES

IST-ILL-SEA-RCH-FOR-AMI-SSI-NGS-IGN
EVE-NTO-DAY-ASE-XIL-EWR-ITE-SAN-OTH-ERC-OUN-TRY-INI-TSL-OGB-OOK
THE-WIN-GBA-NKS-LAZ-ILY-EST-UAR-IES-STI-TCH-SIL-VER

SHI-PSC-ARV-ECH-ANN-ELS-MEM-ORY
FAI-LST-OSO-UND-THE-GAP-AND-THE-HOR-IZO-NOP-ENS
INT-OBL-UES-ILE-NCE`;

const poem = `Pattern Recognition

The glass is blurry, streaked. Below, a glacial line uncoils
into an endless fjord. I watch a plume ascend
from a factory toward the turning nimbi.

I rest my head against the rim and picture the carbon line cast behind,
charcoal mist thinning, a faint tracing. Contrails
fracture into Rorschach blooms.

My own strange smudge (my father's pipe would also dream up loss)
dissipates as turbulence thickens, metallic taste swelling,
memory's compass free in my mouth.

Berlin. I was barely eight. Lamps glazing the stairs,
I learned exile's texture counting stations like candies,
jotting hashes in an underground ledger I believed in,

the record only I would care to track. Some kid called me "Ausländer,"
and even if I had no German, still I rode the geometric U-Bahn,
collecting stations, a child's attempt at a home.

The cabin hums. A murmur of voices; Spanish mingling with Mandarin;
earbuds leaking Brazilian funk. Far off, an ice shelf tears—condensation
rings shimmer underneath my cup, mimicking meltwater,

a warning I ignore. I remember my last obsession: Tempelhof,
the station I never crossed off the list, the piece hiding, out of sight,
maybe under my bed, more palpable in absence than all other pieces.

I still search for a missing sign,
even today as exile writes another country in its logbook.
The wing banks lazily; estuaries stitch silver;

ships carve channels; memory
fails to sound the gap; and the horizon opens
into blue silence.`;

const findAirportByCode = (code) => {
  return airportData.find((a) => a.code === code);
};

const App = () => {
  const [bubbleStyle, setBubbleStyle] = useState({ top: "-1000px", left: "-1000px" });
  const transitionTimeoutRef = useRef(null);

  const setBubblePosition = (rect, type) => {
    const contentRect = displayRef.current.getBoundingClientRect();
    const infoBubbleRect = bubbleRef.current.getBoundingClientRect();

    const AL = rect.left;
    const AR = contentRect.width - rect.right;
    const AT = rect.top;
    const AB = contentRect.height - rect.bottom;

    const maxHorizontalSpace = Math.max(AL, AR);
    const maxVerticalSpace = Math.max(AT, AB);

    const bubbleStyle = {};

    if (type === "line") {
      bubbleStyle.left = rect.left + (rect.width - infoBubbleRect.width) / 2;
    } else {
      bubbleStyle.left = (maxHorizontalSpace === AL)
        ? rect.left - infoBubbleRect.width
        : rect.right;
    }

    bubbleStyle.top = (maxVerticalSpace === AT)
      ? rect.top - infoBubbleRect.height
      : rect.bottom;

    setBubbleStyle(bubbleStyle);
  };

  const [selectedAirport, setSelectedAirport] = useState(null);
  const [displayPoem, setDisplayPoem] = useState(true);
  const [transitionPhase, setTransitionPhase] = useState("idle");
  const displayRef = useRef();
  const [selectedLineData, setSelectedLineData] = useState(null);
  const [selectedCode, setSelectedCode] = useState(null);
  const [airportMapError, setAirportMapError] = useState(false);
  const bubbleRef = useRef();
  const [highlightedLine, setHighlightedLine] = useState(null);

  // classify emissions (optional styling hook)
  const getEmissionsIntensity = (carbonFootprint) => {
    const match = carbonFootprint.match(/[\d,]+\.?\d*/);
    if (!match) return "normal";
    const emissions = parseFloat(match[0].replace(/,/g, ""));
    const highEmissionThreshold = 1500000;
    return emissions > highEmissionThreshold ? "high" : "normal";
  };

  // Static map via the Netlify proxy (API key stays server-side, as in concealed)
  const getSecureMapUrl = (airport) => {
    if (!airport || !airport.lat || !airport.lon) return null;

    const params = new URLSearchParams({
      center: `${airport.lat},${airport.lon}`,
      zoom: "6",
      size: "600x400",
      maptype: "roadmap",
      markers: `color:red|${airport.lat},${airport.lon}`,
      v: "4",
    });
    return `/.netlify/functions/maps?${params.toString()}`;
  };

  useEffect(() => {
    setAirportMapError(false);
  }, [selectedAirport]);

  useEffect(() => {
    if (selectedAirport && selectedCode && bubbleRef.current && displayRef.current) {
      const codeTarget = document.querySelector(`.code.selected-code`);
      if (codeTarget) {
        const rect = codeTarget.getBoundingClientRect();
        setBubblePosition(rect, "code");
      }
    }
  }, [selectedAirport, selectedCode]);

  useLayoutEffect(() => {
    if (selectedLineData && bubbleRef.current && displayRef.current) {
      const lineElement = document.querySelector(`.poem-line.highlighted-line`);
      if (lineElement) {
        const rect = lineElement.getBoundingClientRect();
        setBubblePosition(rect, "line");
      }
    }
  }, [selectedLineData]);

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  const toggleDisplayMode = () => {
    if (!ENABLE_FADE_TRANSITION) {
      setDisplayPoem((prev) => !prev);
      return;
    }

    if (transitionPhase !== "idle") return;

    setTransitionPhase("out");
    transitionTimeoutRef.current = setTimeout(() => {
      setDisplayPoem((prev) => !prev);
      setTransitionPhase("in");
      transitionTimeoutRef.current = setTimeout(() => {
        setTransitionPhase("idle");
      }, FADE_IN_DURATION);
    }, FADE_OUT_DURATION);
  };

  const handleLineClick = (event, globalLineIndex) => {
    event.stopPropagation();
    if (linesData[globalLineIndex]) {
      setSelectedLineData(linesData[globalLineIndex]);
      setHighlightedLine(globalLineIndex);
      const rect = event.target.getBoundingClientRect();
      setBubblePosition(rect, "line");
    }
  };

  const handleClick = (event) => {
    // In poem mode, open line info bubbles.
    if (event.target.classList.contains("poem-text") && displayPoem) {
      const lineElement = event.target.closest(".poem-line");
      if (lineElement) {
        handleLineClick(event, parseInt(lineElement.dataset.index, 10));
        return;
      }
    }

    const codeTarget = event.target.closest(".code");
    if (codeTarget) {
      const tappedCode = codeTarget.textContent;
      const airport = findAirportByCode(tappedCode);
      setSelectedAirport(airport);
      setSelectedCode(tappedCode);
      setHighlightedLine(null);
      if (bubbleRef.current && displayRef.current) {
        const rect = codeTarget.getBoundingClientRect();
        setBubblePosition(rect, "code");
      }
      return;
    }

    if (!event.target.closest(".info-bubble")) {
      if (!selectedAirport && !selectedLineData) {
        toggleDisplayMode();
      } else {
        setSelectedAirport(null);
        setSelectedLineData(null);
        setSelectedCode(null);
        setHighlightedLine(null);
        setBubbleStyle({ top: "-1000px", left: "-1000px" });
      }
    }
  };

  let globalLineIndex = 0;

  return (
    <div className="App" ref={displayRef} onClick={handleClick}>
      <div className="content-container">
        <div className="credits-container">
          <span className="credits-text">Poem: Pedro Poitevin | Photo: Arturo Godoy</span>
        </div>

        <div
          className={`content-window${
            selectedAirport ? " selected-airport"
            : selectedLineData ? " selected-line-data"
            : ""
          }`}
        >
          <div className="content-window">
            <div className="responsive-container">
              <div className={`monospace transition-${transitionPhase}`}>
                {displayPoem
                  ? poem.split("\n\n").map((stanza, stanzaIndex) => (
                      <div
                        key={stanzaIndex}
                        className={`stanza${stanzaIndex === 0 ? " poem-title-stanza" : ""}`}
                      >
                        {stanza.split("\n").map((line) => {
                          const currentLineIndex = globalLineIndex++;
                          return (
                            <div
                              key={currentLineIndex}
                              data-index={currentLineIndex}
                              className={`poem-line ${
                                highlightedLine === currentLineIndex ? "highlighted-line" : ""
                              }`}
                            >
                              <div className="poem-text-container">
                                <span
                                  className={`poem-text${
                                    stanzaIndex === 0 ? " poem-title-text" : ""
                                  }`}
                                >
                                  {line}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))
                  : airportCodes.split("\n\n").map((stanza, stanzaIndex) => (
                      <div key={stanzaIndex} className="stanza">
                        {stanza.split("\n").map((line, lineIndex) => (
                          <div
                            key={`${stanzaIndex}-${lineIndex}`}
                            className={lineIndex === 0 ? "airport-codes-title" : ""}
                          >
                            {line.split("-").map((code, idx) => (
                              <React.Fragment key={idx}>
                                <span
                                  className={`code${selectedCode === code ? " selected-code" : ""}`}
                                >
                                  {code}
                                </span>
                                {idx !== line.split("-").length - 1 && "-"}
                              </React.Fragment>
                            ))}
                          </div>
                        ))}
                      </div>
                    ))}
              </div>
            </div>

            <div
              ref={bubbleRef}
              className={`info-bubble${
                (selectedAirport || (selectedLineData && displayPoem)) ? " show-info" : ""
              }`}
              style={bubbleStyle}
            >
              {selectedAirport && (
                <div className="airport-info-window info-window">
                  {!airportMapError && (
                    <img
                      className="airport-map"
                      src={getSecureMapUrl(selectedAirport)}
                      alt=""
                      aria-hidden="true"
                      onError={() => setAirportMapError(true)}
                    />
                  )}
                  {airportMapError && <div className="airport-map-placeholder is-error" />}
                  <div className="info">
                    <div className="airport-name">
                      <strong>{selectedAirport.name}</strong>
                    </div>
                    <div className="country">
                      <strong>{selectedAirport.country}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Only show per-line info bubble in Poem view */}
              {selectedLineData && (
                <div
                  className="line-data-window info-window line-data-window-custom"
                  data-high-emissions={getEmissionsIntensity(selectedLineData["carbon-footprint"]) === "high"}
                >
                  <div className="line-data">
                    <div className="itinerary">
                      <strong>{selectedLineData.itinerary}</strong>
                    </div>
                    <div style={{ margin: "10px 0" }} />
                    <div className="length">
                      <strong>{selectedLineData.length}</strong>
                    </div>
                    <div style={{ margin: "10px 0" }} />
                    <div className="carbon-footprint">
                      <strong>{selectedLineData["carbon-footprint"]}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="cta-container">
          <button className="cta-button">Tap Anywhere to Explore</button>
        </div>
      </div>
    </div>
  );
};

export default App;
