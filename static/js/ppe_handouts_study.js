const flashcardsData = [

    // THERMODYNAMICS - DAY 1
    { question: "The study of heat and work", answer: "Thermodynamics" },
    { question: "A working substance whose chemical composition remains the same even if there is a change in phase (example: water)", answer: "Pure substance" },
    { question: "A working substance that remains in gaseous state during its operating cycle and follows PV = mRT (example: air)", answer: "Ideal gas" },
    { question: "The pressure reading from a gage instrument higher or lower than atmospheric pressure", answer: "Gage pressure" },
    { question: "A pressure that is less than atmospheric pressure", answer: "Vacuum pressure" },
    { question: "The sum of gage pressure and atmospheric pressure", answer: "Absolute pressure" },
    { question: "The degree of hotness or coldness of a substance or body", answer: "Temperature" },
    { question: "An instrument used to measure the temperature of a body or a substance", answer: "Thermometer" },
    { question: "An instrument used to measure high temperature gases", answer: "Pyrometer" },
    { question: "The mass per unit volume of a substance", answer: "Density" },
    { question: "The volume per unit of mass in a substance; reciprocal of density", answer: "Specific volume" },
    { question: "The ratio of the density of a substance to the density of a standard (water for liquid, air for gas)", answer: "Specific gravity" },
    { question: "The heat energy due to the movement of molecules within a substance", answer: "Internal energy" },
    { question: "The energy required to push fluid into or out of a control volume (pressure × specific volume)", answer: "Flow work" },
    { question: "The sum of internal energy and flow work", answer: "Enthalpy" },
    { question: "The enthalpy including the kinetic energy term", answer: "Stagnation enthalpy" },
    { question: "A property measuring disorder or unavailable energy for work", answer: "Entropy" },
    { question: "Energy produced due to change in elevation", answer: "Potential energy" },
    { question: "Energy produced due to mass and velocity", answer: "Kinetic energy" },
    { question: "The product of force and displacement in its direction", answer: "Work" },
    { question: "Law stating that if two bodies are in thermal equilibrium with a third body, they are in equilibrium with each other", answer: "Zeroth Law of Thermodynamics" },
    { question: "Law stating that one form of energy may be converted into another", answer: "First Law of Thermodynamics" },
    { question: "Law stating that it is impossible to construct a heat engine operating in a cycle that converts all heat from a hot source into work", answer: "Second Law of Thermodynamics (Kelvin-Planck)" },
    { question: "Law stating that the entropy of a pure crystalline substance at absolute zero is zero", answer: "Third Law of Thermodynamics" },
    { question: "Constant pressure specific heat of air", answer: "cp = 1.0 kJ/kg-K or 0.24 Btu/lb-R" },
    { question: "Constant volume specific heat of air", answer: "cv = 0.7186 kJ/kg-K or 0.171 Btu/lb-R" },
    { question: "Gas constant for air", answer: "R = 0.287 kJ/kg-K or 53.3 ft-lb/lb-R" },
    { question: "Specific heat ratio for cold air", answer: "k = 1.4" },
    { question: "Specific heat ratio for hot air", answer: "k = 1.3" },
    { question: "Standard density of air", answer: "1.20 kg/m³ or 0.0749 lb/ft³" },
    { question: "Standard temperature of air", answer: "70°F or 21.11°C" },
    { question: "Standard pressure of air", answer: "14.7 psi or 101.325 kPa" },

    // PROCESSES - DAY 2
    { question: "A process with no friction loss", answer: "Reversible process" },
    { question: "A process with no heat transfer; system perfectly insulated", answer: "Adiabatic process" },
    { question: "Process at constant volume", answer: "Isochoric (Isometric or Isovolumic) process" },
    { question: "Process at constant pressure", answer: "Isobaric process" },
    { question: "Process at constant temperature", answer: "Isothermal (Hyperbolic) process" },
    { question: "A reversible adiabatic process with constant entropy", answer: "Isentropic process" },
    { question: "An internally reversible process with pressure and volume related by an exponent", answer: "Polytropic process" },
    { question: "The most efficient thermodynamic cycle", answer: "Carnot cycle" },
    { question: "The high temperature source in Carnot cycle", answer: "Temperature source" },
    { question: "The low temperature sink in Carnot cycle", answer: "Temperature sink" },
    { question: "The spark-ignition type of engine cycle", answer: "Otto cycle" },
    { question: "The ratio of cylinder volume at bottom dead center to top dead center in Otto cycle", answer: "Compression ratio" },

    // DIESEL & BRAYTON CYCLES - DAY 3
    { question: "The compression-ignition type of engine cycle", answer: "Diesel cycle" },
    { question: "The ratio of volume at fuel injection to volume before injection in Diesel cycle", answer: "Cut-off ratio" },
    { question: "The ratio of cylinder volume before and after expansion in Diesel cycle", answer: "Expansion ratio" },
    { question: "The open cycle gas turbine cycle", answer: "Brayton cycle" },
    { question: "The ratio of compressor work to turbine work in Brayton cycle", answer: "Backwork ratio" },
    { question: "Molecular weight of ammonia (NH₃)", answer: "17" },
    { question: "Molecular weight of helium", answer: "4" },
    { question: "Molecular weight of air", answer: "28.97" },
    { question: "Molecular weight of oxygen (O₂)", answer: "32" },
    { question: "Molecular weight of nitrogen (N₂)", answer: "28" },
    { question: "Molecular weight of carbon dioxide (CO₂)", answer: "44" },
    { question: "Specific heat ratio for helium", answer: "k = 1.667" },
    { question: "Percentage of oxygen in air by volume", answer: "21%" },
    { question: "Percentage of nitrogen in air by volume", answer: "79%" },
    { question: "Percentage of oxygen in air by weight", answer: "23.20%" },
    { question: "Percentage of nitrogen in air by weight", answer: "76.80%" },
    { question: "Number of moles of nitrogen per mole of oxygen in air", answer: "3.76" },

    // PURE SUBSTANCE - DAY 4
    { question: "A liquid that is not about to vaporize", answer: "Sub-cooled liquid (Compressed liquid)" },
    { question: "A liquid that is about to vaporize", answer: "Saturated liquid" },
    { question: "A vapor that is about to condense", answer: "Saturated vapor" },
    { question: "A vapor that is not about to condense", answer: "Superheated vapor" },
    { question: "The gaseous phase in contact with liquid phase", answer: "Vapor" },
    { question: "The difference between actual temperature of superheated vapor and saturation temperature", answer: "Degrees superheat" },
    { question: "The difference between saturation temperature at given pressure and actual subcooled liquid temperature", answer: "Degrees subcooled" },
    { question: "A mixture of saturated vapor and saturated liquid", answer: "Wet vapor (Mixture)" },
    { question: "The point at which saturated liquid and saturated vapor are identical", answer: "Critical point" },
    { question: "The ratio of mass of vapor to total mass of mixture", answer: "Quality" },
    { question: "The ratio of mass of liquid to total mass of mixture", answer: "Moisture" },
    { question: "Subscript representing properties of saturated liquid", answer: "f" },
    { question: "Subscript representing properties of saturated vapor", answer: "g" },
    { question: "Subscript representing difference between vapor and liquid values", answer: "fg" },
    { question: "A process where enthalpy remains constant", answer: "Throttling process" },
    { question: "Coefficient describing temperature change per unit pressure drop in throttling", answer: "Joule-Thomson Coefficient" },
    { question: "Most common steam cycle using water as working fluid", answer: "Rankine cycle" },
    { question: "Steam cycle that reheats steam after partial expansion", answer: "Reheat cycle" },
    { question: "Specific heat of ice", answer: "2.094 kJ/kg·°C" },
    { question: "Latent heat of fusion of water", answer: "335 kJ/kg" },

    // FUELS & COMBUSTION - DAY 5
    { question: "The ratio of density of fuel to density of water", answer: "Specific gravity" },
    { question: "A petroleum unit of measurement expressed as (141.5/SG at 15.6°C) - 131.5", answer: "Degrees API (°API)" },
    { question: "A unit for brine expressed as 140/(SG at 15.6°C) - 130", answer: "Degrees Baume (°Baume)" },
    { question: "The amount of heat energy released during complete combustion of fuel", answer: "Heating value" },
    { question: "The minimum air required for complete combustion", answer: "Theoretical air" },
    { question: "Air supplied beyond the theoretical requirement", answer: "Excess air" },
    { question: "Plant capacity minus peak load", answer: "Reserve over peak" },
    { question: "Total energy in kW-hr divided by number of hours", answer: "Average load" },
    { question: "The ratio of average load to peak load", answer: "Load factor" },
    { question: "The ratio of actual energy produced to maximum possible for that period", answer: "Capacity factor" },
    { question: "The ratio of actual energy to plant capacity times hours of operation", answer: "Use factor" },
    { question: "The ratio of actual maximum demand to connected load", answer: "Demand factor" },
    { question: "The ratio of sum of individual demands to maximum simultaneous demand", answer: "Diversity factor" },
    { question: "The ratio of average load to rated capacity of system", answer: "Plant factor" },
    { question: "The ratio of maximum demand to rated capacity of supply equipment", answer: "Utilization factor" },
    { question: "The ratio of duration of service to total time considered", answer: "Operation factor" },
    { question: "Rated boiler horsepower for water tube boilers equal to heating surface area divided by 10", answer: "Rated boiler horsepower (water tube)" },
    { question: "Rated boiler horsepower for fire tube boilers equal to heating surface area divided by 12", answer: "Rated boiler horsepower (fire tube)" },
    { question: "Boiler horsepower developed based on steam production and enthalpy change", answer: "Developed boiler horsepower" },
    { question: "Conversion factor for one boiler horsepower", answer: "35,322 kJ/hr" },
    { question: "The ratio of developed boiler horsepower to rated boiler horsepower", answer: "Percent rating" },
    { question: "Steam production multiplied by enthalpy change from feedwater", answer: "ASME evaporation units" },
    { question: "The ratio of enthalpy change to latent heat of vaporization", answer: "Factor of evaporation" },
    { question: "The ratio of energy absorbed by steam to heat generated by fuel", answer: "Boiler efficiency" },
    { question: "Boiler efficiency minus auxiliary energy consumption", answer: "Net boiler efficiency" },
    { question: "Mass of steam produced per kilogram of fuel", answer: "Actual specific evaporation" },
    { question: "Actual specific evaporation multiplied by factor of evaporation", answer: "Equivalent specific evaporation" },
    { question: "Mass of steam multiplied by factor of evaporation", answer: "Equivalent evaporation" },

    // STEAM ENGINES & TURBINES - DAY 6
    { question: "Power developed in the cylinder of a steam engine", answer: "Indicated power" },
    { question: "Power available at the engine shaft", answer: "Brake power" },
    { question: "The difference between indicated power and brake power", answer: "Friction power" },
    { question: "The ratio of brake power to indicated power", answer: "Mechanical efficiency" },
    { question: "The ratio of indicated power to heat supplied based on enthalpy", answer: "Indicated thermal efficiency" },
    { question: "The ratio of brake power to heat supplied based on enthalpy", answer: "Brake thermal efficiency" },
    { question: "The ratio of indicated power to ideal expansion work", answer: "Indicated engine efficiency" },
    { question: "The ratio of brake power to ideal expansion work", answer: "Brake engine efficiency" },
    { question: "Mass of cooling water needed based on heat balance", answer: "Cooling water requirement" },
    { question: "The ratio of actual enthalpy drop to ideal expansion enthalpy drop", answer: "Stage efficiency" },
    { question: "The ratio of generator output to turbine output", answer: "Generator efficiency" },
    { question: "The ratio of turbine output to fuel heat supplied based on feedwater enthalpy", answer: "Brake thermal efficiency (turbine)" },
    { question: "The ratio of generator output to fuel heat supplied based on feedwater enthalpy", answer: "Combined thermal efficiency" },
    { question: "The ratio of brake power to ideal turbine work", answer: "Brake engine efficiency (turbine)" },
    { question: "The ratio of generator output to ideal turbine work", answer: "Combined efficiency" },
    { question: "A straight-line relation between steam consumption and turbine-generator load", answer: "Willan's line" },
    { question: "Power plants using heat from beneath the earth", answer: "Geothermal power plant" },
    { question: "Density of air expressed as pressure divided by RT", answer: "Density of air" },
    { question: "Density of flue gas expressed as pressure divided by RgTg", answer: "Density of flue gas" },
    { question: "Height of chimney times density difference of air and gas", answer: "Draft head" },
    { question: "Theoretical velocity in a chimney based on draft head", answer: "Theoretical velocity" },
    { question: "Actual velocity in a chimney equal to 30–50% of theoretical", answer: "Actual velocity" },

    // DIESEL POWER PLANT - DAY 7
    { question: "Heating value formula for liquid fuels", answer: "Qh = 41,130 + 139.6°API (kJ/kg)" },
    { question: "The ratio of mass of air to mass of fuel", answer: "Air-fuel ratio" },
    { question: "The volume displaced by piston in cylinder per cycle", answer: "Volume displacement" },
    { question: "Twice the stroke length times piston speed", answer: "Piston speed" },
    { question: "Product of mean effective pressure and displacement volume", answer: "Indicated power (engine)" },
    { question: "Product of torque and rotational speed", answer: "Brake power (engine)" },
    { question: "Force times moment arm in prony brake test", answer: "Torque" },
    { question: "The ratio of generator output to brake power", answer: "Generator efficiency" },
    { question: "The ratio of indicated power to heat from fuel", answer: "Indicated thermal efficiency (diesel)" },
    { question: "The ratio of brake power to heat from fuel", answer: "Brake thermal efficiency (diesel)" },
    { question: "The ratio of generator output to heat from fuel", answer: "Combined thermal efficiency (diesel)" },
    { question: "Ratio of actual air intake volume to piston displacement volume", answer: "Volumetric efficiency" },
    { question: "Fuel consumed per unit indicated power", answer: "Indicated specific fuel consumption" },
    { question: "Fuel consumed per unit brake power", answer: "Brake specific fuel consumption" },
    { question: "Fuel consumed per unit generator output", answer: "Combined specific fuel consumption" },
    { question: "Heat input per unit indicated power", answer: "Indicated heat rate" },
    { question: "Heat input per unit brake power", answer: "Engine heat rate" },
    { question: "Heat input per unit generator output", answer: "Engine-generator heat rate" },
    { question: "Relation between frequency, poles, and generator speed", answer: "Generator speed formula" },
    { question: "Elevation difference between headwater and tailwater", answer: "Gross head" },
    { question: "Head loss due to pipe friction in penstock", answer: "Friction head loss" },
    { question: "Gross head minus friction head loss", answer: "Net head" },
    { question: "Ratio of net head to gross head", answer: "Penstock efficiency" },
    { question: "Water power expressed as weight density × discharge × head", answer: "Water power" },
    { question: "Ratio of brake power to water power", answer: "Turbine efficiency" },
    { question: "Generator output based on water power and efficiencies", answer: "Hydro generator output" },
    { question: "Net head multiplied by hydraulic efficiency", answer: "Utilized head" },
    { question: "Head equation for impulse turbine", answer: "Head of Pelton turbine" },
    { question: "Head equation for reaction turbine", answer: "Head of reaction turbine" },
    { question: "Ratio of peripheral velocity to jet velocity", answer: "Peripheral coefficient" },
    { question: "Specific speed formula for hydraulic turbines", answer: "Specific speed (hydraulic turbine)" },
    { question: "Product of hydraulic, mechanical, and volumetric efficiencies", answer: "Total efficiency (turbine)" },
    { question: "Turbine type suitable for net head up to 70 ft", answer: "Propeller turbine" },
    { question: "Turbine type suitable for net head 70–110 ft", answer: "Propeller or Francis turbine" },
    { question: "Turbine type suitable for net head 110–800 ft", answer: "Francis turbine" },
    { question: "Turbine type suitable for net head 800–1300 ft", answer: "Francis or Impulse turbine" },
    { question: "Turbine type suitable for net head above 1300 ft", answer: "Impulse turbine" },

    // MACHINE FOUNDATION - DAY 8
    { question: "The process of filling clearance between machine and foundation after alignment using hardening mixture", answer: "Grouting" },
    { question: "Required weight of foundation estimated as 3–5 times machine weight or by empirical formula", answer: "Foundation weight" },
    { question: "For machine foundation, only half the soil bearing capacity is used", answer: "Safe soil bearing capacity" },
    { question: "Standard density of concrete", answer: "2406 kg/m³" },
    { question: "Concrete mixture ratio", answer: "1 part cement, 2 parts sand, 4 parts stone - Class A (1:2:4) mixture" },
    { question: "Concrete requirement for 1 cubic yard in 1:2:4 mix", answer: "6 sacks cement, 0.44 yd³ sand, 0.88 yd³ stone" },
    { question: "Steel reinforcement weight should be 0.5–1% of foundation weight", answer: "Steel reinforcement proportion" },
    { question: "Anchor bolt embedment depth should be at least 30 times bolt diameter", answer: "Anchor bolt depth" },
    { question: "Minimum curing period for foundation concrete", answer: "7 days" },
    { question: "Heat transfer through solid material", answer: "Conduction" },
    { question: "Property indicating ability of material to conduct heat", answer: "Thermal conductivity" },
    { question: "Coefficient of heat transfer at a surface", answer: "Surface film conductance" },
    { question: "Reciprocal of overall heat conductance", answer: "Thermal resistance" },
    { question: "Temperature difference averages for parallel flow heat exchanger", answer: "Arithmetic mean temperature difference (parallel flow)" },
    { question: "Temperature difference averages for counterflow heat exchanger", answer: "Arithmetic mean temperature difference (counterflow)" },
    { question: "Logarithmic mean temperature difference formula", answer: "Log mean temperature difference" },
    { question: "Heat transfer by electromagnetic waves", answer: "Radiation" },
    { question: "Emissivity factor equal to 1 for black body", answer: "Emissivity factor" },
    { question: "Heat transfer by fluid motion", answer: "Convection" },

    // PUMPS - DAY 9
    { question: "Pump with low discharge, high head, low speed, self-priming", answer: "Reciprocating pump" },
    { question: "Pump with high discharge, low head, high speed, not self-priming", answer: "Centrifugal pump" },
    { question: "Pump for viscous liquids with low discharge and low head", answer: "Rotary pump" },
    { question: "Pump for high suction lift or condensate pumping", answer: "Turbine pump" },
    { question: "Head corresponding to pressure expressed as water column height", answer: "Pressure head" },
    { question: "Head associated with velocity of fluid", answer: "Velocity head" },
    { question: "Total energy head combining pressure, velocity, elevation, friction", answer: "Total head" },
    { question: "Useful energy imparted by pump to water", answer: "Water power" },
    { question: "Ratio of water power to brake power", answer: "Pump efficiency" },
    { question: "Pump used to feed water to a boiler", answer: "Boiler feed pump" },
    { question: "Difference between static and operating water level in wells", answer: "Drawdown" },
    { question: "Head from pump centerline to discharge tank", answer: "Total dynamic head" },

    // AIR COMPRESSORS - DAY 9
    { question: "Compressor with single compression stage", answer: "Single-stage compressor" },
    { question: "Compressor with two stages and intercooling", answer: "Two-stage compressor" },
    { question: "Compression process without heat transfer", answer: "Isentropic compression" },
    { question: "Compression process with partial heat transfer", answer: "Polytropic compression" },
    { question: "Compression process at constant temperature", answer: "Isothermal compression" },
    { question: "Intermediate pressure between stages in multistage compressor", answer: "Intercooler pressure" },
    { question: "Device cooling air between stages", answer: "Intercooler" },
    { question: "Heat removed between stages in multistage compression", answer: "Heat rejected in intercooler" },

    // FANS & BLOWERS - DAY 9
    { question: "Pressure rise in fan without velocity head", answer: "Static head" },
    { question: "Head due to air velocity in fan", answer: "Velocity head" },
    { question: "Sum of static and velocity head in fan", answer: "Total head" },
    { question: "Theoretical air power produced by fan", answer: "Air power" },
    { question: "Ratio of air power to brake power in fan", answer: "Fan efficiency" },
    { question: "Ratio of static power to brake power", answer: "Static efficiency" },

    // REFRIGERATION - DAY 10
    { question: "Power required to compress refrigerant vapor", answer: "Compressor power" },
    { question: "Heat rejected by refrigerant in condenser", answer: "Heat rejected" },
    { question: "Constant enthalpy process in expansion valve", answer: "Expansion process" },
    { question: "Useful cooling effect in evaporator", answer: "Refrigerating effect" },
    { question: "Unit of refrigeration equal to 3.516 kW", answer: "One ton of refrigeration" },
    { question: "Ratio of refrigerating effect to compression work", answer: "Coefficient of performance (COP)" },
    { question: "Ratio of refrigeration effect to electrical power input", answer: "Energy efficiency ratio (EER)" },
    { question: "Difference between suction temperature and evaporator temperature", answer: "Degree of superheating" },
    { question: "Difference between condenser temperature and liquid temperature entering expansion valve", answer: "Degree of subcooling" },
    { question: "System using two refrigerants and two cycles with a common heat exchanger", answer: "Cascade refrigeration system" },
    { question: "Ideal reversed cycle with highest possible COP", answer: "Carnot refrigeration cycle" },
    { question: "Relation between COP of heat pump and COP of refrigeration", answer: "COP (heat pump) = COP (refrigeration) + 1" },
    { question: "Refrigeration load for cooling products with freezing", answer: "Product load with freezing" },
    { question: "Refrigeration load for cooling products without freezing", answer: "Product load without freezing" },

    // AIR-CONDITIONING - DAY 11
    { question: "Chart showing moist air properties such as temperature, humidity, and enthalpy", answer: "Psychrometric chart" },
    { question: "Moisture content of air expressed as kg water vapor per kg dry air", answer: "Humidity ratio" },
    { question: "Ratio of actual vapor pressure to saturation pressure at same temperature", answer: "Relative humidity" },
    { question: "Difference between dry bulb and wet bulb temperature", answer: "Wet bulb depression" },
    { question: "Process of mixing two air streams based on energy and moisture balance", answer: "Air mixing" },
    { question: "Fraction of air bypassing coil surface in air-conditioning coil", answer: "Bypass factor" },
    { question: "Difference between entering and leaving water temperatures in cooling tower", answer: "Range" },
    { question: "Difference between outlet water temperature and wet bulb temperature", answer: "Approach" },
    { question: "Ratio of actual cooling to maximum possible cooling in tower", answer: "Cooling tower efficiency" },
    { question: "Portion of water lost in cooling tower that must be replenished", answer: "Make-up water" },
    { question: "Heat associated with temperature change measurable by thermometer", answer: "Sensible heat" },
    { question: "Heat associated with phase change or moisture content change", answer: "Latent heat" },
    { question: "Ratio of sensible heat to total heat load", answer: "Sensible heat factor (SHF)" },
    { question: "Equipment that removes moisture from wet feed using heated air", answer: "Dryer" },
    { question: "Moisture content relative to total wet mass", answer: "Moisture content (wet basis)" },
    { question: "Moisture content relative to dry solid mass", answer: "Moisture content (dry basis)" },
    { question: "Drying rate proportional to moisture content above critical value", answer: "Constant rate drying period" },
    { question: "Drying rate that decreases as moisture decreases", answer: "Falling rate drying period" }

];

let currentIndex = 0;
let cardOrder = [];
let isFlipped = false;

// Initialize card order randomly
function initializeCards() {
    cardOrder = Array.from({ length: flashcardsData.length }, (_, i) => i);
    shuffleArray(cardOrder);
    displayCard();
    updateCounter();
    updateProgress();
}

// Shuffle array using Fisher-Yates algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Display current card
function displayCard() {
    const cardIndex = cardOrder[currentIndex];
    const card = flashcardsData[cardIndex];

    // Update question and answer text
    document.getElementById('question-text').textContent = card.question;
    document.getElementById('answer-text').textContent = card.answer;

    // Reset flip state
    const flashcard = document.getElementById('flashcard');
    flashcard.classList.remove('flipped');
    isFlipped = false;

    // Update button states
    updateButtons();
}

// Flip card
function flipCard() {
    const flashcard = document.getElementById('flashcard');
    flashcard.classList.toggle('flipped');
    isFlipped = !isFlipped;
}

// Next card
function nextCard() {
    if (currentIndex < cardOrder.length - 1) {
        currentIndex++;
        displayCard();
        updateCounter();
        updateProgress();
    }
}

// Previous card
function previousCard() {
    if (currentIndex > 0) {
        currentIndex--;
        displayCard();
        updateCounter();
        updateProgress();
    }
}

// Shuffle cards
function shuffleCards() {
    shuffleArray(cardOrder);
    currentIndex = 0;
    displayCard();
    updateCounter();
    updateProgress();
}

// Update counter
function updateCounter() {
    document.getElementById('current-card').textContent = currentIndex + 1;
    document.getElementById('total-cards').textContent = flashcardsData.length;
}

// Update progress bar
function updateProgress() {
    const progress = ((currentIndex + 1) / flashcardsData.length) * 100;
    document.getElementById('progress-fill').style.width = progress + '%';
}

// Update button states
function updateButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    if (prevBtn) prevBtn.disabled = currentIndex === 0;
    if (nextBtn) nextBtn.disabled = currentIndex === cardOrder.length - 1;
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        previousCard();
    } else if (e.key === 'ArrowRight') {
        nextCard();
    } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        flipCard();
    }
});

// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeCards();
});